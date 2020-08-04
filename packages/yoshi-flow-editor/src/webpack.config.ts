// eslint-disable-next-line import/no-extraneous-dependencies
import webpack from 'webpack';
import { createServerEntries } from 'yoshi-common/build/webpack-utils';
import { createBaseWebpackConfig } from 'yoshi-common/build/webpack.config';
import { Config } from 'yoshi-config/build/config';
import { isTypescriptProject } from 'yoshi-helpers/build/queries';

const useTypeScript = isTypescriptProject();

const clientExternals = {
  lodash: {
    commonjs: 'lodash',
    commonjs2: 'lodash',
    amd: 'lodash',
    root: '_',
  },
  react: {
    amd: 'react',
    umd: 'react',
    commonjs: 'react',
    commonjs2: 'react',
    root: 'React',
  },
  'react-dom': {
    amd: 'reactDOM',
    umd: 'react-dom',
    commonjs: 'react-dom',
    commonjs2: 'react-dom',
    root: 'ReactDOM',
  },
};

const createDefaultOptions = (config: Config) => {
  return {
    name: config.name as string,
    useTypeScript,
    typeCheckTypeScript: useTypeScript,
    useAngular: config.isAngularProject,
    devServerUrl: config.servers.cdn.url,
    separateCss: true,
    separateStylableCss: true,
    cssModules: true,
    enhancedTpaStyle: true,
  };
};

export function createClientWebpackConfig(
  config: Config,
  {
    isDev,
    isHot,
    isAnalyze,
    forceEmitSourceMaps,
    forceEmitStats,
    customEntry,
  }: {
    isDev?: boolean;
    isHot?: boolean;
    isAnalyze?: boolean;
    forceEmitSourceMaps?: boolean;
    forceEmitStats?: boolean;
    customEntry?: any;
  } = {},
): webpack.Configuration {
  const defaultOptions = createDefaultOptions(config);

  const clientConfig = createBaseWebpackConfig({
    configName: 'client',
    target: 'web',
    isDev,
    isHot,
    isAnalyze,
    forceEmitSourceMaps,
    externalizeRelativeLodash: true,
    forceEmitStats,
    exportAsLibraryName: '[name]',
    ...defaultOptions,
  });

  clientConfig.entry = customEntry;
  clientConfig.resolve!.alias = config.resolveAlias;
  clientConfig.externals = clientExternals;

  return clientConfig;
}

export function createServerWebpackConfig(
  config: Config,
  { isDev, isHot }: { isDev?: boolean; isHot?: boolean } = {},
): webpack.Configuration {
  const defaultOptions = createDefaultOptions(config);

  const serverConfig = createBaseWebpackConfig({
    configName: 'server',
    target: 'node',
    isDev,
    isHot,
    ...defaultOptions,
  });

  serverConfig.entry = async () =>
    process.env.EXPERIMENTAL_YOSHI_SERVERLESS
      ? createServerEntries(serverConfig.context as string)
      : {};

  return serverConfig;
}

export function createWebWorkerWebpackConfig(
  config: Config,
  {
    isDev,
    isAnalyze,
    isHot,
    customEntry,
    webWorkerExternals,
  }: {
    isDev?: boolean;
    isHot?: boolean;
    isAnalyze?: boolean;
    customEntry?: any;
    webWorkerExternals?: any;
  } = {},
): webpack.Configuration {
  const defaultOptions = createDefaultOptions(config);

  const workerConfig = createBaseWebpackConfig({
    configName: 'web-worker',
    target: 'webworker',
    isDev,
    isHot,
    isAnalyze,
    externalizeRelativeLodash: true,
    ...defaultOptions,
  });

  workerConfig.output!.library = '[name]';
  workerConfig.output!.libraryTarget = 'umd';
  workerConfig.output!.globalObject = 'self';

  workerConfig.entry = customEntry;

  workerConfig.externals = webWorkerExternals;

  return workerConfig;
}
