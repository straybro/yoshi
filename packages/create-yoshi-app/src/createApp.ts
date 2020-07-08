import chalk from 'chalk';
import {
  clearConsole,
  gitInit,
  isInsideGitRepo,
  lintFix,
  npmInstall,
  gitCommit,
  isBMFlow,
} from './utils';
import generateProject from './generateProject';
import TemplateModel from './TemplateModel';
import SentryTemplateModel from './sentry-registration/TemplateModel';
import DevCenterTemplateModel from './dev-center-registration/TemplateModel';

export interface CreateAppOptions {
  workingDir: string;
  templateModel?: TemplateModel;
  install?: boolean;
  lint?: boolean;
  commit?: boolean;
}

const shouldRegisterSentry = ({ templateDefinition }: TemplateModel) =>
  isBMFlow(templateDefinition.name) ||
  templateDefinition.name.includes('flow-editor');

const shouldRegisterDevCenter = ({ templateDefinition }: TemplateModel) =>
  templateDefinition.name.includes('flow-editor');

export default async ({
  workingDir,
  templateModel,
  install = true,
  lint = true,
  commit = true,
}: CreateAppOptions) => {
  clearConsole();

  if (!templateModel) {
    // Use ' ' due to a technical problem in hyper when you don't see the first char after clearing the console
    console.log(
      ' ' + chalk.underline('Please answer the following questions:\n'),
    );

    // If we don't have template model injected, ask the user
    // to answer the questions and generate one for us
    const runPrompt = require('./runPrompt').default;
    templateModel = (await runPrompt(workingDir)) as TemplateModel<
      DevCenterTemplateModel
    >;
  }

  if (shouldRegisterSentry(templateModel)) {
    const {
      default: runSentryRegistrationPrompt,
    } = require('./sentry-registration/runPrompt');

    const sentryModel = (await runSentryRegistrationPrompt(
      templateModel,
    )) as SentryTemplateModel;

    templateModel.setSentryData(sentryModel);
  }

  if (shouldRegisterDevCenter(templateModel)) {
    const runDevCenterRegistrationPrompt = require('./dev-center-registration/runPrompt')
      .default;

    const setupAutoRelease = require('./auto-release/setupAutoRelease').default;

    const devCenterModel = (await runDevCenterRegistrationPrompt(
      templateModel,
    )) as DevCenterTemplateModel;
    templateModel.setFlowData(devCenterModel);

    await setupAutoRelease(templateModel);
  }

  console.log(
    `\nCreating a ${chalk.cyan(
      templateModel.getTitle(),
    )} project in:\n\n${chalk.green(workingDir)}\n`,
  );

  generateProject(templateModel, workingDir, templateModel.getPath());

  if (!isInsideGitRepo(workingDir)) {
    gitInit(workingDir);
  }

  if (install) {
    npmInstall(workingDir);
  }

  if (lint) {
    lintFix(workingDir);
  }

  if (commit) {
    gitCommit(workingDir);
  }

  return templateModel;
};
