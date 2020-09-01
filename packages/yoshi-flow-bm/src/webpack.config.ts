import { Configuration } from 'webpack';
import { createBaseWebpackConfig } from 'yoshi-common/build/webpack.config';
import { Config } from 'yoshi-config/build/config';
import { createYoshiServerEntries } from 'yoshi-common/build/webpack-utils';
import {
  isTypescriptProject,
  inTeamCity,
  isProduction,
} from 'yoshi-helpers/build/queries';
import bmExternalModules from './bmExternalModules';

const useTypeScript = isTypescriptProject();

const createDefaultOptions = (config: Config) => {
  const separateCss =
    config.separateCss === 'prod'
      ? inTeamCity() || isProduction()
      : config.separateCss;

  return {
    name: config.name!,
    useTypeScript,
    typeCheckTypeScript: useTypeScript,
    useAngular: config.isAngularProject,
    devServerUrl: config.servers.cdn.url,
    separateCss,
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
  }: {
    isDev?: boolean;
    isHot?: boolean;
    isAnalyze?: boolean;
    forceEmitSourceMaps?: boolean;
    forceEmitStats?: boolean;
  } = {},
): Configuration {
  const defaultOptions = createDefaultOptions(config);

  const clientConfig = createBaseWebpackConfig({
    configName: 'client',
    target: 'web',
    isDev,
    isHot,
    isAnalyze,
    forceEmitSourceMaps,
    forceEmitStats,
    cssModules: config.cssModules,
    ...defaultOptions,
  });

  clientConfig.externals = bmExternalModules;
  clientConfig.resolve!.alias = config.resolveAlias;

  return clientConfig;
}

export function createYoshiServerlessWebpackConfig(
  config: Config,
  { isDev, isHot }: { isDev?: boolean; isHot?: boolean } = {},
): Configuration {
  const defaultOptions = createDefaultOptions(config);

  const serverConfig = createBaseWebpackConfig({
    configName: 'server',
    target: 'node',
    isDev,
    isHot,
    ...defaultOptions,
  });
  serverConfig.entry = () =>
    createYoshiServerEntries(serverConfig.context as string);

  return serverConfig;
}
