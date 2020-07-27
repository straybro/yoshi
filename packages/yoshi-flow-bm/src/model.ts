import path from 'path';
import globby from 'globby';
import { watch } from 'chokidar';
import {
  loadModuleConfig,
  loadExportedComponentConfig,
  loadMethodConfig,
  loadPageConfig,
} from './config';
import {
  EXPORTED_COMPONENTS_CONFIG_PATTERN,
  EXPORTED_COMPONENTS_DIR,
  EXPORTED_COMPONENTS_PATTERN,
  METHODS_CONFIG_PATTERN,
  METHODS_DIR,
  METHODS_PATTERN,
  CONFIG_PATH,
  MODULE_HOOKS_PATTERN,
  PAGES_CONFIG_PATTERN,
  PAGES_DIR,
  PAGES_PATTERN,
  TRANSLATIONS_DIR,
  PAGES_MODULE_HOOKS_PATTERN,
  EXPORTED_COMPONENTS_MODULE_HOOKS_PATTERN,
  MODULE_HOOKS_EXT,
  FEDOPS_CONFIG_PATH,
} from './constants';
import {
  ExportedComponentConfig,
  ModuleConfig,
  PageConfig,
} from './config/types';

export interface ExportedComponentModel {
  componentId: string;
  absolutePath: string;
  relativePath: string;
  moduleHooksPath?: string;
  config: ExportedComponentConfig;
}
export interface PageModel extends ExportedComponentModel {
  componentName: string;
  route: string;
  config: PageConfig;
}
export interface MethodModel {
  methodId: string;
  absolutePath: string;
  relativePath: string;
}

export interface FlowBMModel {
  pages: Array<PageModel>;
  exportedComponents: Array<ExportedComponentModel>;
  methods: Array<MethodModel>;
  moduleHooksPath?: string;
  localePath?: string;
  config: ModuleConfig;
  fedopsPath?: string;
}

const getModuleHooksPattern = (absolutePath: string) => {
  const { dir, name } = path.parse(absolutePath);
  return `${dir}/${name}.${MODULE_HOOKS_EXT}`;
};

export default function createFlowBMModel(cwd = process.cwd()): FlowBMModel {
  const globFiles = (pattern: string | ReadonlyArray<string>) =>
    globby.sync(pattern, { cwd, absolute: true, onlyFiles: true });

  const globDirs = (pattern: string | ReadonlyArray<string>) =>
    globby.sync(pattern, {
      cwd,
      absolute: true,
      onlyDirectories: true,
      expandDirectories: false,
    });

  const config = loadModuleConfig(cwd);

  const getPageModel = (absolutePath: string): PageModel => {
    const { name } = path.parse(absolutePath);
    const pageConfig = loadPageConfig(config, absolutePath);

    const relativePath = path.relative(path.join(cwd, PAGES_DIR), absolutePath);
    const [moduleHooksPath] = globFiles(getModuleHooksPattern(absolutePath));

    const route = path.join(
      config.routeNamespace,
      ...relativePath.split('/').slice(0, -1),
      name !== 'index' ? name : '',
    );

    return {
      componentId: pageConfig.componentId,
      componentName: pageConfig.componentName,
      absolutePath,
      relativePath,
      moduleHooksPath,
      route,
      config: pageConfig,
    };
  };

  const getExportedComponentModel = (
    absolutePath: string,
  ): ExportedComponentModel => {
    const exportedComponentConfig = loadExportedComponentConfig(
      config,
      absolutePath,
    );

    const [moduleHooksPath] = globFiles(getModuleHooksPattern(absolutePath));

    const relativePath = path.relative(
      path.join(cwd, EXPORTED_COMPONENTS_DIR),
      absolutePath,
    );

    return {
      componentId: exportedComponentConfig.componentId,
      absolutePath,
      relativePath,
      moduleHooksPath,
      config: exportedComponentConfig,
    };
  };

  const getMethodModel = (absolutePath: string): MethodModel => {
    const { methodId } = loadMethodConfig(config, absolutePath);

    const relativePath = path.relative(
      path.join(cwd, METHODS_DIR),
      absolutePath,
    );

    return {
      methodId,
      absolutePath,
      relativePath,
    };
  };

  const pages = globFiles([
    PAGES_PATTERN,
    `!${PAGES_MODULE_HOOKS_PATTERN}`,
  ]).map(getPageModel);

  const exportedComponents = globFiles([
    EXPORTED_COMPONENTS_PATTERN,
    `!${EXPORTED_COMPONENTS_MODULE_HOOKS_PATTERN}`,
  ]).map(getExportedComponentModel);

  const methods = globFiles(METHODS_PATTERN).map(getMethodModel);

  const [moduleHooksPath] = globFiles(MODULE_HOOKS_PATTERN);
  const [localePath] = globDirs(TRANSLATIONS_DIR);
  const [fedopsPath] = globFiles(FEDOPS_CONFIG_PATH);

  return {
    config,
    pages,
    exportedComponents,
    methods,
    localePath,
    moduleHooksPath,
    fedopsPath,
  };
}

export function watchFlowBMModel(
  handler: (model: FlowBMModel) => void,
  cwd = process.cwd(),
) {
  const watcher = watch(
    [
      CONFIG_PATH,
      PAGES_PATTERN,
      PAGES_CONFIG_PATTERN,
      PAGES_MODULE_HOOKS_PATTERN,
      EXPORTED_COMPONENTS_PATTERN,
      EXPORTED_COMPONENTS_CONFIG_PATTERN,
      EXPORTED_COMPONENTS_MODULE_HOOKS_PATTERN,
      METHODS_PATTERN,
      METHODS_CONFIG_PATTERN,
      MODULE_HOOKS_PATTERN,
      TRANSLATIONS_DIR,
    ],
    {
      cwd,
    },
  );

  watcher.on('all', () => handler(createFlowBMModel(cwd)));
}
