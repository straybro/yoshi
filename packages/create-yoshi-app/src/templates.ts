import { resolve } from 'path';
import { TemplateDefinition } from './TemplateModel';
import {
  FLOW_BM_TEMPLATE_NAME,
  OOI_TEMPLATE_NAME,
  PLATFORM_TEMPLATE_NAME,
} from './utils';

const toTemplatePath = (templateName: string) =>
  resolve(__dirname, '../templates', templateName);

const templates: Array<TemplateDefinition> = [
  {
    name: 'fullstack',
    path: toTemplatePath('fullstack'),
    availableLanguages: ['typescript', 'javascript'],
  },
  {
    name: 'client',
    path: toTemplatePath('client'),
    availableLanguages: ['typescript', 'javascript'],
  },
  {
    name: 'business-manager-module',
    path: toTemplatePath('business-manager-module'),
    availableLanguages: ['typescript', 'javascript'],
  },
  {
    name: OOI_TEMPLATE_NAME,
    title: 'flow-editor - Out of iFrame',
    path: toTemplatePath('flow-editor'),
    availableLanguages: ['typescript'],
  },
  {
    name: 'library',
    path: toTemplatePath('library'),
    availableLanguages: ['typescript', 'javascript'],
  },
  {
    name: 'server',
    path: toTemplatePath('server'),
    availableLanguages: ['typescript', 'javascript'],
  },
];

if (process.env.EXPERIMENTAL_FLOW_BM === 'true') {
  templates.push({
    name: FLOW_BM_TEMPLATE_NAME,
    path: toTemplatePath(FLOW_BM_TEMPLATE_NAME),
    availableLanguages: ['typescript'],
  });
}

if (process.env.EXPERIMENTAL_PLATFORM_TEMPLATE === 'true') {
  templates.push({
    name: PLATFORM_TEMPLATE_NAME,
    title: 'flow-editor - Platform',
    path: toTemplatePath('flow-editor-platform'),
    availableLanguages: ['typescript'],
  });
}

if (process.env.EXPERIMENTAL_FLOW_LIBRARY === 'true') {
  templates.push({
    name: 'flow-library',
    path: toTemplatePath('flow-library'),
    availableLanguages: ['typescript'],
  });
}

export default templates;
