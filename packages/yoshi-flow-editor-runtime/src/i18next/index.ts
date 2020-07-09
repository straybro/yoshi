import memoize from 'lodash/memoize';
import i18next from 'i18next';
import { IWixStatic } from '@wix/native-components-infra/dist/es/src/types/wix-sdk';
import { DefaultTranslations } from '../constants';
import { getQueryParams } from '../utils';

declare let __webpack_public_path__: string;
const DEFAULT_LANGUAGE = 'en';

export const i18nInstance = i18next.createInstance();

export function getSiteTranslations(
  language: string,
  defaultTranslations: DefaultTranslations | null = {},
  prefix: string = 'messages',
  defaultLanguage: string = DEFAULT_LANGUAGE,
): Promise<Record<string, string>> {
  if (language === defaultLanguage) {
    return Promise.resolve(defaultTranslations || {});
  }

  // locales are `fetch`ed and not `import`ed because
  // `bolt` SSR enviroment doesn't support webpack's `JsonpTemplatePlugin`
  // see also:
  //   https://github.com/wix-private/site-search/pull/369
  //   https://github.com/wix-private/site-search/commit/93a16dfbe1fcca9af7cc1abe88f0e0df222970c8
  return fetch(
    `${__webpack_public_path__}assets/locales/${prefix}_${language}.json`,
  ).then((r) => {
    if (!r.ok) {
      console.error(`Can't load locale: ${language}`);
      return Promise.resolve(defaultTranslations || {});
    }

    return r.json();
  });
}

export interface I18nConfig {
  language: string;
  translations?: object;
  waitForReact?: boolean;
  defaultLanguage?: string;
  defaultTranslations?: DefaultTranslations;
  prefix?: string;
}

export default memoize(function i18n(params: I18nConfig) {
  const {
    language,
    translations,
    defaultTranslations,
    waitForReact,
    defaultLanguage,
    prefix,
  } = params;
  const options: any = {
    lng: language,
    fallbackLng: defaultLanguage || DEFAULT_LANGUAGE,
    keySeparator: false,
    react: {
      wait: !!waitForReact,
    },
  };

  if (translations) {
    options.resources = {
      [language]: {
        translation: translations,
      },
    };
  } else {
    i18nInstance.use({
      type: 'backend', // backed for worker
      read: async (
        lang: string,
        namespace: string,
        callback: (error: Error | null, t?: any) => void,
      ) => {
        return getSiteTranslations(
          lang,
          defaultTranslations,
          prefix,
          defaultLanguage,
        )
          .then((t) => callback(null, t))
          .catch((error) => callback(error));
      },
    });
  }

  return i18nInstance.init(options);
});

export const getLanguageWithInstance = memoize((Wix: IWixStatic) => {
  const queryParams: URLSearchParams = getQueryParams();
  const multilingualLanguage = queryParams?.get('lang');
  return multilingualLanguage || Wix.Utils.getLocale() || DEFAULT_LANGUAGE;
});
