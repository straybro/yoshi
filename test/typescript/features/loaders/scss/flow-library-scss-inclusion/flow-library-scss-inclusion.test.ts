import path from 'path';
import Scripts from '../../../../../scripts';

const scripts = Scripts.setupProjectFromTemplate({
  templateDir: __dirname,
  projectType: 'flow-library',
});

const exampleAppScripts = Scripts.setupProjectFromTemplate({
  templateDir: path.join(__dirname, 'example'),
  projectType: 'typescript',
});

describe.each(['dev', 'prod'] as const)(
  'flow-library scss inclusion [%s] integration',
  (mode) => {
    beforeAll(() => scripts.build());

    it('consumes statics', async () => {
      await exampleAppScripts[mode](async () => {
        await page.goto(exampleAppScripts.serverUrl);

        const { display, alignItems } = await page.$eval(
          '#component',
          (elm) => {
            const { display, alignItems } = getComputedStyle(elm);
            return { display, alignItems };
          },
        );

        expect(display).toBe('flex');
        expect(alignItems).toBe('center');
      });
    });
  },
);

describe.each(['dev', 'prod'] as const)(
  'flow-library scss inclusion [%s] component',
  (mode) => {
    it('component tests', async () => {
      await scripts.test(mode);
    });
  },
);
