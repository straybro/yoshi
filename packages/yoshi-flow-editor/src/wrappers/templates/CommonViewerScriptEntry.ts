import {
  WidgetType,
  ExperimentsConfig,
  SentryConfig,
  DefaultTranslations,
  TranslationsConfig,
  BIConfig,
} from 'yoshi-flow-editor-runtime/build/constants';
import t from './template';

export type TemplateControllerConfig = {
  id: string | null;
  controllerFileName: string;
  widgetType: WidgetType;
  componentName: string;
  controllerId?: string;
};

type Opts = {
  viewerScriptWrapperPath: string;
  viewerEntryFileName: string | null;
  sentryConfig: SentryConfig | null;
  translationsConfig: TranslationsConfig | null;
  defaultTranslations: DefaultTranslations | null;
  experimentsConfig: ExperimentsConfig | null;
  biConfig: BIConfig | null;
  visitorBiLoggerPath: string | null;
  appName: string | null;
  projectName: string;
  controllersMeta: Array<TemplateControllerConfig>;
};

type ViewerScriptOpts = {
  viewerEntryFileName: string | null;
};

const getControllerVariableName = (index: number) => `controller${index}`;

export const viewerScriptOptionalImport = t<ViewerScriptOpts>`
  ${({ viewerEntryFileName }) =>
    viewerEntryFileName
      ? `import * as viewerApp from '${viewerEntryFileName}';
    var importedApp = viewerApp;`
      : `var importedApp = {};`}
`;

const importsForControllers = t<{
  controllersMeta: Array<TemplateControllerConfig>;
}>`
  ${({ controllersMeta }) => {
    return controllersMeta
      .map((controller, i) => {
        return `import ${getControllerVariableName(i)} from '${
          controller.controllerFileName
        }';`;
      })
      .join('\n');
  }}
`;

const getControllerScriptId = (controller: TemplateControllerConfig) => {
  const controllerScriptId = controller.controllerId || controller.id;

  return controllerScriptId ? `"${controllerScriptId}"` : controllerScriptId;
};

const controllerConfigs = t<{
  controllersMeta: Array<TemplateControllerConfig>;
  experimentsConfig: ExperimentsConfig | null;
  biConfig: BIConfig | null;
  appName: string | null;
  projectName: string;
}>`${({ controllersMeta, experimentsConfig, biConfig, appName, projectName }) =>
  controllersMeta
    .map(
      (controller, i) =>
        `{ method: ${getControllerVariableName(i)},
          widgetType: "${controller.widgetType}",
          translationsConfig: translationsConfig,
          experimentsConfig: ${
            experimentsConfig ? JSON.stringify(experimentsConfig) : 'null'
          },
          defaultTranslations: defaultTranslations,
          biLogger: biLogger,
          biConfig: ${biConfig ? JSON.stringify(biConfig) : 'null'},
          controllerFileName: "${controller.controllerFileName}",
          appName: ${appName ? `"${appName}"` : 'null'},
          projectName: "${projectName}",
          componentName: "${controller.componentName}",
          id: ${getControllerScriptId(controller)} }`,
    )
    .join(', ')}`;

export default t<Opts>`
  import {createControllersWithDescriptors, initAppForPageWrapper} from '${({
    viewerScriptWrapperPath,
  }) => viewerScriptWrapperPath}';
  ${({ controllersMeta }) => importsForControllers({ controllersMeta })}
  ${({ viewerEntryFileName }) =>
    viewerScriptOptionalImport({ viewerEntryFileName })}

  var sentryConfig = ${({ sentryConfig }) =>
    sentryConfig
      ? `{
      DSN: '${sentryConfig.DSN}',
      id: '${sentryConfig.id}',
      projectName: '${sentryConfig.projectName}',
      teamName: '${sentryConfig.teamName}',
    }`
      : 'null'};

  var experimentsConfig = ${({ experimentsConfig }) =>
    experimentsConfig ? JSON.stringify(experimentsConfig) : 'null'};

  var translationsConfig = ${({ translationsConfig }) =>
    translationsConfig ? JSON.stringify(translationsConfig) : 'null'};

  var defaultTranslations = ${({ defaultTranslations }) =>
    defaultTranslations ? JSON.stringify(defaultTranslations) : 'null'};

  ${({ visitorBiLoggerPath }) =>
    visitorBiLoggerPath
      ? `import biLogger from '${visitorBiLoggerPath}'`
      : 'var biLogger = null'};

  export const initAppForPage = initAppForPageWrapper({
    initAppForPage: importedApp.initAppForPage,
    sentry: sentryConfig,
    experimentsConfig: experimentsConfig,
    inEditor: false,
    biLogger: biLogger,
    projectName: ${({ projectName }) => `"${projectName}"`},
    biConfig: ${({ biConfig }) =>
      biConfig ? JSON.stringify(biConfig) : 'null'},
    appName: ${({ appName }) => (appName ? `"${appName}"` : 'null')},
    translationsConfig: translationsConfig,
    defaultTranslations: defaultTranslations,
  });

  export const createControllers = createControllersWithDescriptors([${({
    controllersMeta,
    appName,
    projectName,
    biConfig,
    experimentsConfig,
  }) =>
    controllerConfigs({
      controllersMeta,
      appName,
      projectName,
      biConfig,
      experimentsConfig,
    })}]);
`;
