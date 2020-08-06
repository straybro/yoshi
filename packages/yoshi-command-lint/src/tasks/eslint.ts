// TODO: migrate to new API https://eslint.org/docs/user-guide/migrating-to-7.0.0#deprecate-cliengine
// after eslint version upgraded in Yoshi 5

import globby from 'globby';
import { CLIEngine } from 'eslint';

type ESLintParams = {
  options: CLIEngine.Options & { formatter?: string };
  pattern: Array<string>;
};

export default async ({ pattern, options }: ESLintParams) => {
  const fileNames = globby.sync(pattern, {
    absolute: true,
    onlyFiles: true,
    ignore: ['**/node_modules'],
  });

  const cli = new CLIEngine(options);
  const report = cli.executeOnFiles(fileNames);

  const formatter = cli.getFormatter(options.formatter);

  options.fix && CLIEngine.outputFixes(report);
  const errors = CLIEngine.getErrorResults(report.results);

  if (errors.length) {
    throw formatter(report.results);
  }

  if (report.warningCount) {
    console.warn(formatter(report.results));
  }
};
