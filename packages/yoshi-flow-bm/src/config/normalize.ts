import defaultsDeep from 'lodash/defaultsDeep';
import { getProjectArtifactId } from 'yoshi-helpers/build/utils';
import {
  ExportedComponentConfig,
  InitialExportedComponentConfig,
  InitialMethodConfig,
  InitialModuleConfig,
  InitialPageConfig,
  MethodConfig,
  ModuleConfig,
  PageConfig,
} from './types';

export const normalizeModuleConfig = (
  initialConfig: InitialModuleConfig,
  cwd: string,
): ModuleConfig => {
  const artifactId = getProjectArtifactId(cwd)!;

  const moduleConfigDefaults: InitialModuleConfig = {
    moduleId: artifactId,
    routeNamespace: '',
    experimentsScopes: [],
    topology: {
      staticsUrl: {
        artifactId: `com.wixpress.${artifactId}`,
      },
    },
    moduleBundleName: 'module',
  };

  if (initialConfig.translations) {
    moduleConfigDefaults.translations = {
      default: 'en',
      suspense: true,
    };
  }

  return defaultsDeep(initialConfig, moduleConfigDefaults) as ModuleConfig;
};

export const normalizePageConfig = (
  initialConfig: InitialPageConfig,
  pagePath: string,
  filename: string,
  { moduleId }: ModuleConfig,
): PageConfig => {
  const componentId = `${moduleId}.pages.${filename}`;

  const pageConfigDefaults: InitialPageConfig = {
    componentId,
    componentName: componentId,
  };

  return defaultsDeep(initialConfig, pageConfigDefaults) as PageConfig;
};

export const normalizeExportedComponentConfig = (
  initialConfig: InitialExportedComponentConfig,
  componentPath: string,
  filename: string,
  { moduleId }: ModuleConfig,
): ExportedComponentConfig => {
  const componentId = `${moduleId}.components.${filename}`;

  const exportedComponentConfigDefaults: InitialExportedComponentConfig = {
    componentId,
  };

  return defaultsDeep(
    initialConfig,
    exportedComponentConfigDefaults,
  ) as ExportedComponentConfig;
};

export const normalizeMethodConfig = (
  initialConfig: InitialMethodConfig,
  methodPath: string,
  filename: string,
  { moduleId }: ModuleConfig,
): MethodConfig => {
  const methodConfigDefaults: InitialMethodConfig = {
    methodId: `${moduleId}.methods.${filename}`,
  };

  return defaultsDeep(initialConfig, methodConfigDefaults) as MethodConfig;
};
