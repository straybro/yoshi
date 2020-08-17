import {
  IWidgetControllerConfig,
  IPlatformServices,
  IWidgetController,
  IWixAPI,
} from '@wix/native-components-infra/dist/src/types/types';
import { CreateControllerFn, IControllerAppData } from './types';
import {
  ControllerFlowAPI,
  ViewerScriptFlowAPI,
} from './flow-api/ViewerScript';
import {
  SentryConfig,
  ExperimentsConfig,
  BIConfig,
  DefaultTranslations,
  TranslationsConfig,
} from './constants';
import { VisitorBILoggerFactory } from './generated/bi-logger-types';
import { wrapUserController } from './helpers/wrapUserController';

export interface ControllerWrapperOptions {
  sentryConfig: SentryConfig | null;
  experimentsConfig: ExperimentsConfig | null;
  inEditor: boolean;
  biConfig: BIConfig;
  biLogger: VisitorBILoggerFactory | null;
  appName: string | null;
  projectName: string;
  defaultTranslations: DefaultTranslations | null;
  translationsConfig: TranslationsConfig | null;
}

export default (
  controllerFn: CreateControllerFn,
  {
    sentryConfig,
    biConfig,
    experimentsConfig,
    biLogger,
    projectName,
    inEditor,
    translationsConfig,
    defaultTranslations,
    appName,
  }: ControllerWrapperOptions,
) => async ({
  controllerConfig,
  appData,
  flowAPI,
  platformServices,
  wixApi,
}: {
  controllerConfig: IWidgetControllerConfig;
  appData: IControllerAppData;
  flowAPI?: ControllerFlowAPI | null;
  platformServices?: IPlatformServices;
  wixApi?: IWixAPI;
}) => {
  // If flowAPI passed - it means it's already inited and we shouldn't provide additional actions.
  if (flowAPI) {
    return controllerFn.call(null, {
      controllerConfig,
      flowAPI,
      appData,
    });
  }

  const prepopulatedData = appData.__prepopulated;
  const context = {
    state: {},
  };

  const viewerScriptFlowAPI = new ViewerScriptFlowAPI({
    experimentsConfig,
    projectName,
    sentry: sentryConfig,
    platformServices,
    wixAPI: wixApi ?? controllerConfig.wixCodeApi,
    translationsConfig,
    defaultTranslations,
    inEditor,
    biConfig,
    biLogger,
    appName,
    prepopulatedData,
  });

  flowAPI = new ControllerFlowAPI({
    viewerScriptFlowAPI,
    appDefinitionId: controllerConfig.appParams?.appDefinitionId,
    translationsConfig,
    widgetId: controllerConfig.type,
    biLogger,
    controllerConfig,
    prepopulatedData,
  });

  const [translations, experiments] = await Promise.all([
    viewerScriptFlowAPI.translations?.init({
      prepopulated: prepopulatedData?.translations,
    }),
    flowAPI.getExperiments(),
  ]);

  const userControllerPromise = controllerFn.call(context, {
    controllerConfig,
    flowAPI,
    appData,
  });

  let _controllerError: Error | null = null;
  let userController: IWidgetController;
  try {
    userController = await userControllerPromise;
  } catch (error) {
    flowAPI.reportError(error);
    _controllerError = error;
    userController = {} as any;
  }

  return wrapUserController({
    controller: userController,
    translations,
    experiments,
    biLogger: flowAPI.biLogger,
    controllerConfig,
    flowAPI,
    experimentsConfig,
    translationsConfig,
    state: context.state,
    _controllerError,
  });
};
