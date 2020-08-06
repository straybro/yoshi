import globby from 'globby';
import chalk from 'chalk';

import { intersection, difference, isEqual } from 'lodash';
import { FormatterConstructor, RuleFailure } from 'tslint';

type TSLintArgs = { formatter: string; fix: boolean };

type TSLintParams = {
  tsconfigFilePath: string;
  tslintFilePath: string;
  options: TSLintArgs;
  pattern?: Array<string>;
  filterPaths?: Array<string>;
};

type TSLintResult = {
  errorsCount: number;
  warningsCount: number;
  fixablesCount: number;
  fixesCount: number;
};

const logFileFailures = (
  fileFailures: Array<RuleFailure> = [],
  options: TSLintArgs,
  findFormatter: (
    name: string | FormatterConstructor,
    formattersDirectory?: string,
  ) => FormatterConstructor | undefined,
) => {
  const formatterName = options.formatter ?? 'prose';
  const Formatter = findFormatter(formatterName);

  if (Formatter === undefined) {
    throw new Error(`formatter '${formatterName}' not found`);
  }

  const formatter = new Formatter();
  const output = formatter.format(fileFailures);
  console.log(output);
};

async function runLinter({
  options,
  tslintFilePath,
  tsconfigFilePath,
  filterPaths,
}: TSLintParams): Promise<TSLintResult> {
  // not all of our users have typescript installed.
  // tslint requires typescript to exist in node_modules when imported,
  // that should happen only when runLinter function is called in oppose to upon import
  const { Linter, Configuration, findFormatter } = await import('tslint');

  const program = Linter.createProgram(tsconfigFilePath);
  const linter = new Linter(options, program);
  const linterFileNames = Linter.getFileNames(program);

  let filePaths = linterFileNames;

  if (filterPaths) {
    filePaths = intersection(filterPaths, linterFileNames);

    if (!isEqual(filePaths, filterPaths)) {
      const wontBeLinted = difference(filterPaths, linterFileNames);
      console.warn(
        chalk.yellow(
          ' ● Warning: The following files were supplied to "yoshi lint" as a pattern\n' +
            `   but were not specified in "${tsconfigFilePath}", therefore will not be linted:\n\n` +
            chalk.bold(wontBeLinted.join('\n')),
        ),
      );
    }
  }

  const files = filePaths.map((fileName: string) => ({
    fileName,
    fileContents: program.getSourceFile(fileName)!.getFullText(),
  }));

  let failuresCount = 0;

  files.forEach(({ fileName, fileContents }) => {
    const configuration = Configuration.findConfiguration(
      tslintFilePath,
      fileName,
    ).results;

    linter.lint(fileName, fileContents, configuration);

    const lintResult = linter.getResult();

    // if we got new failures in result after next file linting
    if (failuresCount !== lintResult.failures.length) {
      const currentFileFailures = lintResult.failures.slice(failuresCount);
      failuresCount = lintResult.failures.length; // update counter to total linter failures

      logFileFailures(currentFileFailures, options, findFormatter);
    }
  });

  const {
    length: fixablesCount,
  } = linter.getResult().failures.filter((failure) => failure.hasFix());

  const { length: errorsCount } = linter
    .getResult()
    .failures.filter((failure) => failure.getRuleSeverity() === 'error');

  const { length: warningsCount } = linter
    .getResult()
    .failures.filter((failure) => failure.getRuleSeverity() === 'warning');

  return {
    errorsCount,
    warningsCount,
    fixablesCount,
    fixesCount: linter.getResult().fixes?.length ?? 0,
  };
}

export default async ({
  pattern,
  tsconfigFilePath,
  tslintFilePath,
  options,
}: TSLintParams) => {
  if (!pattern && !tsconfigFilePath) {
    throw new Error('a pattern or a tsconfig.json filePath must be supplied');
  }

  let filterPaths;

  if (pattern) {
    console.log(`running tslint on ${chalk.magenta(...pattern)}\n`);

    filterPaths = globby.sync(pattern, {
      absolute: true,
      onlyFiles: true,
      ignore: ['**/node_modules'],
    });
  } else {
    console.log(`running tslint using ${chalk.magenta(tsconfigFilePath)}\n`);
  }

  const {
    errorsCount,
    warningsCount,
    fixablesCount,
    fixesCount,
  } = await runLinter({
    options,
    tslintFilePath,
    tsconfigFilePath,
    filterPaths,
  });

  if (fixesCount > 0) {
    console.log(
      `fixed ${chalk.green(String(fixesCount))} ${
        fixesCount === 1 ? '' : 's'
      } using "--fix"`,
    );
  }

  if (errorsCount > 0) {
    let exitMessage = `tslint exited with ${chalk.red(
      String(errorsCount),
    )} error${errorsCount === 1 ? '' : 's'}`;

    if (warningsCount > 0) {
      exitMessage += ` and ${chalk.yellow(String(warningsCount))} warning${
        warningsCount === 1 ? '' : 's'
      }`;
    }

    if (fixesCount === 0 && fixablesCount > 0) {
      exitMessage =
        exitMessage + ` (${chalk.green(String(fixablesCount))} fixable)`;
    }

    throw exitMessage;
  }
};
