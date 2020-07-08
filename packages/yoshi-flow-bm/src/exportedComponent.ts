import path from 'path';
import fs from 'fs-extra';
import { ExportedComponentModel, FlowBMModel } from './model';
import {
  shouldAddExperiments,
  shouldAddFedops,
  shouldAddSentry,
} from './queries';
import { EXPORTED_COMPONENTS_DIR, GENERATED_DIR } from './constants';
import { renderLegacyExportedComponent } from './legacyExportedComponent';

const generateExportedComponentCode = (
  component: ExportedComponentModel,
  model: FlowBMModel,
) => {
  const addExperiments = shouldAddExperiments(model);
  const addSentry = shouldAddSentry(model);
  const addFedops = shouldAddFedops(model);

  return `
import Component from '${component.absolutePath}';
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
      ? `createSentryProvider(${JSON.stringify(model.config.sentry!.DSN)}),`
      : ''
  }
  ${
    addFedops
      ? `createFedopsProvider(${JSON.stringify(component.componentId)}),`
      : ''
  }
]);`;
};

export const getExportedComponentEntryPath = ({
  relativePath,
}: ExportedComponentModel) =>
  path.join(GENERATED_DIR, EXPORTED_COMPONENTS_DIR, relativePath);

export const renderExportedComponent = (
  component: ExportedComponentModel,
  model: FlowBMModel,
) => {
  const componentEntry = getExportedComponentEntryPath(component);
  fs.outputFileSync(
    componentEntry,
    generateExportedComponentCode(component, model),
  );
  if (component.config.legacyBundle) {
    renderLegacyExportedComponent(component);
  }
};
