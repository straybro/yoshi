import readPkg from 'read-pkg';
import { cosmiconfigSync } from 'cosmiconfig';
import { defaultsDeep } from 'lodash';
import { validate as validateConfig } from 'jest-validate';
import { Config, InitialConfig } from './config';
import validConfig from './validConfig';
import normalize from './normalize';

const explorer = cosmiconfigSync('yoshi', {
  searchPlaces: ['package.json', 'yoshi.config.js'],
});

export default ({ validate = true, cwd = process.cwd() } = {}): Config => {
  // YOSHI_CONFIG_DIR is a hack for letting different flows to load a fixed config.
  // It is currently being used from both `jest-yoshi-preset`, the flow's cli and
  // cli commands, which are still not handled by the flow and being proxied to legacy flow
  const result = explorer.search(process.env.YOSHI_CONFIG_DIR || cwd);
  const initialConfig = (result ? result.config : {}) as InitialConfig;

  // Load and copy values from a file that extends the config
  if (initialConfig.extends) {
    const extendsConfig: Partial<InitialConfig> = require(initialConfig.extends)
      .defaultConfig;

    defaultsDeep(initialConfig, extendsConfig);
  }

  // Validate correctness
  if (validate) {
    validateConfig(initialConfig, {
      exampleConfig: validConfig,
      recursiveBlacklist: ['resolveAlias'],
    });
  }

  // Load package.json
  const pkgJson = readPkg.sync({ cwd });

  // Normalize values
  const config = normalize(initialConfig, pkgJson);

  return config;
};
