import { multipleValidOptions } from 'jest-validate';
import {
  InitialExportedComponentConfig,
  InitialMethodConfig,
  InitialModuleConfig,
  InitialPageConfig,
} from './types';

export const validModuleConfig: InitialModuleConfig = {
  moduleId: 'module-id',
  moduleConfigurationId: 'parent-module-id',
  appDefId: '00000000-0000-0000-0000-000000000000',
  routeNamespace: 'some-route',
  translations: multipleValidOptions(
    undefined,
    {
      default: 'en',
    },
    { default: 'de', suspense: false },
  ),
  sentry: multipleValidOptions(
    undefined,
    {
      DSN: 'some-sentry-dsn',
    },
    {
      DSN: 'some-other-sentry-dsn',
      id: 'some-sentry-id',
      teamName: 'some-sentry-team',
      projectName: 'some-sentry-project',
    },
  ),
  experimentsScopes: ['yoshi', 'wos'],
  bi: 'some-schema-logger-name',
  moduleBundleName: 'some-module',
  topology: multipleValidOptions(
    {
      fooUrl: { artifactId: 'foo' },
    },
    { barUrl: { artifactId: 'bar' } },
  ),
};

const validLegacyBundleConfig = {
  bundleName: 'some-legacy-bundle-name',
  lazyComponentId: 'some-legacy-page-component-id',
};

export const validPageConfig: InitialPageConfig = {
  componentId: 'component-id',
  componentName: 'component-name',
  legacyBundle: validLegacyBundleConfig,
};

export const validExportedComponentConfig: InitialExportedComponentConfig = {
  componentId: 'component-id',
  legacyBundle: validLegacyBundleConfig,
};

export const validMethodConfig: InitialMethodConfig = {
  methodId: 'method-id',
};
