import path from 'path';
import { VisitorBILoggerFactory } from './generated/bi-logger-types';

export const DEFAULT_WIX_SDK_SRC =
  'https://static.parastorage.com/services/js-sdk/1.469.0/js/wix-private.min.js';

export const OOI_WIDGET_COMPONENT_TYPE = 'WIDGET_OUT_OF_IFRAME';
export const PLATFORM_WIDGET_COMPONENT_TYPE = 'STUDIO_WIDGET';
export const PAGE_COMPONENT_TYPE = 'PAGE_OUT_OF_IFRAME';

export interface ExperimentsConfig {
  scope: string;
}

export type WidgetType =
  | typeof OOI_WIDGET_COMPONENT_TYPE
  | typeof PLATFORM_WIDGET_COMPONENT_TYPE
  | typeof PAGE_COMPONENT_TYPE;

export type SentryConfig = {
  teamName: string;
  projectName: string;
  DSN: string;
  id: string;
};

export type TranslationsConfig = {
  defaultTranslationsPath?: string;
  prefix?: string;
  default?: string;
  disabled?: boolean;
};

export type DefaultTranslations = Record<string, string> | null;

export type BIConfig = {
  owner?: string;
  visitor?: string;
};

export const biLoggerTypesFilename = path.resolve(
  __dirname,
  './generated/bi-logger-types.d.ts',
);

export type ControllerDescriptor = {
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

export type CreateControllersStrategy = 'all' | 'controller';
