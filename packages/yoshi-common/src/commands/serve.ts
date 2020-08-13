import path from 'path';
import fs from 'fs';
import loadConfig from 'yoshi-config/loadConfig';
import { getServerStartFile } from 'yoshi-helpers/build/server-start-file';
import { serverStartFileParser } from 'yoshi-helpers/build/server-start-file-parser';
import { STATICS_DIR } from 'yoshi-config/build/paths';
import { Config } from 'yoshi-config/build/config';
import { ServerProcess } from '../server-process';
import { startCDN } from '../cdn';

export type ServeOptions = {
  cwd?: string;
  env?: Record<string, string>;
};

export default async ({ cwd = process.cwd(), env }: ServeOptions = {}) => {
  process.env.NODE_ENV = 'production';
  process.env.BABEL_ENV = 'production';

  const config = loadConfig({ cwd });

  if (config.experimentalMonorepo) {
    throw new Error('use yoshi-flow-monorepo/serve instead');
  }

  return serveApp({ config, cwd, env });
};

export const serveApp = async ({
  config,
  cwd,
  env = {},
  useAppName,
}: {
  config: Config;
  cwd: string;
  env?: Record<string, string>;
  useAppName?: boolean;
}) => {
  const serverStartFile =
    serverStartFileParser(config.pkgJson) ?? getServerStartFile({ cwd });

  const staticsDir = path.join(cwd, STATICS_DIR);
  if (!fs.existsSync(staticsDir) || fs.readdirSync(staticsDir).length === 0) {
    throw new Error(
      `Error: ${staticsDir} directory is empty. Run the build before running serve`,
    );
  }

  const serverProcess = new ServerProcess({
    serverStartFile,
    appName: config.name,
    port: config.servers.app.port,
    useAppName,
    env: {
      NODE_ENV: 'development',
      ...env,
    },
  });

  const [, cdn] = await Promise.all([
    serverProcess.initialize(),
    startCDN({
      ssl: config.servers.cdn.ssl,
      port: config.servers.cdn.port,
      cwd,
    }),
  ]);

  const closeServers = () => Promise.all([serverProcess.close(), cdn.close()]);

  return closeServers;
};
