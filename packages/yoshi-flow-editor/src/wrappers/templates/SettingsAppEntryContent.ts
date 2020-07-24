import {
  SentryConfig,
  TranslationsConfig,
  DefaultTranslations,
  BIConfig,
  ExperimentsConfig,
} from 'yoshi-flow-editor-runtime/build/constants';
import t from './template';

type Opts = Record<
  'settingsWrapperPath' | 'componentFileName' | 'baseUIPath',
  string
> & {
  translationsConfig: TranslationsConfig | null;
  defaultTranslations: DefaultTranslations | null;
  projectName: string;
  experimentsConfig: ExperimentsConfig | null;
  ownerBiLoggerPath: string | null;
  appName: string | null;
  sentry: SentryConfig | null;
  biConfig: BIConfig | null;
};

export default t<Opts>`
  import React from 'react';
  import ReactDOM from 'react-dom';
  import SettingsWrapper from '${({ settingsWrapperPath }) =>
    settingsWrapperPath}';
  import Settings from '${({ componentFileName }) => componentFileName}';
  import '${({ baseUIPath }) => baseUIPath}';

  var translationsConfig = ${({ translationsConfig }) =>
    translationsConfig ? JSON.stringify(translationsConfig) : 'null'};

  var defaultTranslations = ${({ defaultTranslations }) =>
    defaultTranslations ? JSON.stringify(defaultTranslations) : 'null'};

  var biConfig = ${({ biConfig }) =>
    biConfig ? JSON.stringify(biConfig) : 'null'};

  var experimentsConfig = ${({ experimentsConfig }) =>
    experimentsConfig ? JSON.stringify(experimentsConfig) : 'null'};

  var projectName = '${({ projectName }) => projectName}';
  var appName = '${({ appName }) => appName || 'null'}';

  ${({ ownerBiLoggerPath }) =>
    ownerBiLoggerPath
      ? `import biLogger from '${ownerBiLoggerPath}'`
      : 'var biLogger = null'};

  var sentry = ${({ sentry }) =>
    sentry
      ? `{
      DSN: '${sentry.DSN}',
      id: '${sentry.id}',
      projectName: '${sentry.projectName}',
      teamName: '${sentry.teamName}',
    }`
      : 'null'};

  ReactDOM.render(React.createElement(SettingsWrapper({ Settings, sentry, translationsConfig, experimentsConfig, defaultTranslations, biConfig, biLogger, projectName, appName }), null), document.getElementById('root'));
`;
