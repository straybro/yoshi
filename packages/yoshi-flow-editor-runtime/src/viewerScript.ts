import {
  IWidgetControllerConfig,
  IInitAppForPage,
  IAppData,
  IPlatformAPI,
  IWixAPI,
  IPlatformServices,
} from '@wix/native-components-infra/dist/src/types/types';
import {
  SentryConfig,
  WidgetType,
  OOI_WIDGET_COMPONENT_TYPE,
  ExperimentsConfig,
  TranslationsConfig,
  DefaultTranslations,
  BIConfig,
} from './constants';
import Translations from './i18next/Translations';
import { InitAppForPageFn, CreateControllerFn } from './types';
import {
  ViewerScriptFlowAPI,
  ControllerFlowAPI,
} from './flow-api/ViewerScript';
import { VisitorBILoggerFactory } from './generated/bi-logger-types';
import { biLoggerToProps } from './utils';

let viewerScriptFlowAPI: ViewerScriptFlowAPI;
let viewerScriptTranslationsPromise: Promise<Translations> | undefined;
let appData: any = {};

let isCSRLoaded = false;
const onCSRLoaded = (flowAPI: ControllerFlowAPI) => () => {
  if (!isCSRLoaded) {
    flowAPI.fedopsLogger.appLoaded();
    isCSRLoaded = true;
  }
};

type ControllerDescriptor = {
  id: string | null;
  method: Function;
  experimentsConfig: ExperimentsConfig | null;
  translationsConfig: TranslationsConfig | null;
  defaultTranslations: DefaultTranslations | null;
  projectName: string;
  biLogger: VisitorBILoggerFactory;
  widgetType: WidgetType;
  biConfig: BIConfig;
  controllerFileName: string | null;
  appName: string | null;
  componentName: string | null;
};

const getFirstDescriptor = (descriptors: Array<ControllerDescriptor>) => {
  if (descriptors.length === 1) {
    return descriptors[0];
  }
};

const defaultControllerWrapper = (
  controllerDescriptor: ControllerDescriptor,
  controllerConfig: IWidgetControllerConfig,
) => {
  const flowAPI = new ControllerFlowAPI({
    viewerScriptFlowAPI,
    appDefinitionId: controllerConfig.appParams.appDefinitionId,
    widgetId: controllerDescriptor.id,
    translationsConfig: controllerDescriptor.translationsConfig,
    controllerConfig,
  });
  return controllerDescriptor.method({
    controllerConfig,
    flowAPI,
    appData,
  });
};

function ooiControllerWrapper(
  controllerDescriptor: ControllerDescriptor,
  controllerConfig: IWidgetControllerConfig,
) {
  const { setProps, appParams } = controllerConfig;

  const setState = (newState: any) => {
    const updatedState = {
      ...context.state,
      ...newState,
    };

    // Track state
    context.state = updatedState;

    // Run state change callback
    wrappedController.then((userController: any) => {
      if (userController.stateChange) {
        userController.stateChange();
      }
    });

    // Update render cycle
    return setProps({ state: updatedState });
  };

  const context = {
    state: {},
    setState,
  };

  const { appDefinitionId } = appParams;
  const flowAPI = new ControllerFlowAPI({
    viewerScriptFlowAPI,
    appDefinitionId,
    translationsConfig: controllerDescriptor.translationsConfig,
    widgetId: controllerDescriptor.id,
    controllerConfig,
  });

  const userControllerPromise = controllerDescriptor.method.call(context, {
    controllerConfig: flowAPI.controllerConfig,
    flowAPI,
    appData,
  });

  const wrappedController = Promise.all([
    viewerScriptTranslationsPromise,
    flowAPI.getExperiments(),
    Promise.resolve(userControllerPromise).catch((error) => {
      if (!flowAPI.inEditor) {
        // Currently platform doesn't log errors happened in worker. We want to fix it here.
        console.error(
          `❗️Error 👉 "${controllerDescriptor.appName}" app 👉 ${controllerDescriptor.componentName} controller ❗\n`,
          error,
        );
        flowAPI.reportError(error);
      }
      return { _controllerError: error };
    }),
  ]).then(([translations, experiments, userController]) => {
    const { biMethods, biUtil } = biLoggerToProps(flowAPI.biLogger);

    return {
      ...userController,
      pageReady: async (...args: Array<any>) => {
        // In future we are going to get rid of current setProps call and override original one with wrapper, where we can populate user's call with flow's fields.
        setProps({
          __publicData__: controllerConfig.config.publicData,
          _language: flowAPI.getSiteLanguage(),
          _translations: translations?.all || {},
          _experiments: experiments.all(),
          _biMethods: biMethods,
          _biUtil: biUtil,
          _mobile: flowAPI.isMobile(),
          _enabledHOCs: {
            experiments: !!controllerDescriptor.experimentsConfig,
            bi: !!flowAPI.biLogger,
            translations:
              controllerDescriptor.translationsConfig &&
              !controllerDescriptor.translationsConfig.disabled,
          },
          // Set initial state
          state: context.state,
          // Set methods
          methods: userController.methods,
          onAppLoaded: onCSRLoaded(flowAPI),
        });
        let userPageReadyResult;

        if (userController._controllerError) {
          throw userController._controllerError;
        }

        // Optional `pageReady`
        if (userController.pageReady) {
          // TODO: handle errors from pageReady
          userPageReadyResult = await userController.pageReady(...args);
        }

        if (flowAPI.isSSR()) {
          flowAPI.fedopsLogger.appLoaded();
        }

        return userPageReadyResult;
      },
      exports: userController.corvid,
    };
  });

  return wrappedController;
}

const wrapControllerByWidgetType = (
  controllerDescriptor: ControllerDescriptor,
  controllerConfig: IWidgetControllerConfig,
) => {
  switch (controllerDescriptor.widgetType) {
    case OOI_WIDGET_COMPONENT_TYPE:
      return ooiControllerWrapper(controllerDescriptor, controllerConfig);
    default:
      return defaultControllerWrapper(controllerDescriptor, controllerConfig);
  }
};

const getDescriptorForConfig = (
  type: string,
  descriptors: Array<ControllerDescriptor>,
) => {
  return (
    descriptors.find((descriptor) => descriptor.id === type) ||
    getFirstDescriptor(descriptors)
  );
};

export const createControllers = (
  createController: CreateControllerFn,
  translationsConfig: TranslationsConfig | null = null,
  experimentsConfig: ExperimentsConfig | null = null,
  defaultTranslations: DefaultTranslations | null = null,
  biConfig: BIConfig,
  biLogger: VisitorBILoggerFactory,
  projectName: string,
) => {
  return createControllersWithDescriptors([
    {
      method: createController,
      projectName,
      id: null,
      biConfig,
      translationsConfig,
      defaultTranslations,
      biLogger,
      widgetType: OOI_WIDGET_COMPONENT_TYPE,
      experimentsConfig,
      controllerFileName: null,
      componentName: null,
      appName: null,
    },
  ]);
};

export const createControllersWithDescriptors = (
  controllerDescriptors: Array<ControllerDescriptor>,
) => (controllerConfigs: Array<IWidgetControllerConfig>) => {
  // It should be called inside initAppForPage

  const wrappedControllers = controllerConfigs.map((controllerConfig) => {
    // [Platform surprise] `type` here, is a widgetId. :(
    const { type } = controllerConfig;
    const controllerDescriptor:
      | ControllerDescriptor
      | undefined = getDescriptorForConfig(type, controllerDescriptors);

    if (!controllerDescriptor) {
      throw new Error(
        `Descriptor for widgetId: "${controllerConfig.type}" was not found. Please create a ".component.json" file for current widget`,
      );
    }

    return wrapControllerByWidgetType(controllerDescriptor, controllerConfig);
  });

  return wrappedControllers;
};

interface InitAppForPageWrapperOptions {
  initAppForPage?: InitAppForPageFn;
  sentryConfig: SentryConfig | null;
  experimentsConfig: ExperimentsConfig | null;
  inEditor: boolean;
  biConfig: BIConfig;
  biLogger: VisitorBILoggerFactory;
  appName: string | null;
  projectName: string;
  defaultTranslations: DefaultTranslations | null;
  translationsConfig: TranslationsConfig | null;
}

export const initAppForPageWrapper = ({
  initAppForPage,
  sentryConfig = null,
  experimentsConfig = null,
  inEditor = false,
  projectName,
  defaultTranslations,
  translationsConfig,
  biConfig,
  biLogger,
  appName = null,
}: InitAppForPageWrapperOptions): IInitAppForPage => async (
  initParams: IAppData,
  platformAPIs: IPlatformAPI,
  namespaces: IWixAPI,
  platformServices: IPlatformServices,
) => {
  viewerScriptFlowAPI = new ViewerScriptFlowAPI({
    experimentsConfig,
    projectName,
    sentry: sentryConfig,
    platformServices,
    wixAPI: namespaces,
    translationsConfig,
    defaultTranslations,
    inEditor,
    biConfig,
    biLogger,
    appName,
  });

  viewerScriptTranslationsPromise = viewerScriptFlowAPI.translations?.init();
  await viewerScriptTranslationsPromise;

  if (initAppForPage) {
    try {
      appData = await initAppForPage(
        initParams,
        platformAPIs,
        namespaces,
        platformServices,
        viewerScriptFlowAPI,
      );
    } catch (e) {
      if (!inEditor) {
        // Currently platform doesn't log errors happened in worker. We want to fix it here.
        console.error(
          `❗️Error 👉 "${appName}" app 👉 \`viewer.app.ts\` module ❗\n`,
          e,
        );
        viewerScriptFlowAPI.reportError(e);
      }
      throw e;
    }
  }
  // appData will be available in controllers
  return appData;
};
