import path from 'path';
import fs from 'fs';
import { capitalize } from 'lodash';
import { templates } from '../packages/create-yoshi-app';

const readNvmrc = (dir: string) =>
  fs.readFileSync(path.join(dir, '.nvmrc')).toString().trim();

const cyaNvmrc = readNvmrc(
  path.resolve(__dirname, '../packages/create-yoshi-app'),
);

templates.forEach(({ name, path: templatePath, availableLanguages }) => {
  availableLanguages.forEach((lang) => {
    test(`${capitalize(
      lang,
    )} template ${name}'s .nvmrc should match create-yoshi-app's .nvmrc`, () => {
      const templateNvmrc = readNvmrc(path.join(templatePath, lang));
      expect(templateNvmrc).toBe(cyaNvmrc);
    });
  });
});
