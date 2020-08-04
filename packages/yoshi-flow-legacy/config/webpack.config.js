const { isObject } = require('lodash');
const {
  createBaseWebpackConfig,
  getStyleLoaders: getCommonStyleLoaders,
} = require('yoshi-common/build/webpack.config');
const projectConfig = require('yoshi-config');
const {
  isSingleEntry,
  isProduction: checkIsProduction,
  inTeamCity: checkInTeamCity,
  isTypescriptProject: checkIsTypescriptProject,
} = require('yoshi-helpers/build/queries');
const { defaultEntry } = require('yoshi-helpers/build/constants');

const isProduction = checkIsProduction();
const inTeamCity = checkInTeamCity();
const isTypescriptProject = checkIsTypescriptProject();

const computedSeparateCss =
  projectConfig.separateCss === 'prod'
    ? inTeamCity || isProduction
    : projectConfig.separateCss;

const separateStylableCss =
  projectConfig.enhancedTpaStyle || projectConfig.separateStylableCss;

const defaultSplitChunksConfig = {
  chunks: 'all',
  name: 'commons',
  minChunks: 2,
};

const useSplitChunks = projectConfig.splitChunks;

const useYoshiServer = projectConfig.yoshiServer;

const splitChunksConfig = isObject(useSplitChunks)
  ? useSplitChunks
  : defaultSplitChunksConfig;

const defaultOptions = {
  name: projectConfig.name,
  useTypeScript: isTypescriptProject,
  useAngular: projectConfig.isAngularProject,
  devServerUrl: projectConfig.servers.cdn.url,
  separateCss: computedSeparateCss,
  keepFunctionNames: projectConfig.keepFunctionNames,
  separateStylableCss,
  experimentalRtlCss: projectConfig.experimentalRtlCss,
  cssModules: projectConfig.cssModules,
  externalizeRelativeLodash: projectConfig.externalizeRelativeLodash,
  performanceBudget: projectConfig.performanceBudget,
  enhancedTpaStyle: projectConfig.enhancedTpaStyle,
  tpaStyle: projectConfig.tpaStyle,
};

function getStyleLoaders({ embedCss, isHmr, tpaStyle } = {}) {
  const styleLoaders = getCommonStyleLoaders({
    ...defaultOptions,
    isDev: true,
    isHot: isHmr,
    separateCss: false,
    tpaStyle,
    embedCss,
  });

  return styleLoaders;
}

function createClientWebpackConfig({
  isAnalyze = false,
  isDebug = true,
  isHmr,
  withLocalSourceMaps,
  includeStyleLoaders = true,
  forceEmitStats = false,
} = {}) {
  const webpackConfig = createBaseWebpackConfig({
    configName: 'legacy-client',
    target: 'web',
    isDev: isDebug,
    isHot: isHmr,
    isAnalyze,
    includeStyleLoaders,
    forceEmitSourceMaps: withLocalSourceMaps,
    useYoshiServer,
    useProgressBar: false,
    forceEmitStats,
    ...defaultOptions,
  });

  const entry = projectConfig.entry || defaultEntry;

  webpackConfig.entry = isSingleEntry(entry) ? { app: entry } : entry;
  webpackConfig.output.umdNamedDefine = projectConfig.umdNamedDefine;
  webpackConfig.externals = projectConfig.externals;

  webpackConfig.resolve.alias = projectConfig.resolveAlias;

  if (useSplitChunks) {
    webpackConfig.optimization.splitChunks = splitChunksConfig;
  }

  if (projectConfig.exports) {
    webpackConfig.output = {
      ...webpackConfig.output,

      library: projectConfig.exports,
      libraryTarget: 'umd',
      globalObject: "(typeof self !== 'undefined' ? self : this)",
    };
  }

  return webpackConfig;
}

module.exports = {
  getStyleLoaders,
  createClientWebpackConfig,
};
