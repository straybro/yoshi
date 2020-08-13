import globby from 'globby';
import { DEV_SERVER_PATTERN } from './constants';

export const getServerStartFile = (cwd = process.cwd()): string | undefined => {
  const [serverStartFile] = globby.sync(DEV_SERVER_PATTERN, { cwd });

  return serverStartFile;
};
