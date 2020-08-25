import React from 'react';
import {
  createEditorAppForWixSDK,
  IEditorAppWrapperOptions,
} from '../../EditorAppWrapper';
import { CreateControllerFn, InitAppForPageFn } from '../../types';
import {
  DefaultTranslations,
  BIConfig,
  ExperimentsConfig,
  SentryConfig,
  TranslationsConfig,
} from '../../constants';
import { VisitorBILoggerFactory } from '../../generated/bi-logger-types';
import { IWixSDKContext } from '../../react/SDK/SDKContext';

export const componentWrapper = ({
  component,
  controller,
  initAppForPage,
  name = 'TESTING_COMPONENT',
  defaultTranslations,
  projectName = 'TESTING_PROJECT',
  experimentsConfig,
  biLogger,
  sentryConfig,
  translationsConfig,
  biConfig,
  sdk,
  wrapperOptions,
}: {
  component: React.ComponentType;
  controller: CreateControllerFn;
  initAppForPage: InitAppForPageFn;
  name?: string;
  defaultTranslations?: DefaultTranslations;
  experimentsConfig?: ExperimentsConfig;
  sentryConfig?: SentryConfig;
  projectName?: string;
  biLogger?: VisitorBILoggerFactory;
  translationsConfig?: TranslationsConfig;
  biConfig?: BIConfig;
  sdk: IWixSDKContext;
  wrapperOptions?: IEditorAppWrapperOptions;
}) => {
  return createEditorAppForWixSDK({
    UserComponent: component,
    userController: controller,
    customInitAppForPage: initAppForPage,
    name,
    sentry: sentryConfig ?? null,
    experimentsConfig: experimentsConfig ?? null,
    translationsConfig: translationsConfig ?? {
      default: 'en',
    },
    defaultTranslations: defaultTranslations ?? null,
    projectName,
    biConfig: biConfig ?? {},
    biLogger: biLogger ?? null,
    sdk,
    wrapperOptions,
  });
};
