import React, { FC, useMemo } from 'react';
import { I18nextProvider, initI18n } from '@wix/wix-i18n-config';
import { useModuleParams } from './moduleParams';

export * from '@wix/wix-i18n-config';

export function createI18nProvider(
  defaultLocale: string,
  asyncMessagesLoader: (locale: string) => Promise<Record<string, string>>,
  useSuspense: boolean,
) {
  const Provider: FC = ({ children }) => {
    const { accountLanguage: locale = defaultLocale } = useModuleParams();

    const i18n = useMemo(
      () =>
        initI18n({
          locale,
          asyncMessagesLoader: asyncMessagesLoader.bind(undefined, locale),
          useSuspense,
        }),
      [locale],
    );

    return <I18nextProvider i18n={i18n}>{children}</I18nextProvider>;
  };

  return Provider;
}
