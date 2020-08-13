import prompts from 'prompts';
import { readCache, writeCache } from './cache';

const MSID_CACHE_KEY = 'metaSiteId';

const readMetaSiteId = async () => {
  const { metaSiteId } = await prompts({
    type: 'text',
    name: 'metaSiteId',
    message:
      'What is your preferred metaSiteId?\n' +
      '(will determine the production site to be opened in Business-Manager)',
  });

  return metaSiteId as string;
};

export const getMetaSiteId = async (): Promise<string> => {
  const cached = readCache(MSID_CACHE_KEY);

  if (cached) {
    return cached;
  }

  const metaSiteId = await readMetaSiteId();

  setMetaSiteId(metaSiteId);

  return metaSiteId;
};

const setMetaSiteId = (metaSiteId: string) =>
  writeCache(MSID_CACHE_KEY, metaSiteId);
