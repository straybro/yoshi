import {
  WidgetType,
  ExperimentsConfig,
  SentryConfig,
} from 'yoshi-flow-editor-runtime/build/constants';
import t from './template';

export type TemplateControllerConfig = {
  id: string | null;
  controllerFileName: string;
  widgetType: WidgetType;
  controllerId?: string;
};

type Opts = {
  viewerScriptWrapperPath: string;
  viewerAppFileName: string;
  sentryConfig: SentryConfig | null;
  experimentsConfig: ExperimentsConfig | null;
  controllersMeta: Array<TemplateControllerConfig>;
};

const getControllerVariableName = (index: number) => `controller${index}`;

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
}>`${({ controllersMeta }) =>
  controllersMeta
    .map(
      (controller, i) =>
        `{ method: ${getControllerVariableName(i)},
          widgetType: "${controller.widgetType}",
          id: ${getControllerScriptId(controller)} }`,
    )
    .join(', ')}`;

export default t<Opts>`
  import {createControllersWithDescriptors, initAppForPageWrapper} from '${({
    viewerScriptWrapperPath,
  }) => viewerScriptWrapperPath}';
  ${({ controllersMeta }) => importsForControllers({ controllersMeta })}
  import * as viewerApp from '${({ viewerAppFileName }) => viewerAppFileName}';
  var importedApp = viewerApp;

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
    experimentsConfig
      ? `{
    scope: '${experimentsConfig.scope}'
  }`
      : 'null'};

  export const initAppForPage = initAppForPageWrapper(importedApp.initAppForPage, sentryConfig, experimentsConfig);
  export const createControllers = createControllersWithDescriptors([${({
    controllersMeta,
  }) =>
    controllerConfigs({
      controllersMeta,
    })}]);
`;
