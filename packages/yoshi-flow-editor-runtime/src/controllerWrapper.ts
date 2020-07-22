import {
  IWidgetControllerConfig,
  IPlatformServices,
} from '@wix/native-components-infra/dist/src/types/types';
import { CreateControllerFn } from './types';
import {
  ControllerFlowAPI,
  ViewerScriptFlowAPI,
} from './flow-api/ViewerScript';

export default (controllerFn: CreateControllerFn) => ({
  controllerConfig,
  appData,
  flowAPI,
  platformServices,
}: {
  controllerConfig: IWidgetControllerConfig;
  appData: any;
  flowAPI?: ControllerFlowAPI | null;
  platformServices?: IPlatformServices;
}) => {
  // Here we want to handle using controller by external projects.
  if (!flowAPI) {
    const viewerScriptFlowAPI = new ViewerScriptFlowAPI({
      experimentsConfig: null,
      projectName: '',
      sentry: null,
      platformServices,
      wixAPI: controllerConfig.wixCodeApi,
      translationsConfig: null,
      defaultTranslations: null,
      inEditor: false,
      biConfig: null,
      biLogger: null,
      appName: null,
    });

    flowAPI = new ControllerFlowAPI({
      viewerScriptFlowAPI,
      appDefinitionId: controllerConfig.appParams.appDefinitionId,
      translationsConfig: null,
      widgetId: controllerConfig.type,
      controllerConfig,
    });
  }

  return controllerFn.call(null, {
    controllerConfig,
    flowAPI,
    appData,
  });
};
