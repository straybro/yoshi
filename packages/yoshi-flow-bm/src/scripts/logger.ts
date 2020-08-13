import clearConsole from 'react-dev-utils/clearConsole';
import chalk from 'chalk';
import {
  DevEnvironmentLogger,
  hasErrorsOrWarnings,
  isAllCompiled,
  logProcessState,
  logStateErrorsOrWarnings,
  shouldClearConsole,
} from 'yoshi-common/build/dev-environment-logger';
import { ProcessType } from 'yoshi-common/build/dev-environment';
import { Config } from 'yoshi-config/build/config';
import createUserActionsWatcher from 'yoshi-common/build/user-actions-watcher';
import { AppConfig } from '@wix/ambassador-service-discovery-server/types';
import openBrowser from 'react-dev-utils/openBrowser';
import createFlowBMModel, { watchFlowBMModel } from '../model';
import getStartUrl from '../start-url';

export const createFlowLogger = (
  yoshiConfig: Config,
  metaSiteId: string,
  prodConfig?: AppConfig,
): DevEnvironmentLogger => {
  let model = createFlowBMModel();

  watchFlowBMModel((newModel) => (model = newModel));

  const watcher = createUserActionsWatcher();

  for (let i = 0; i < 9; i++) {
    // eslint-disable-next-line no-loop-func
    watcher.on(`${i + 1}`, () => {
      const page = model.pages[i];

      const startUrl = getStartUrl(
        model,
        page,
        yoshiConfig.servers.cdn,
        metaSiteId,
        prodConfig,
      );

      openBrowser(startUrl);

      console.log(`  Opening ${chalk.bold.cyan(`/${page.route}`)}...`);
    });
  }

  return ({ state, appName }) => {
    if (shouldClearConsole()) {
      clearConsole();
    }

    if (hasErrorsOrWarnings(state)) {
      return logStateErrorsOrWarnings(state);
    }

    const isCompiled = isAllCompiled(state);

    if (isCompiled) {
      console.log(chalk.green('Compiled successfully!\n'));

      console.log(`Your Business-Manager bundles are ready! 🚀`);

      for (const processTypeKey in state.processes) {
        const processType = processTypeKey as ProcessType;
        const processState = state.processes[processType];

        processState && logProcessState({ processType, appName }, processState);
      }

      console.log(chalk.bold.whiteBright('  Usage'));
      model.pages.slice(0, 9).forEach(({ route }, i) => {
        console.log(
          `   > Press ${chalk.bold.whiteBright(
            i + 1,
          )} to open ${chalk.cyan.bold(`/${route}`)} on production.`,
        );
      });

      console.log('');
    }
  };
};
