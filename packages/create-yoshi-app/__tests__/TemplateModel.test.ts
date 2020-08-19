import path from 'path';
import TemplateModel from '../src/TemplateModel';

describe('TemplateModel', () => {
  describe('language is javascript', () => {
    const model = new TemplateModel({
      templateDefinition: {
        name: 'Client',
        id: 'client',
        flow: 'app',
        path: path.join(__dirname, '../templates/client'),
        availableLanguages: ['javascript'],
      },
      language: 'javascript',
      authorEmail: 'author-email',
      authorName: 'author-name',
      projectName: 'project-name',
    });

    it('should compute the template path according to the template definition and the language', () => {
      expect(model.getPath()).toBe(
        path.join(__dirname, '../templates/client/javascript'),
      );
    });
  });

  describe('language is typescript', () => {
    const model = new TemplateModel({
      templateDefinition: {
        name: 'Client',
        id: 'client',
        flow: 'app',
        path: path.join(__dirname, '../templates/client'),
        availableLanguages: ['typescript'],
      },
      language: 'typescript',
      projectName: 'project-name',
      authorName: 'author-name',
      authorEmail: 'author-email',
    });

    it('should compute the template path according to the template definition and the language', () => {
      expect(model.getPath()).toBe(
        path.join(__dirname, '../templates/client/typescript'),
      );
    });
  });
});
