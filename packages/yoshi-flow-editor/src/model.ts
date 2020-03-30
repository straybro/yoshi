import path from 'path';
import globby from 'globby';
import { getProjectArtifactId } from 'yoshi-helpers/utils';
import { isTypescriptProject } from 'yoshi-helpers/build/queries';
import resolve from 'resolve';
import fs from 'fs-extra';
import { Config } from 'yoshi-config/build/config';

export interface FlowEditorModel {
  appName: string;
  appDefId: string | null;
  artifactId: string;
  initApp: string;
  editorEntryFileName: string | null;
  components: Array<ComponentModel>;
}

type ComponentType = 'widget' | 'page';

export interface ComponentModel {
  name: string;
  type: ComponentType;
  fileName: string;
  controllerFileName: string;
  settingsFileName: string | null;
  id: string | null;
}

export interface AppConfig {
  appDefinitionId: string;
}
export interface ComponentConfig {
  id: string;
}

const extensions = ['.tsx', '.ts', '.js', '.json'];
function resolveFrom(dir: string, fileName: string): string | null {
  try {
    return resolve.sync(path.join(dir, fileName), {
      extensions,
    });
  } catch (error) {
    return null;
  }
}

function getLocalConfig<C extends AppConfig | ComponentConfig>(
  path: string,
): C {
  return JSON.parse(fs.readFileSync(path, 'utf8'));
}

export async function generateFlowEditorModel(
  config: Config,
): Promise<FlowEditorModel> {
  const artifactId = getProjectArtifactId();
  if (!artifactId) {
    throw new Error(`artifact id not provided.
    Please insert <artifactId>yourArtifactId</artifactId> in your "pom.xml"`);
  }
  const fileExtension = isTypescriptProject() ? 'ts' : 'js';

  const rootPath = process.cwd();
  const srcPath = path.join(rootPath, 'src');
  let initApp = resolveFrom(srcPath, 'init.app');
  if (!initApp) {
    initApp = resolveFrom(srcPath, 'app');
    console.warn(
      `\`app.${fileExtension}\` is deprecated in favour of \`init.app.${fileExtension}\`. Please run \`mv ${srcPath}/app.ts ${srcPath}/init.app.ts\` 🙏`,
    );
  }
  const editorEntryFileName = resolveFrom(srcPath, 'editor.app');
  const appConfigFileName = resolveFrom(rootPath, '.application');
  const appConfig =
    appConfigFileName && getLocalConfig<AppConfig>(appConfigFileName);

  if (!initApp) {
    throw new Error(`Missing app file.
    Please create "init.app.${fileExtension}" file in "${path.resolve(
      './src',
    )}" directory`);
  }

  if (!appConfig || !appConfig.appDefinitionId) {
    console.warn(`Seems like your app doesn't contain .application.json with appDefId specified.
You should register it in dev-center and paste id of it to ".application.json" in the root directory: ${rootPath}.
For more info, visit http://tiny.cc/dev-center-registration`);
  }

  const componentsDirectories = await globby('./src/components/*', {
    onlyDirectories: true,
    absolute: true,
  });

  const componentsModel: Array<ComponentModel> = componentsDirectories.map(
    componentDirectory => {
      const componentName = path.basename(componentDirectory);
      const resolveFromComponents = resolveFrom.bind(null, componentDirectory);

      const widgetFileName = resolveFromComponents('Widget');
      const pageFileName = resolveFromComponents('Page');
      const controllerFileName = resolveFromComponents('controller');
      const settingsFileName = resolveFromComponents('Settings');
      const configFileName = resolveFromComponents('.component');
      const componentConfig =
        configFileName && getLocalConfig<ComponentConfig>(configFileName);
      const componentPathRelativeToRoot = path.relative(
        rootPath,
        componentDirectory,
      );

      // Use just console.errors on current project stage. Move to errors in future.
      if (!componentConfig || !componentConfig.id) {
        console.warn(`Seems like you added new component and didn't specify "id" for it.
You should register it in dev-center and paste id of it to ".component.json" in the widget directory: ${componentPathRelativeToRoot}.
For more info, visit http://tiny.cc/dev-center-registration`);
      }

      if (!controllerFileName) {
        throw new Error(`Missing controller file for the component in "${componentPathRelativeToRoot}".
        Please create "controller.${fileExtension}" file in "${componentPathRelativeToRoot}" directory`);
      }

      if (!widgetFileName && !pageFileName) {
        throw new Error(`Missing widget or page file for the component in "${componentPathRelativeToRoot}".
        Please create either Widget.${fileExtension} or Page.${fileExtension} file in "${componentPathRelativeToRoot}" directory`);
      }

      return {
        name: componentName,
        fileName: (widgetFileName || pageFileName) as string,
        type: widgetFileName ? 'widget' : 'page',
        controllerFileName,
        settingsFileName,
        id: componentConfig ? componentConfig.id : null,
      };
    },
  );

  return {
    appName: config.name,
    appDefId: appConfig ? appConfig.appDefinitionId : null,
    editorEntryFileName,
    artifactId,
    initApp,
    components: componentsModel,
  };
}
