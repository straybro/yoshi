import getGitConfig from 'parse-git-config';
import { capitalize } from 'lodash';
import open from 'open';
import templates from './templates';
import { ExtendedPromptObject } from './extended-prompts';
import {
  getInitialEmail,
  formatEmail,
  isEmail,
  WIX_EMAIL_PATTERN,
} from './wixEmail';

export default (): Array<ExtendedPromptObject<string>> => {
  const gitConfig = getGitConfig.sync({ include: true, type: 'global' });

  const gitUser = gitConfig.user || {};
  const gitName = gitUser.name || '';
  const gitEmail = gitUser.email || '';

  return [
    {
      type: 'text',
      name: 'authorName',
      message: 'Author name',
      initial: gitName,
    },
    {
      type: 'text',
      name: 'authorEmail',
      message: 'Author @wix.com email',
      initial: getInitialEmail(gitEmail),
      format: formatEmail,
      validate: (value: string) =>
        // We can add @wix.com if no email pattern detected or force user to write @wix email if different one specified.
        !isEmail(value) || value.endsWith(WIX_EMAIL_PATTERN)
          ? true
          : 'Please enter a @wix.com email',
    },
    {
      type: 'autocomplete',
      name: 'templateDefinition',
      message: 'Choose project type',
      choices: templates.map((project) => ({
        title: project.title || project.name,
        value: project,
      })),
      next(answers) {
        const questions: Array<ExtendedPromptObject<string>> = [];

        if (answers.templateDefinition.name === 'server') {
          questions.push({
            type: 'select',
            name: 'serverless',
            message:
              'If you are creating a platformized server we endorse you to check out wix-serverless',
            choices: [
              { title: 'Take me to serverless docs!', value: true },
              {
                title: 'Generate a node platform based server',
                value: false,
              },
            ],
            after(answers) {
              if (answers.serverless) {
                console.log();
                console.log(`Yoshi doesn't have a template for serverless yet`);
                console.log(
                  'Open serverless docs to start - https://github.com/wix-platform/wix-serverless',
                );
                console.log();
                open('https://github.com/wix-platform/wix-serverless');
                process.exit(0);
              }
            },
          });
        }

        const templateLangs = answers.templateDefinition.availableLanguages;

        if (templateLangs.length === 1) {
          answers.language = templateLangs[0];
        } else {
          questions.push({
            type: 'select',
            name: 'language',
            message: 'Choose JavaScript Transpiler',
            async getDynamicChoices(answers: any) {
              return answers.templateDefinition.availableLanguages.map(
                (lang: string) => ({
                  title: capitalize(lang),
                  value: lang,
                }),
              );
            },
          });
        }

        return questions;
      },
    },
  ];
};
