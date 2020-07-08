import chalk from 'chalk';
import execa from 'execa';
import { privateRegistry } from './constants';

export const clearConsole = () => process.stdout.write('\x1Bc');

export const npmInstall = (dir: string) => {
  console.log(
    `Running ${chalk.magenta(
      'npm install',
    )}, that might take a few minutes... ⌛ \n`,
  );

  execa.sync('npm install', {
    shell: true,
    cwd: dir,
    stdio: 'inherit',
    extendEnv: false,
    env: {
      PATH: process.env.PATH,
      // Somewhat hacky: Install from `process.env['npm_config_registry']` in PR CI
      // or from the private registry for actual users
      npm_config_registry: process.env.npm_config_registry || privateRegistry,
    },
  });
};

export const isPrivateRegistryReachable = (dir: string) => {
  try {
    execa.sync(`curl ${privateRegistry}/v1`, {
      shell: true,
      cwd: dir,
      stdio: 'pipe',
    });

    return true;
  } catch (_error) {
    return false;
  }
};

export const lintFix = (dir: string) => {
  console.log(`\nRunning ${chalk.magenta('npm run lint -- --fix')}\n`);
  execa.sync('npm run lint -- --fix', {
    shell: true,
    cwd: dir,
    stdio: 'inherit',
  });
};

export const gitInit = (dir: string) => {
  console.log(`\nRunning ${chalk.magenta('git init')}\n`);

  const { stdout } = execa.sync('git init', {
    shell: true,
    cwd: dir,
    stdio: 'pipe',
  });

  console.log(stdout + '\n');
};

export const gitCommit = (dir: string) => {
  console.log(`\nRunning ${chalk.magenta('initial commit')}`);
  execa.sync('git add -A', {
    shell: true,
    cwd: dir,
    stdio: 'ignore',
  });
  execa.sync(
    'git commit -m "Initial commit from Create Yoshi App" --no-verify',
    {
      shell: true,
      cwd: dir,
      stdio: 'ignore',
    },
  );
};

export const isInsideGitRepo = (dir: string) => {
  try {
    execa.sync('git rev-parse --is-inside-work-tree', {
      shell: true,
      cwd: dir,
      stdio: 'pipe',
    });

    return true;
  } catch (_error) {
    return false;
  }
};

export const OOI_TEMPLATE_NAME = 'flow-editor-ooi';
export const PLATFORM_TEMPLATE_NAME = 'flow-editor-platform';
export const FLOW_BM_TEMPLATE_NAME = 'flow-bm';

export const isOutOfIframe = (str: string): boolean => {
  return str === OOI_TEMPLATE_NAME;
};

export const isAppBuilder = (str: string): boolean => {
  return str === PLATFORM_TEMPLATE_NAME;
};

export const isBMFlow = (str: string) => {
  return str === FLOW_BM_TEMPLATE_NAME;
};
