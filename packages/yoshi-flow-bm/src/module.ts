import fs from 'fs-extra';
import { Entry } from 'webpack';
import { FlowBMModel } from './model';
import { renderPage } from './page';
import { renderExportedComponent } from './exportedComponent';
import {
  EXPORTED_COMPONENTS_DIR,
  MODULE_ENTRY_PATH,
  PAGES_DIR,
} from './constants';

const generateModuleCode = ({
  exportedComponents,
  methods,
  pages,
  moduleHooksPath,
  config: { moduleId, moduleConfigurationId, sentry },
}: FlowBMModel) => `
import { createModule } from 'yoshi-flow-bm-runtime';

createModule({
  moduleId: '${moduleId}',
  pages: [
    ${pages.map(
      ({ componentId, componentName, relativePath }) => `
      {
        componentId: '${componentId}',
        componentName: '${componentName}',
        loadComponent: async () => (await import(/* webpackChunkName: "${componentName}" */'./${PAGES_DIR}/${relativePath}')).default,
      },
    `,
    )}
  ],
  exportedComponents: [
    ${exportedComponents.map(
      ({ componentId, relativePath }) => `
      {
        componentId: '${componentId}',
        loadComponent: async () => (await import(/* webpackChunkName: "${componentId}" */'./${EXPORTED_COMPONENTS_DIR}/${relativePath}')).default,
      },
    `,
    )}
  ],
  methods: [
    ${methods.map(
      ({ methodId, absolutePath }) => `
      {
        methodId: '${methodId}',
        loadMethod: () => require('${absolutePath}').default,
      }`,
    )}
  ], // ${JSON.stringify(methods)},
  ${
    moduleConfigurationId
      ? `moduleConfigurationId: '${moduleConfigurationId}',`
      : ''
  }
  ${moduleHooksPath ? `moduleInit: require('${moduleHooksPath}').init,` : ''}
  ${
    moduleHooksPath ? `moduleConfig: require('${moduleHooksPath}').config,` : ''
  }
  ${sentry?.DSN ? `sentryDsn: '${sentry.DSN}',` : ''}
});`;

export const getModuleEntry = (model: FlowBMModel): Entry => ({
  [model.config.moduleBundleName]: MODULE_ENTRY_PATH,
});

export const renderModule = (model: FlowBMModel) => {
  model.pages.forEach((page) => renderPage(page, model));

  model.exportedComponents.forEach((component) =>
    renderExportedComponent(component, model),
  );

  fs.outputFileSync(MODULE_ENTRY_PATH, generateModuleCode(model));
};
