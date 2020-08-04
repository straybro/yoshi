import querystring from 'querystring';
import semver from 'semver';
import biLoggerClient, { BiLoggerFactory } from 'wix-bi-logger-client';
import initSchemaLogger, {
  getLoggerConf,
  buildStartParams as BuildStartParams,
  startInitParams as StartInitParams,
} from 'bi-logger-yoshi';
import {
  getTypescriptVersion,
  isTypescriptProject,
} from 'yoshi-helpers/build/queries';
import isCI from 'is-ci';
import fetch from 'node-fetch';
import getWixEmail from './getWixEmail';
import { Intersection } from './utils/types';

const debug = require('debug')('yoshi:telemetry');

const biLoggerFactory = biLoggerClient.factory() as BiLoggerFactory<
  ReturnType<typeof getLoggerConf>
>;

// Register a custom publisher that uses Node's HTTPS API
biLoggerFactory.addPublisher(async (eventParams: any, context: any) => {
  // Don't collect events from yoshi's own tests
  if (process.env.NPM_PACKAGE === 'yoshi-monorepo') {
    return;
  }

  try {
    const url = `https://frog.wix.com/${
      context.endpoint
    }?${querystring.stringify(eventParams)}`;
    debug(`reporting ${url}`);
    await fetch(url);
  } catch (error) {
    debug(error);
    // Swallow errors
  }
});

const biLogger = initSchemaLogger(biLoggerFactory)();

const { version: yoshiVersion } = require('../package.json');

const biDefaults: Intersection<StartInitParams, BuildStartParams> = {
  isCI,
  nodeVersion: `${semver.parse(process.version)?.major}`,
  yoshiVersion: `${semver.parse(yoshiVersion)?.major}`,
  projectLanguage: isTypescriptProject() ? 'ts' : 'js',
  typescriptVersion: getTypescriptVersion(),
  email: getWixEmail(),
};

biLogger.util.updateDefaults(biDefaults);

export function buildStart(yoshiFlow: yoshiFlow, pkgJsonName: string) {
  return biLogger.buildStart({
    projectName: pkgJsonName,
    yoshiFlow,
  });
}

export function startInit(yoshiFlow: yoshiFlow, pkgJsonName: string) {
  return biLogger.startInit({
    projectName: pkgJsonName,
    yoshiFlow,
  });
}

type yoshiFlow = 'Editor' | 'App' | 'Legacy' | 'BM' | 'Library' | 'Monorepo';
