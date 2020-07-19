import { FlowBMModel } from './model';
import {
  shouldAddBI,
  shouldAddExperiments,
  shouldAddFedops,
  shouldAddSentry,
} from './queries';

export const generateComponentCode = (
  { absolutePath, componentId }: { absolutePath: string; componentId: string },
  model: FlowBMModel,
) => {
  const addExperiments = shouldAddExperiments(model);
  const addSentry = shouldAddSentry(model);
  const addFedops = shouldAddFedops(model);
  const addBI = shouldAddBI(model);

  return `
import Component from '${absolutePath}';
import {
  wrapComponent,
  ${addExperiments ? 'createExperimentsProvider,' : ''}
  ${addSentry ? 'createSentryProvider,' : ''}
  ${addFedops ? 'createFedopsProvider,' : ''}
  ${addBI ? 'createBIProvider,' : ''}
} from 'yoshi-flow-bm-runtime';

${addBI ? `import initSchemaLogger from '${model.config.bi}';` : ''}

export default wrapComponent(Component, [
  ${
    addExperiments
      ? `createExperimentsProvider(${JSON.stringify(
          model.config.experimentsScopes,
        )}),\n`
      : ''
  }
  ${addSentry ? `createSentryProvider('${model.config.sentry?.DSN}'),` : ''}
  ${addFedops ? `createFedopsProvider('${componentId}'),` : ''}
  ${addBI ? `createBIProvider(initSchemaLogger),` : ''}
]);`;
};
