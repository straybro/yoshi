import {
  IWidgetControllerConfig,
  IWidgetController,
} from '@wix/native-components-infra/dist/src/types/types';
import Experiments from '@wix/wix-experiments';
import { VisitorLogger } from '../generated/bi-logger-types';
import { ControllerFlowAPI } from '../flow-api/ViewerScript';
import { TranslationsConfig, ExperimentsConfig } from '../constants';
import Translations from '../i18next/Translations';
import { BILoggerProps, pickFunctions } from '../utils';

const biLoggerToProps = (logger: VisitorLogger | null): BILoggerProps => {
  return {
    biMethods: logger ? pickFunctions(logger) : {},
    biUtil: logger ? pickFunctions(logger.util) : {},
  };
};

let isCSRLoaded = false;
const onCSRLoaded = (flowAPI: ControllerFlowAPI) => () => {
  if (!isCSRLoaded) {
    flowAPI.fedopsLogger.appLoaded();
    isCSRLoaded = true;
  }
};

export const wrapUserController = ({
  controller,
  biLogger,
  translations,
  experiments,
  controllerConfig,
  experimentsConfig,
  translationsConfig,
  flowAPI,
  state,
  _controllerError,
}: {
  controller: IWidgetController;
  translationsConfig: TranslationsConfig | null;
  experimentsConfig: ExperimentsConfig | null;
  controllerConfig: IWidgetControllerConfig;
  flowAPI: ControllerFlowAPI;
  biLogger: VisitorLogger;
  state: Record<string, any>;
  translations?: Translations;
  experiments: Experiments;
  _controllerError?: Error | null;
}) => {
  const { biMethods, biUtil } = biLoggerToProps(biLogger);

  return {
    ...controller,
    pageReady: async (...args: Array<any>) => {
      // In future we are going to get rid of current setProps call and override original one with wrapper, where we can populate user's call with flow's fields.
      controllerConfig.setProps({
        __publicData__: controllerConfig.config.publicData,
        _language: flowAPI.getSiteLanguage(),
        _translations: translations?.all || {},
        _experiments: experiments.all(),
        _biMethods: biMethods,
        _biUtil: biUtil,
        _mobile: flowAPI.isMobile(),
        _enabledHOCs: {
          experiments: !!experimentsConfig,
          bi: !!flowAPI.biLogger,
          translations: translationsConfig && !translationsConfig.disabled,
        },
        // Set initial state
        state,
        onAppLoaded: onCSRLoaded(flowAPI),
      });
      let userPageReadyResult;

      if (_controllerError) {
        throw _controllerError;
      }

      // Optional `pageReady`
      if (controller.pageReady) {
        // TODO: handle errors from pageReady
        userPageReadyResult = await controller.pageReady(...args);
      }

      if (flowAPI.isSSR()) {
        flowAPI.fedopsLogger.appLoaded();
      }

      return userPageReadyResult;
    },
  };
};
