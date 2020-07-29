import chalk from 'chalk';
import { Urls } from 'react-dev-utils/WebpackDevServerUtils';
import clearConsole from 'react-dev-utils/clearConsole';
import {
  State,
  ProcessState,
  ProcessType,
} from 'yoshi-common/build/dev-environment';
import {
  hasErrorsOrWarnings,
  isAllCompiled,
  shouldClearConsole,
  getProcessName,
} from 'yoshi-common/build/dev-environment-logger';
import terminalLink from 'terminal-link';
import { FlowEditorModel, URLsConfig } from '../model';

type URLsConfigItem = keyof URLsConfig;

const envLabelsMap: Record<URLsConfigItem, string> = {
  viewerUrl: 'Viewer 🖼',
  editorUrl: 'Editor 🎨',
  appBuilderUrl: 'App Builder 👷‍♂️',
};

const getEnvLabel = (env: URLsConfigItem): string => {
  return envLabelsMap[env] || env;
};

const normalizeUrlForTerminal = (url: string): string =>
  url
    .replace(/\{/g, encodeURIComponent('{'))
    .replace(/\}/g, encodeURIComponent('}'))
    .replace(/"/g, encodeURIComponent('"'));

const logUrls = ({
  urls,
  model,
  processType,
}: {
  urls?: Urls;
  model: FlowEditorModel;
  processType: ProcessType;
}) => {
  if (processType === 'AppServer') {
    logServingApps({ urls, model });
  } else if (processType === 'DevServer') {
    logStatics({ urls, model });
  }
};

const logServingApps = ({
  urls,
  model,
}: {
  urls?: Urls;
  model: FlowEditorModel;
}) => {
  console.log(`${chalk.greenBright.bold('Serving apps')}:`);

  model.components.map((component) => {
    console.log(`  ${chalk.cyan.bold(component.name)}`);
    console.log(
      `    🕹    ${urls?.localUrlForTerminal}editor/${component.name}`,
    );
    console.log(
      `    ⚙️    ${urls?.localUrlForTerminal}settings/${component.name}`,
    );
  });
};

const logStatics = ({
  urls,
  model,
}: {
  urls?: Urls;
  model: FlowEditorModel;
}) => {
  console.log(`${chalk.greenBright.bold('Static assets:')}`);

  model.components.map((component) => {
    console.log(`  ${chalk.cyan.bold(component.name)}`);
    console.log(
      `    🕹    ${urls?.localUrlForTerminal}${component.name}ViewerWidget.bundle.js`,
    );
  });
  console.log(`  ${chalk.cyanBright.bold('Platform Scripts')}`);

  console.log(`    📗    ${urls?.localUrlForTerminal}viewerScript.bundle.js`);
  console.log(`    📘    ${urls?.localUrlForTerminal}editorScript.bundle.js`);

  console.log();
};

const logProcessState = (
  {
    processType,
    model,
  }: {
    processType: ProcessType;
    appName: string;
    model: FlowEditorModel;
  },
  state: ProcessState,
) => {
  switch (state.status) {
    case 'compiling':
      console.log();
      console.log(`${getProcessName(processType)}:`, 'Compiling...');
      break;

    case 'success': {
      logUrls({ urls: state.urls, model, processType });
      break;
    }
  }
};

const logStateErrorsOrWarnings = (state: State) => {
  const { DevServer, TypeScript } = state.processes;

  if (TypeScript && TypeScript.status === 'errors') {
    console.log(TypeScript.errors?.join('\n\n'));
    return;
  }

  if (DevServer && DevServer.status === 'errors') {
    console.log(chalk.red('Failed to compile.\n'));
    console.log(DevServer.errors?.join('\n\n'));
    return;
  }

  if (DevServer && DevServer.status === 'warnings') {
    console.log(chalk.red('Compiled with warnings.\n'));
    console.log(DevServer.warnings?.join('\n\n'));
    return;
  }
};

export default (model: FlowEditorModel, startUrl: URLsConfig) => ({
  state,
  appName,
}: {
  state: State;
  appName: string;
  suricate: boolean;
}) => {
  if (shouldClearConsole()) {
    clearConsole();
  }

  if (hasErrorsOrWarnings(state)) {
    return logStateErrorsOrWarnings(state);
  }

  const isCompiled = isAllCompiled(state);

  if (isCompiled) {
    console.log(chalk.green('Compiled successfully!'));

    console.log(`Your bundles for viewer and editor environment are ready! 🚀`);
    console.log('');

    for (const processTypeKey in state.processes) {
      const processType = processTypeKey as ProcessType;
      const processState = state.processes[processType];

      processState &&
        logProcessState({ model, processType, appName }, processState);
    }

    console.log(
      chalk.whiteBright(
        '\n\nFollowing urls will be opened with local overrides:\n',
      ),
    );
    const linksToLog: Array<string> = [];

    Object.keys(startUrl).forEach((env) => {
      const targetUrl = startUrl[env as URLsConfigItem];
      if (targetUrl) {
        const label = getEnvLabel(env as URLsConfigItem);
        const normalizedUrl = normalizeUrlForTerminal(targetUrl);
        const linkToLog = terminalLink(
          chalk.cyan.bold(label),
          normalizeUrlForTerminal(targetUrl as string),
          {
            fallback() {
              return `${label}  ${chalk.cyan.italic(normalizedUrl)}`;
            },
          },
        );
        linksToLog.push(linkToLog);
      }
    });

    if (!terminalLink.isSupported) {
      console.log(
        chalk.gray.italic(
          "Oh, seems like your terminal doesn't support hyperlinks. Please consider moving to iTerm2 or another modern terminal: https://gist.github.com/egmontkob/eb114294efbcd5adb1944c9f3cb5feda\n",
        ),
      );
      console.log(`${linksToLog.join('\n\n')}\n`);
      return;
    }
    console.log(`  ${linksToLog.join('             ')}\n`);
  }
};
