import { FlowBMModel } from './model';
import {
  shouldAddBI,
  shouldAddExperiments,
  shouldAddFedops,
  shouldAddI18n,
  shouldAddSentry,
} from './queries';

export const generateComponentCode = (
  { absolutePath, componentId }: { absolutePath: string; componentId: string },
  type: 'page' | 'exported-component',
  model: FlowBMModel,
) => {
  const addI18n = shouldAddI18n(model);
  const addExperiments = shouldAddExperiments(model);
  const addSentry = shouldAddSentry(model);
  const addFedops = shouldAddFedops(model);
  const addBI = shouldAddBI(model);

  return `
import Component from '${absolutePath}';
import {
  wrapComponent,
  createComponentInfoProvider,
  ${addI18n ? 'createI18nProvider,' : ''}
  ${addExperiments ? 'createExperimentsProvider,' : ''}
  ${addSentry ? 'createSentryProvider,' : ''}
  ${addFedops ? 'createFedopsProvider,' : ''}
  ${addBI ? 'createBIProvider,' : ''}
} from 'yoshi-flow-bm-runtime';

${addBI ? `import initSchemaLogger from '${model.config.bi}';` : ''}

export default wrapComponent(Component, [
  createComponentInfoProvider(JSON.parse('${JSON.stringify({
    componentId,
    type,
  })}')),
  ${
    addI18n
      ? `createI18nProvider(
          '${model.config.translations?.default}',
          (locale) => import(\`${model.localePath}/messages_\${locale}.json\`),
          ${!!model.config.translations?.suspense},
        ),`
      : ''
  }
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
