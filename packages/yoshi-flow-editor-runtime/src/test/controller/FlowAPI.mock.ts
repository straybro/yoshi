import { IWidgetControllerConfig } from '@wix/native-components-infra/dist/src/types/types';
import { aDefaultPlatformServices } from '@wix/native-components-infra/dist/test/builders/platformServices.builder';
import { ExperimentsConfig, DefaultTranslations } from '../../constants';
import {
  ViewerScriptFlowAPI,
  ControllerFlowAPI,
} from '../../flow-api/ViewerScript';
import { wixCodeAPIMock } from './controllerConfig.mock';

export const controllerFlowAPIMock = ({
  experimentsConfig,
  controllerConfig,
  appDefinitionId,
  widgetId,
  defaultTranslations,
}: {
  experimentsConfig: ExperimentsConfig;
  controllerConfig: IWidgetControllerConfig;
  appDefinitionId: string;
  widgetId: string;
  defaultTranslations?: DefaultTranslations | null;
}) => {
  const viewerScriptFlowAPI = new ViewerScriptFlowAPI({
    experimentsConfig,
    sentry: null,
    biConfig: null,
    appName: 'app',
    projectName: 'project',
    defaultTranslations,
    biLogger: null,
    inEditor: false,
    platformServices: aDefaultPlatformServices(),
    wixAPI: wixCodeAPIMock,
    translationsConfig: {
      default: 'en',
    },
  });

  return new ControllerFlowAPI({
    biLogger: null,
    viewerScriptFlowAPI,
    translationsConfig: {
      default: 'en',
    },
    controllerConfig,
    appDefinitionId,
    widgetId,
  });
};
