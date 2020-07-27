import path from 'path';
import fs from 'fs-extra';
import { FlowBMModel, PageModel } from './model';
import { GENERATED_DIR, PAGES_DIR } from './constants';
import { renderLegacyPage } from './legacyPage';
import { generateComponentCode } from './component';

export const getPageEntryPath = ({ relativePath }: PageModel) =>
  path.join(GENERATED_DIR, PAGES_DIR, relativePath);

export const renderPage = (page: PageModel, model: FlowBMModel) => {
  const pageEntry = getPageEntryPath(page);
  fs.outputFileSync(pageEntry, generateComponentCode(page, 'page', model));

  if (page.config.legacyBundle) {
    renderLegacyPage(page);
  }
};
