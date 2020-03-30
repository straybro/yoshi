import fs from 'fs';
import resolveCwd from 'resolve-cwd';
import chalk from 'chalk';

export default () => {
  const typescriptPath = resolveCwd.silent('typescript');

  if (typescriptPath) {
    return require(typescriptPath);
  }

  const isYarn = fs.existsSync('yarn.lock');

  console.error(
    chalk.red(
      `Transpiling ".ts" files requires ${chalk.bold(
        'typescript',
      )} to be installed but it seems we can't find it in your node_modules` +
        '\n',
    ),
  );

  console.error(
    'Please install',
    chalk.cyan.bold('typescript'),
    'by running',
    chalk.cyan.bold(
      isYarn ? 'yarn add -D typescript' : 'npm install -D typescript',
    ) + '\n',
  );

  process.exit(1);
};
