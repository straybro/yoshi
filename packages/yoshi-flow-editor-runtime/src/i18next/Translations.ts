import i18next from 'i18next';
import i18n, { getSiteTranslations } from '.';

interface ITranslationsConfig {
  language: string;
  defaultTranslations: Record<string, string> | null;
  prefix?: string;
  defaultLanguage?: string;
}

const defaultTranslationsFunction: i18next.TranslationFunction = () => {
  throw new Error('Translations has not been initialized yet');
};

export default class Translations {
  i18n: i18next.i18n = {} as any;
  t: i18next.TranslationFunction = defaultTranslationsFunction;
  all: Record<string, string> = {};
  config: ITranslationsConfig;
  // _autoFetchDisabled - is a way to disable any fetching if user didn't configure translations
  private autoFetchDisabled: boolean;
  constructor({
    language,
    defaultTranslations,
    prefix,
    defaultLanguage,
    autoFetchDisabled,
  }: ITranslationsConfig & { autoFetchDisabled?: boolean }) {
    this.config = {
      language,
      defaultTranslations,
      prefix,
      defaultLanguage,
    };
    this.autoFetchDisabled = !!autoFetchDisabled;
  }
  init = async ({
    prepopulated,
  }: {
    prepopulated?: Record<string, string>;
  } = {}) => {
    const { config } = this;

    if (this.autoFetchDisabled && !prepopulated) {
      prepopulated = {};
    }

    const translations =
      prepopulated ??
      (await getSiteTranslations(
        config.language,
        config.defaultTranslations,
        config.prefix,
        config.defaultLanguage,
      ));

    this.i18n = i18n({
      translations,
      language: config.language,
    });
    this.t = (
      key: string | Array<string>,
      options?: i18next.TranslationOptions<object>,
    ) => this.i18n.t(key, options);
    this.all = translations;
    return this;
  };
}
