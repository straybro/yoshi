import path from 'path';
import arg from 'arg';
import fs from 'fs-extra';
import chalk from 'chalk';
import DevEnvironment from 'yoshi-common/build/dev-environment';
import {
  TARGET_DIR,
  BUILD_DIR,
  SERVERLESS_DIR,
} from 'yoshi-config/build/paths';
import * as telemetry from 'yoshi-common/build/telemetry';
import { CliCommand } from '../bin/yoshi-bm';
import {
  createClientWebpackConfig,
  createYoshiServerlessWebpackConfig,
} from '../webpack.config';
import createFlowBMModel, { watchFlowBMModel } from '../model';
import { renderModule } from '../module';
import { renderModuleConfig } from '../moduleConfig';
import getEntries from '../entries';
import getStartUrl from '../start-url';
import { getMetaSiteId } from '../metaSiteId';
import { getServerStartFile } from '../start-file';
import { fetchModuleConfig } from '../bm-configs';
import { createFlowLogger } from './logger';

const join = (...dirs: Array<string>) => path.join(process.cwd(), ...dirs);

const start: CliCommand = async function (argv, yoshiConfig) {
  telemetry.startInit('BM', yoshiConfig.name);

  const args = arg(
    {
      // Types
      '--help': Boolean,
      '--production': Boolean,
      '--https': Boolean,
      '--debug': Boolean,
      '--debug-brk': Boolean,
      '--url': String,
    },
    { argv },
  );

  const {
    '--help': help,
    '--production': shouldRunAsProduction,
    '--url': url,
  } = args;

  if (help) {
    console.log(
      `
      Description
        Starts the application in development mode

      Usage
        $ yoshi-bm start

      Options
        --help, -h      Displays this message
        --server        (Deprecated!) The main file to start your server
        --production    Start using unminified production build
        --https         Serve the app bundle on https
        --debug         Allow app-server debugging
        --debug-brk     Allow app-server debugging, process won't start until debugger will be attached
    `,
    );

    process.exit(0);
  }

  // TODO: Decouple the flow from yoshi-config and inline this
  yoshiConfig.servers.cdn.ssl = true;
  yoshiConfig.servers.cdn.url = 'https://localhost:3200/';

  console.log(chalk.cyan('Starting development environment...\n'));

  if (shouldRunAsProduction) {
    process.env.BABEL_ENV = 'production';
    process.env.NODE_ENV = 'production';
  }

  await Promise.all([
    fs.emptyDir(join(BUILD_DIR)),
    fs.emptyDir(join(TARGET_DIR)),
    process.env.EXPERIMENTAL_YOSHI_SERVERLESS
      ? fs.emptyDir(join(SERVERLESS_DIR))
      : Promise.resolve(),
  ]);

  watchFlowBMModel((model) => {
    renderModule(model);
    renderModuleConfig(model);
  });

  const model = createFlowBMModel();

  const clientConfig = createClientWebpackConfig(yoshiConfig, {
    isDev: true,
    isHot: yoshiConfig.hmr as boolean,
  });

  clientConfig.entry = getEntries(model);

  let serverConfig;
  if (process.env.EXPERIMENTAL_YOSHI_SERVERLESS === 'true') {
    serverConfig = createYoshiServerlessWebpackConfig(yoshiConfig, {
      isDev: true,
      isHot: true,
    });
  }

  const [metaSiteId, prodConfig] = await Promise.all([
    getMetaSiteId(),
    fetchModuleConfig(model),
  ]);

  const logger = createFlowLogger(yoshiConfig, metaSiteId, prodConfig);

  const startUrl =
    url ??
    getStartUrl(
      model,
      model.pages[0], // pages are sorted by route so [0] is shortest
      yoshiConfig.servers.cdn,
      metaSiteId,
      prodConfig,
    );

  const serverStartFile = getServerStartFile();

  const devEnvironment = await DevEnvironment.create({
    webpackConfigs: [clientConfig, serverConfig],
    https: yoshiConfig.servers.cdn.ssl,
    webpackDevServerPort: yoshiConfig.servers.cdn.port,
    appServerPort: yoshiConfig.servers.app.port,
    appName: yoshiConfig.name,
    startUrl,
    serverStartFile,
    enableClientHotUpdates: Boolean(yoshiConfig.hmr),
    createEjsTemplates: yoshiConfig.experimentalBuildHtml,
    yoshiServer: yoshiConfig.yoshiServer,
    logger,
  });

  await devEnvironment.start();
};

export default start;
