import React, { FC, useMemo } from 'react';
import { initI18n } from '@wix/wix-i18n-config';
import { ExperimentsProvider } from '@wix/wix-experiments-react';
import { ExperimentsBag } from '@wix/wix-experiments';
import ComponentInfoProvider, {
  ComponentInfo,
} from '../hooks/ComponentInfoProvider';
import { I18nextProvider } from '../i18n';
import BILoggerProvider from '../hooks/BILoggerProvider';
import { IBMModuleParams, ModuleProvider } from '../moduleParams';
import FedopsProvider from '../hooks/FedopsProvider';
import { BILogger } from '../bi';

export { initI18n } from '@wix/wix-i18n-config';

const defaultLocale = 'en';

const i18nMock = initI18n({
  locale: defaultLocale,
  messages: {},
});

interface TestProviderProps {
  componentInfo: ComponentInfo;
  i18n?: ReturnType<typeof initI18n>;
  experiments?: ExperimentsBag;
  bi?: BILogger;
  moduleParams?: IBMModuleParams;
  fedops?: string;
}

const defaultModuleParams: IBMModuleParams = {
  accountLanguage: defaultLocale,
  primarySiteLocale: defaultLocale,
  config: { topology: {} },
  debug: false,
  viewMode: '',
  instanceId: '',
  metaSiteId: '',
  siteName: '',
  userId: '',
  userPermissions: [],
  userRole: 'owner',
};

const TestProvider: FC<TestProviderProps> = ({
  children,
  componentInfo,
  i18n = i18nMock,
  experiments = {},
  bi,
  moduleParams = defaultModuleParams,
  fedops = 'app-name',
}) => {
  return (
    <ComponentInfoProvider componentInfo={componentInfo}>
      <ModuleProvider moduleParams={moduleParams}>
        <I18nextProvider i18n={i18n}>
          <ExperimentsProvider experiments={experiments}>
            <FedopsProvider appName={fedops}>
              <BILoggerProvider logger={bi}>{children}</BILoggerProvider>
            </FedopsProvider>
          </ExperimentsProvider>
        </I18nextProvider>
      </ModuleProvider>
    </ComponentInfoProvider>
  );
};

export type PageTestProviderProps = Omit<TestProviderProps, 'componentInfo'>;

export const PageTestProvider: FC<PageTestProviderProps> = (props) => {
  const componentInfo: ComponentInfo = useMemo(
    () => ({ componentId: '', type: 'page' }),
    [],
  );

  return <TestProvider componentInfo={componentInfo} {...props} />;
};

export type ExportedComponentTestProviderProps = Omit<
  TestProviderProps,
  'componentInfo'
>;

export const ExportedComponentTestProvider: FC<ExportedComponentTestProviderProps> = (
  props,
) => {
  const componentInfo: ComponentInfo = useMemo(
    () => ({ componentId: '', type: 'exported-component' }),
    [],
  );

  return <TestProvider componentInfo={componentInfo} {...props} />;
};
