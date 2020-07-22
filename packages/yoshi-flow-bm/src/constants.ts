import path from 'path';
import { constantCase } from 'constant-case';

const EXTENSIONS = '{tsx,ts,jsx,js}';
export const CONFIG_EXT = 'json';
export const MODULE_HOOKS_EXT = `module.${EXTENSIONS}`;

export const CONFIG_PATH = `.module.${CONFIG_EXT}`;

export const MODULE_CONFIG_PATH = (moduleId: string) =>
  `target/module_${constantCase(moduleId)}.json`;

export const PAGES_DIR = 'src/pages';
export const PAGES_PATTERN = `${PAGES_DIR}/**/*.${EXTENSIONS}`;
export const PAGES_CONFIG_PATTERN = `${PAGES_DIR}/**/*.${CONFIG_EXT}`;
export const PAGES_MODULE_HOOKS_PATTERN = `${PAGES_DIR}/**/*.${MODULE_HOOKS_EXT}`;

export const EXPORTED_COMPONENTS_DIR = 'src/exported-components';
export const EXPORTED_COMPONENTS_PATTERN = `${EXPORTED_COMPONENTS_DIR}/**/*.${EXTENSIONS}`;
export const EXPORTED_COMPONENTS_CONFIG_PATTERN = `${EXPORTED_COMPONENTS_DIR}/**/*.${CONFIG_EXT}`;
export const EXPORTED_COMPONENTS_MODULE_HOOKS_PATTERN = `${EXPORTED_COMPONENTS_DIR}/**/*.${MODULE_HOOKS_EXT}`;

export const METHODS_DIR = 'src/methods';
export const METHODS_PATTERN = `${METHODS_DIR}/**/*.${EXTENSIONS}`;
export const METHODS_CONFIG_PATTERN = `${METHODS_DIR}/**/*.${CONFIG_EXT}`;

export const MODULE_HOOKS_PATTERN = `src/module.${EXTENSIONS}`;

export const TRANSLATIONS_DIR = 'src/assets/locale';

export const GENERATED_DIR = path.resolve(__dirname, '../generated');

export const MODULE_ENTRY_PATH = path.join(GENERATED_DIR, 'module.ts');

export const GENERATED_LEGACY_DIR = path.join(GENERATED_DIR, 'legacy');

export const BI_LOGGER_DEFINITIONS_PATH = path.join(
  GENERATED_DIR,
  'biLogger.d.ts',
);
