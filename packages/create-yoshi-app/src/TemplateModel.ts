import path from 'path';
import fs from 'fs-extra';

export type Language = 'javascript' | 'typescript';

export type SentryData = {
  teamName: string;
  projectName: string;
  DSN: string;
};

export type YoshiFlow = 'editor' | 'app' | 'legacy' | 'bm' | 'library';

export interface TemplateDefinition {
  id: string;
  name: string;
  path: string;
  warning?: string;
  experimental?: boolean;
  flow: YoshiFlow;
  availableLanguages: Array<Language>;
}

export default class TemplateModel<F = Record<string, any>> {
  readonly projectName: string;
  readonly authorName: string;
  readonly authorEmail: string;
  readonly templateDefinition: TemplateDefinition;
  readonly language: Language;

  flowData: F | null;
  sentryData: SentryData | null;

  constructor({
    projectName,
    templateDefinition,
    authorName,
    authorEmail,
    language,
  }: {
    projectName: string;
    templateDefinition: TemplateDefinition;
    authorName: string;
    authorEmail: string;
    language: Language;
  }) {
    this.templateDefinition = templateDefinition;
    this.projectName = projectName;
    this.authorName = authorName;
    this.authorEmail = authorEmail;
    this.language = language;
    this.flowData = null;
    this.sentryData = null;
  }

  getPath() {
    return path.join(this.templateDefinition.path, this.language);
  }

  getTitle() {
    return `${this.templateDefinition.id}-${this.language}`;
  }

  getFlowData(): F | null {
    return this.flowData;
  }

  getSentryData() {
    return this.sentryData;
  }

  setFlowData(flowData: F) {
    this.flowData = flowData;
  }

  setSentryData(sentryData: SentryData) {
    this.sentryData = sentryData;
  }

  static fromFilePath(answersFilePath: string) {
    return new TemplateModel(fs.readJSONSync(answersFilePath));
  }
}
