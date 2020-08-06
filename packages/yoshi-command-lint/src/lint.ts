import path from 'path';
import arg from 'arg';
import execa from 'execa';
import chalk from 'chalk';

import { Config } from 'yoshi-config/build/config';
import * as globs from 'yoshi-config/build/globs';

import {
  isTypescriptProject,
  isUsingTSLint,
  watchMode,
} from 'yoshi-helpers/build/queries';

import tslint from './tasks/tslint';
import eslint from './tasks/eslint';

const shouldWatch = watchMode();

type LintArgs = { formatter?: string; fix: boolean; _: Array<string> };

type FilesAccumulator = {
  jsFiles: Array<string>;
  tsFiles: Array<string>;
  styleFiles: Array<string>;
};

const parseArgs = (argv: Array<string>): LintArgs => {
  const args = arg(
    {
      // Types
      '--fix': Boolean,
      '--format': String,
      '--help': Boolean,

      // Aliases
      '-h': '--help',
    },
    {
      permissive: true,
      argv: argv[0] === 'lint' ? argv.slice(1) : argv, // legacy flow passes lint as 1st argument
    },
  );

  const { '--help': help, '--format': formatter, '--fix': fix = false } = args;

  if (help) {
    console.log(`
    Yoshi lint wrapper for ESlint/TSlint

    Usage:
      $ yoshi lint [files...]

    Options
      --fix'      'Automatically fix lint problems
      --format'   'Use a specific formatter for eslint/tslint'
      --help, -h      Displays this message
  `);

    process.exit(0);
  }

  return { formatter, fix, _: args._ };
};

const fileType = (fileName: string): 'js' | 'ts' | 'style' | undefined => {
  if (fileName.endsWith('.js')) {
    return 'js';
  }
  if (fileName.endsWith('.ts') || fileName.endsWith('.tsx')) {
    return 'ts';
  }
  if (
    fileName.endsWith('.css') ||
    fileName.endsWith('.scss') ||
    fileName.endsWith('.less')
  ) {
    return 'style';
  }
};

const groupFilesByType = (
  fileList: Array<string>,
  accumulator: FilesAccumulator,
): FilesAccumulator => {
  if (fileList.length < 1) {
    return accumulator;
  }

  return fileList.reduce((files: FilesAccumulator, fileName: string) => {
    switch (fileType(fileName)) {
      case 'js':
        files.jsFiles.push(fileName);
        break;
      case 'ts':
        files.tsFiles.push(fileName);
        break;
      case 'style':
        files.styleFiles.push(fileName);
        break;
      default:
        console.log(`Unknown file type for linter: ${fileName}`);
    }
    return files;
  }, accumulator);
};

const runTSLint = async (
  tsFilesToLint: Array<string> | undefined,
  args: LintArgs,
): Promise<any> => {
  let lintError;

  const tsconfigFilePath = path.resolve('tsconfig.json');
  const tslintFilePath = path.resolve('tslint.json');

  try {
    await tslint({
      tsconfigFilePath,
      tslintFilePath,
      pattern: tsFilesToLint,
      options: { fix: args.fix, formatter: args.formatter || 'stylish' },
    });
  } catch (error) {
    lintError = error;
  }

  return lintError;
};

const runESLint = async (
  filesToLint: Array<string> | undefined,
  args: LintArgs,
): Promise<any> => {
  let lintError;

  if (!filesToLint) {
    throw new Error('No files to lint for ESLint');
  }

  try {
    console.log(`running es lint on ${filesToLint}`);

    await eslint({
      pattern: filesToLint,
      options: {
        cache: true,
        cacheLocation: 'target/.eslintcache',
        fix: args.fix,
        formatter: args.formatter,
      },
    });
  } catch (error) {
    lintError = error;
  }

  return lintError;
};

const doLint = async (args: LintArgs, prelint?: string) => {
  if (shouldWatch) {
    return;
  }

  const { styleFiles, jsFiles, tsFiles } = groupFilesByType(args._, {
    jsFiles: [],
    tsFiles: [],
    styleFiles: [],
  });

  const shouldRunOnSpecificFiles = !!(
    jsFiles.length ||
    tsFiles.length ||
    styleFiles.length
  );

  if (prelint) {
    await execa(prelint, { stdio: 'inherit', shell: true });
  }

  let filesToLint, linterFunc;

  if (isTypescriptProject() && isUsingTSLint()) {
    filesToLint =
      shouldRunOnSpecificFiles && (tsFiles.length || jsFiles.length)
        ? [...tsFiles, ...jsFiles]
        : undefined;
    linterFunc = runTSLint;
  } else if (isTypescriptProject()) {
    filesToLint =
      shouldRunOnSpecificFiles && (tsFiles.length || jsFiles.length)
        ? [...tsFiles, ...jsFiles]
        : [
            ...globs.baseDirs.map((dir: any) => `${dir}/**/*.(ts|tsx)`),
            '*.(ts|tsx)',
          ];
    linterFunc = runESLint;
  } else {
    filesToLint =
      shouldRunOnSpecificFiles && jsFiles.length
        ? jsFiles
        : [...globs.baseDirs.map((dir: any) => `${dir}/**/*.js`), '*.js'];
    linterFunc = runESLint;
  }

  const lintError = await linterFunc(filesToLint, args);

  if (lintError) {
    console.error(chalk.red(lintError + '\n\n'));
    process.exit(1);
  }
};

type CLICommand = (
  argv: Array<string>,
  config: Partial<Config>,
) => Promise<void>;

const lintCommand: CLICommand = async (
  argv: Array<string>,
  config: Partial<Config>,
) => {
  const args = parseArgs(argv);
  await doLint(args, config.hooks?.prelint);
};

export default lintCommand;
