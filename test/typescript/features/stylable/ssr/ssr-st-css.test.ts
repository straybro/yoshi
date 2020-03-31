import Scripts from '../../../../scripts';

jest.setTimeout(40 * 1000);

const scripts = Scripts.setupProjectFromTemplate({
  templateDir: __dirname,
  projectType: 'typescript',
});

describe('Stylable SSR', () => {
  it('Should allow importing *.st.css files in ssr', async () => {
    await scripts.build();
    const serverBundle = require(`${scripts.testDirectory}/dist/server.js`);
    expect(serverBundle.style).toBeTruthy();
    expect(Object.keys(serverBundle.style.classes).includes('root')).toBe(true);
  });
});
