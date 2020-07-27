import {
  SentryConfig,
  TranslationsConfig,
  DefaultTranslations,
  ExperimentsConfig,
  BIConfig,
} from 'yoshi-flow-editor-runtime/build/constants';
import t from './template';

type Opts = {
  controllerWrapperPath: string;
  controllerFileName: string;
  sentryConfig: SentryConfig | null;
  translationsConfig: TranslationsConfig | null;
  defaultTranslations: DefaultTranslations | null;
  experimentsConfig: ExperimentsConfig | null;
  biConfig: BIConfig | null;
  visitorBiLoggerPath: string | null;
  appName: string | null;
  projectName: string;
};

export default t<Opts>`
  import userController from '${({ controllerFileName }) =>
    controllerFileName}';
  import createControllerWrapper from '${({ controllerWrapperPath }) =>
    controllerWrapperPath}';

  var sentryConfig = ${({ sentryConfig }) =>
    sentryConfig
      ? `{
    DSN: '${sentryConfig.DSN}',
    id: '${sentryConfig.id}',
    projectName: '${sentryConfig.projectName}',
    teamName: '${sentryConfig.teamName}',
  }`
      : 'null'};

  var experimentsConfig = ${({ experimentsConfig }) =>
    experimentsConfig ? JSON.stringify(experimentsConfig) : 'null'};

  var translationsConfig = ${({ translationsConfig }) =>
    translationsConfig ? JSON.stringify(translationsConfig) : 'null'};

  var biConfig = ${({ biConfig }) =>
    biConfig ? JSON.stringify(biConfig) : 'null'};

  var defaultTranslations = ${({ defaultTranslations }) =>
    defaultTranslations ? JSON.stringify(defaultTranslations) : 'null'};

  ${({ visitorBiLoggerPath }) =>
    visitorBiLoggerPath
      ? `import biLogger from '${visitorBiLoggerPath}'`
      : 'var biLogger = null'};

  export default createControllerWrapper(userController, {
    sentryConfig,
    biConfig,
    experimentsConfig,
    biLogger,
    translationsConfig,
    appName: ${({ appName }) => (appName ? `"${appName}"` : 'null')},
    projectName: ${({ projectName }) => `"${projectName}"`},
    defaultTranslations,
  });
`;
