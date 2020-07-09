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
  constructor({
    language,
    defaultTranslations,
    prefix,
    defaultLanguage,
  }: ITranslationsConfig) {
    this.config = {
      language,
      defaultTranslations,
      prefix,
      defaultLanguage,
    };
  }
  init = async () => {
    const { config } = this;
    const translations = await getSiteTranslations(
      config.language,
      config.defaultTranslations,
      config.prefix,
      config.defaultLanguage,
    );

    this.i18n = i18n({ translations, language: config.language });
    this.t = (
      key: string | Array<string>,
      options?: i18next.TranslationOptions<object>,
    ) => this.i18n.t(key, options);
    this.all = translations;
    return this;
  };
}
