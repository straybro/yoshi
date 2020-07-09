import { BaseLogger } from '@wix/fedops-logger';
import { BrowserClient } from '@sentry/browser';
import { EditorReadyOptions } from '@wix/platform-editor-sdk';
import Translations from '../i18next/Translations';
import { buildSentryOptions, getArtifact } from '../utils';
import {
  ExperimentsConfig,
  SentryConfig,
  TranslationsConfig,
  DefaultTranslations,
} from '../constants';
import { FlowAPI } from './Base';

export class EditorScriptFlowAPI extends FlowAPI {
  fedopsLogger: BaseLogger<string>;
  sentryMonitor?: BrowserClient;
  translations: Translations;
  getSiteLanguage: (defaultLanguage?: string) => string;

  constructor({
    experimentsConfig,
    platformOptions,
    artifactId,
    sentry,
    language,
    defaultTranslations,
    translationsConfig,
  }: {
    experimentsConfig: ExperimentsConfig | null;
    platformOptions: EditorReadyOptions;
    sentry: SentryConfig | null;
    artifactId: string;
    language: string;
    translationsConfig: TranslationsConfig | null;
    defaultTranslations: DefaultTranslations | null;
  }) {
    super({ experimentsConfig });

    this.getSiteLanguage = (fallbackLanguage: string = 'en') => {
      return language || fallbackLanguage;
    };

    this.translations = new Translations({
      language: this.getSiteLanguage(translationsConfig?.default),
      defaultTranslations,
      prefix: translationsConfig?.prefix,
      defaultLanguage: translationsConfig?.default,
    });

    if (sentry) {
      const sentryOptions = buildSentryOptions(
        sentry.DSN,
        'Editor:Worker',
        getArtifact(),
        true,
      );

      this.sentryMonitor = platformOptions.monitoring.createSentryMonitorForApp(
        sentryOptions.dsn,
        sentryOptions.config,
      );

      this.reportError = this.sentryMonitor!.captureException.bind(
        this.sentryMonitor,
      );
    }
    const fedopsLogger = platformOptions.monitoring.createFedopsLogger();

    // The platform has no way to know the application name there is a map in the Editor SDK that maps each appDefinitionId to an application name.
    // If your application has been added to this map, the createFedopsLogger function returns an instantiated logger that is ready to use and is configured with your application name.
    // If your application has not been added to the map, createFedopsLogger will return a factory function.
    // You should then invoke this function with your application name to instantiate your logger instance.
    this.fedopsLogger =
      typeof fedopsLogger === 'function'
        ? fedopsLogger(artifactId)
        : fedopsLogger;

    this.appLoadStarted();
  }

  private appLoadStarted = () => {
    const { appLoadStarted } = this.fedopsLogger;
    appLoadStarted.call(this.fedopsLogger);
    this.fedopsLogger.appLoadStarted = (...args) => {
      console.warn(
        "🥺 Seems like you're trying to call `fedopsLogger.appLoadStarted` and `fedopsLogger.appLoaded` in `editor.app.ts`.\nYoshi Flow Editor already logs load events, so you can remove these calls from your project.",
      );
      appLoadStarted.call(this.fedopsLogger, ...args);
    };
  };
}
