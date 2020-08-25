import arg from 'arg';
import WebpackManager from 'yoshi-common/build/webpack-manager';
import { cliCommand } from '../bin/yoshi-monorepo';
import { createServerPerformanceWebpackConfig } from '../webpack.config';

const build: cliCommand = async function (argv, rootConfig, { apps, libs }) {
  const args = arg(
    {
      // Types
      '--help': Boolean,

      // Aliases
      '-h': '--help',
    },
    { argv },
  );

  const { '--help': help } = args;

  if (help) {
    console.log(
      `
      Description
        Compiles the server for performance testing

      Usage
        $ yoshi-monorepo build-server-performance

      Options
        --help, -h      Displays this message
    `,
    );

    process.exit(0);
  }

  const webpackManager = new WebpackManager();

  apps.forEach((pkg) => {
    const serverPerformanceConfig = createServerPerformanceWebpackConfig(
      pkg,
      libs,
      apps,
    );

    webpackManager.addConfigs(pkg.name, [serverPerformanceConfig]);
  });

  await webpackManager.run();

  console.log('DONE!');
  console.log();
};

export default build;
