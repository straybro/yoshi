import { multipleValidOptions } from 'jest-validate';
import { InitialConfig, RequiredRecursively } from './types';

const validConfig: RequiredRecursively<InitialConfig> = {
  bundle: multipleValidOptions(
    {
      library: multipleValidOptions('app-name', ['app-name'], {
        window: 'app-name',
      }),
      entry: multipleValidOptions(
        'index.js',
        ['one.js'],
        { two: 'two.js' },
        {
          app: 'index.js',
        },
      ),
      externals: multipleValidOptions(['React'], { react: 'React' }),
      port: 1234,
      https: true,
    },
    true,
  ),
  storybook: false,
};

export default validConfig;
