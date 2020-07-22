import querystring from 'querystring';
import semver from 'semver';
import biLoggerClient, { BiLoggerFactory } from 'wix-bi-logger-client';
import initSchemaLogger, { getLoggerConf } from 'bi-logger-yoshi';
import isCI from 'is-ci';
import fetch from 'node-fetch';

const debug = require('debug')('yoshi:telemetry');

const biLoggerFactory = biLoggerClient.factory() as BiLoggerFactory<
  ReturnType<typeof getLoggerConf>
>;

// Register a custom publisher that uses Node's HTTPS API
biLoggerFactory.addPublisher(async (eventParams: any, context: any) => {
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

biLogger.util.updateDefaults({
  isCI,
  nodeVersion: `${semver.parse(process.version)?.major}`,
  yoshiVersion: `${semver.parse(yoshiVersion)?.major}`,
});

export function createProject(
  templateName: string,
  projectName: string,
  projectLanguage: string,
  email: string,
) {
  return biLogger.createProject({
    templateName,
    projectName,
    projectLanguage,
    email,
  });
}
