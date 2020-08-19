import path from 'path';
import tempy from 'tempy';
import { generateProject } from '../src';
import TemplateModel from '../src/TemplateModel';
import getFilesInDir from '../src/getFilesInDir';

test('verify generation works as expected', () => {
  const tempDir = tempy.directory();
  const templateModel = new TemplateModel({
    projectName: `test-project`,
    templateDefinition: {
      id: 'fake-template',
      name: 'Fake Template',
      flow: 'app',
      path: path.join(__dirname, './__fixtures__/fake-template/'),
      availableLanguages: ['typescript'],
    },
    authorName: 'rany',
    authorEmail: 'rany@wix.com',
    language: 'typescript',
  });

  generateProject(templateModel, tempDir);

  const files = getFilesInDir(tempDir);

  expect(files).toMatchSnapshot();
});
