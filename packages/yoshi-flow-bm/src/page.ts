import path from 'path';
import fs from 'fs-extra';
import { FlowBMModel, PageModel } from './model';
import {
  shouldAddExperiments,
  shouldAddFedops,
  shouldAddSentry,
} from './queries';
import { GENERATED_DIR, PAGES_DIR } from './constants';
import { renderLegacyPage } from './legacyPage';

const generatePageCode = (page: PageModel, model: FlowBMModel) => {
  const addExperiments = shouldAddExperiments(model);
  const addSentry = shouldAddSentry(model);
  const addFedops = shouldAddFedops(model);

  return `
import Component from '${page.absolutePath}';
import {
  wrapComponent,
  ${addExperiments ? 'createExperimentsProvider,' : ''}
  ${addSentry ? 'createSentryProvider,' : ''}
  ${addFedops ? 'createFedopsProvider,' : ''}
} from 'yoshi-flow-bm-runtime';

export default wrapComponent(Component, [
  ${
    addExperiments
      ? `createExperimentsProvider(${JSON.stringify(
          model.config.experimentsScopes,
        )}),\n`
      : ''
  }
  ${
    addSentry
      ? `createSentryProvider(${JSON.stringify(model.config.sentry?.DSN)}),`
      : ''
  }
  ${
    addFedops
      ? `createFedopsProvider(${JSON.stringify(page.componentId)}),`
      : ''
  }
]);`;
};

export const getPageEntryPath = ({ relativePath }: PageModel) =>
  path.join(GENERATED_DIR, PAGES_DIR, relativePath);

export const renderPage = (page: PageModel, model: FlowBMModel) => {
  const pageEntry = getPageEntryPath(page);
  fs.outputFileSync(pageEntry, generatePageCode(page, model));

  if (page.config.legacyBundle) {
    renderLegacyPage(page);
  }
};
