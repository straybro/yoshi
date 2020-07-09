import { BaseLogger } from '@wix/fedops-logger';
import {
  IWidgetControllerConfig,
  IPlatformServices,
  IWixAPI,
} from '@wix/native-components-infra/dist/src/types/types';
import {
  ExperimentsConfig,
  SentryConfig,
  TranslationsConfig,
  DefaultTranslations,
  BIConfig,
} from '../constants';
import { getSiteLanguage, isSSR, isMobile } from '../helpers';
import { buildSentryOptions, getArtifact } from '../utils';
import {
  VisitorBILoggerFactory,
  VisitorLogger,
} from '../generated/bi-logger-types';
import Translations from '../i18next/Translations';
import { FlowAPI } from './Base';

export class ControllerFlowAPI extends FlowAPI {
  controllerConfig: IWidgetControllerConfig;
  sentryMonitor?: ReturnType<IPlatformServices['monitoring']['createMonitor']>;
  fedopsLogger: BaseLogger<string>;
  inEditor: boolean;
  widgetId: string;
  biLogger?: VisitorLogger | null;
  translationsConfig: TranslationsConfig | null;
  translations: Translations;
  getSiteLanguage: (defaultLanguage?: string | undefined) => string;
  getTranslations: () => Promise<Record<string, string> | undefined>;

  constructor({
    viewerScriptFlowAPI,
    controllerConfig,
    appDefinitionId,
    translationsConfig,
    widgetId,
  }: {
    viewerScriptFlowAPI: ViewerScriptFlowAPI;
    controllerConfig: IWidgetControllerConfig;
    appDefinitionId: string;
    translationsConfig: TranslationsConfig | null;
    widgetId: string | null;
  }) {
    super({ experimentsConfig: null });
    this.widgetId = widgetId!;
    this.controllerConfig = controllerConfig;
    this.getExperiments = viewerScriptFlowAPI.getExperiments;
    this.sentryMonitor = viewerScriptFlowAPI.sentryMonitor;
    this.inEditor = viewerScriptFlowAPI.inEditor;
    this.translationsConfig = translationsConfig;
    const { platformAPIs } = controllerConfig;
    this.fedopsLogger = platformAPIs.fedOpsLoggerFactory!.getLoggerForWidget({
      appId: appDefinitionId,
      widgetId,
    });

    if (this.sentryMonitor) {
      this.reportError = this.sentryMonitor.captureException.bind(
        this.sentryMonitor,
      );
    }

    if (viewerScriptFlowAPI.biLogger) {
      this.biLogger = viewerScriptFlowAPI.biLogger;
    }

    this.appLoadStarted();

    this.getSiteLanguage = viewerScriptFlowAPI.getSiteLanguage.bind(
      viewerScriptFlowAPI,
    );
    this.getTranslations = viewerScriptFlowAPI.getTranslations.bind(this);
    this.translations = viewerScriptFlowAPI.translations;
  }

  private appLoadStarted = () => {
    const { appLoadStarted } = this.fedopsLogger;
    appLoadStarted.call(this.fedopsLogger);
    this.fedopsLogger.appLoadStarted = (...args) => {
      console.warn(
        "🥺 Seems like you're trying to call `fedopsLogger.appLoadStarted` and `fedopsLogger.appLoaded` in your controller.\nWe are already logging load events for SSR and CSR environments, so you can remove these calls from your project.",
      );
      appLoadStarted.call(this.fedopsLogger, ...args);
    };
  };

  isSSR = () => {
    return isSSR(this.controllerConfig.wixCodeApi);
  };

  isMobile = () => {
    return isMobile(this.controllerConfig.wixCodeApi);
  };
}

export class ViewerScriptFlowAPI extends FlowAPI {
  sentryMonitor?: ReturnType<IPlatformServices['monitoring']['createMonitor']>;
  inEditor: boolean;
  biLogger?: VisitorLogger | null;
  translations: Translations;
  getSiteLanguage: (defaultLanguage?: string) => string;

  constructor({
    experimentsConfig,
    platformServices,
    sentry,
    wixAPI,
    translationsConfig,
    defaultTranslations = null,
    biConfig,
    biLogger,
    inEditor,
    projectName,
    appName,
  }: {
    experimentsConfig: ExperimentsConfig | null;
    platformServices: IPlatformServices;
    sentry: SentryConfig | null;
    wixAPI: IWixAPI;
    biConfig: BIConfig | null;
    biLogger: VisitorBILoggerFactory | null;
    inEditor: boolean;
    projectName: string;
    appName: string | null;
    translationsConfig: TranslationsConfig | null;
    defaultTranslations?: DefaultTranslations | null;
  }) {
    super({ experimentsConfig });

    this.inEditor = inEditor;

    this.getSiteLanguage = (fallbackLanguage: string = 'en') => {
      return getSiteLanguage(
        wixAPI,
        fallbackLanguage || translationsConfig?.default,
      );
    };

    const language = this.getSiteLanguage(translationsConfig?.default);
    this.translations = new Translations({
      language,
      defaultTranslations,
      prefix: translationsConfig?.prefix,
      defaultLanguage: translationsConfig?.default,
    });

    const platformBI = platformServices.bi;

    if (
      biConfig?.visitor &&
      platformBI &&
      platformServices.biLoggerFactory &&
      biLogger
    ) {
      const biFactory = platformServices.biLoggerFactory();
      const biOptions = {
        visitor_id: platformBI.visitorId,
        token: platformBI.biToken,
        origin: 'viewer',
        appName,
        projectName,
        _msid: platformBI.metaSiteId,
      };
      this.biLogger = biLogger(biFactory)({});
      this.biLogger.util.updateDefaults(biOptions);
    }

    if (sentry) {
      const sentryOptions = buildSentryOptions(
        sentry.DSN,
        'Viewer:Worker',
        getArtifact(),
      );

      this.sentryMonitor = platformServices.monitoring.createMonitor(
        sentryOptions.dsn,
        (config) => ({
          ...config,
          ...sentryOptions.config,
        }),
      );

      this.reportError = this.sentryMonitor.captureException.bind(
        this.sentryMonitor,
      );
    }
  }
  getTranslations = async () => {
    return this.translations?.all;
  };
}
