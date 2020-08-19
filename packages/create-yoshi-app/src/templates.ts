import { resolve } from 'path';
import { TemplateDefinition } from './TemplateModel';
import {
  FLOW_BM_TEMPLATE_NAME,
  OOI_TEMPLATE_NAME,
  PLATFORM_TEMPLATE_NAME,
} from './constants';

const toTemplatePath = (templateName: string) =>
  resolve(__dirname, '../templates', templateName);

const templates: Array<TemplateDefinition> = [
  {
    id: 'fullstack',
    name: `FullStack App`,
    flow: 'app',
    path: toTemplatePath('fullstack'),
    availableLanguages: ['typescript', 'javascript'],
  },
  {
    id: 'client',
    name: `Client Only App`,
    flow: 'app',
    path: toTemplatePath('client'),
    availableLanguages: ['typescript', 'javascript'],
  },
  {
    id: OOI_TEMPLATE_NAME,
    name: `Out Of iFrame App`,
    flow: 'editor',
    path: toTemplatePath('flow-editor'),
    availableLanguages: ['typescript'],
  },
  {
    id: 'flow-library',
    name: `Library`,
    path: toTemplatePath('flow-library'),
    experimental: true,
    flow: 'library',
    availableLanguages: ['typescript'],
  },
  {
    id: 'library',
    name: `Library`,
    path: toTemplatePath('library'),
    flow: 'legacy',
    availableLanguages: ['typescript', 'javascript'],
  },

  {
    id: FLOW_BM_TEMPLATE_NAME,
    name: `Business Manager Module`,
    path: toTemplatePath(FLOW_BM_TEMPLATE_NAME),
    experimental: true,
    flow: 'bm',
    availableLanguages: ['typescript'],
  },
  {
    id: 'business-manager-module',
    name: `Business Manager Module`,
    path: toTemplatePath('business-manager-module'),
    flow: 'app',
    availableLanguages: ['typescript', 'javascript'],
  },
  {
    id: PLATFORM_TEMPLATE_NAME,
    name: `Platform App`,
    path: toTemplatePath('flow-editor-platform'),
    experimental: true,
    flow: 'editor',
    availableLanguages: ['typescript'],
  },
  {
    id: 'server',
    name: `Server Only`,
    path: toTemplatePath('server'),
    flow: 'legacy',
    availableLanguages: ['typescript', 'javascript'],
  },
];

export default templates;
