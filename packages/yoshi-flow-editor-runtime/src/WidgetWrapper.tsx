import React from 'react';
import {
  withStyles,
  withSentryErrorBoundary,
} from '@wix/native-components-infra';
import { ExperimentsProvider } from '@wix/wix-experiments-react';
import {
  ISantaProps,
  IHostProps,
} from '@wix/native-components-infra/dist/src/types/types';
import { TPAComponentsProvider } from 'wix-ui-tpa/TPAComponentsConfig';
import { I18nextProvider } from 'react-i18next';
import { IWixStatic } from '@wix/native-components-infra/dist/es/src/types/wix-sdk';
import { ExperimentsBag } from '@wix/wix-experiments';
import i18n from './i18next';
import { PublicDataProvider } from './react/PublicData/PublicDataProvider';
import { ControllerProvider } from './react/Controller/ControllerProvider';
import { IControllerContext } from './react/Controller/ControllerContext';
import { SentryConfig } from './constants';
import { buildSentryOptions, getArtifact, biLoggerFromProps } from './utils';
import { WithProviders, ProvidersList } from './react/utils';
import { BILoggerProvider } from './react/BILogger/BILoggerProvider';

declare global {
  interface Window {
    __STATICS_BASE_URL__: string;
  }
}
// TODO - improve this type or bring from controller wrapper
interface IFlowProps {
  __publicData__: Record<string, any>;
  _language: string;
  _translations: Record<string, string>;
  _experiments: ExperimentsBag;
  _biMethods: Record<string, any>;
  _biUtil: Record<string, any>;
  _mobile?: boolean;
  _enabledHOCs: {
    translations: boolean;
    experiments: boolean;
    bi: boolean;
  };
  onAppLoaded?: () => void;
  cssBaseUrl?: string;
}

interface IAppLoadedHandlerProps {
  onAppLoaded?: () => void;
  host: IHostProps;
}

class AppLoadedHandler extends React.Component<IAppLoadedHandlerProps> {
  componentDidMount() {
    if (this.props.onAppLoaded) {
      this.props.host.registerToComponentDidLayout(this.props.onAppLoaded);
    }
  }
  render() {
    return this.props.children;
  }
}

// This widget is going to be called inside entry-point wrappers
// Each widget should contain component to wrap name, so here we return a getter instead of component.
const getWidgetWrapper = (
  UserComponent: React.ComponentType<any>,
  {
    name,
    sentry,
    Wix,
    isEditor,
  }: {
    name: string;
    sentry: SentryConfig | null;
    Wix: IWixStatic | null;
    isEditor?: boolean;
  },
) => {
  const Widget = (props: ISantaProps & IFlowProps & IControllerContext) => {
    const {
      __publicData__,
      _language,
      _translations,
      _enabledHOCs,
      _experiments,
      _mobile,
      _biMethods,
      _biUtil,
      onAppLoaded,
      ...widgetProps
    } = props;

    const biLogger = biLoggerFromProps({
      biMethods: _biMethods,
      biUtil: _biUtil,
    });

    const availableProviders: ProvidersList = [
      (children) => (
        <TPAComponentsProvider value={{ mobile: _mobile }}>
          {children}
        </TPAComponentsProvider>
      ),
      (children) => (
        <ControllerProvider data={props}>{children}</ControllerProvider>
      ),
      (children) => (
        <PublicDataProvider data={__publicData__} sdk={{ Wix }}>
          {children}
        </PublicDataProvider>
      ),
    ];

    if (_enabledHOCs.experiments) {
      availableProviders.push((children) => (
        <ExperimentsProvider options={{ experiments: _experiments }}>
          {children}
        </ExperimentsProvider>
      ));
    }

    if (_enabledHOCs.bi) {
      availableProviders.push((children) => (
        <BILoggerProvider logger={biLogger}>{children}</BILoggerProvider>
      ));
    }

    if (_enabledHOCs.translations) {
      availableProviders.push((children) => (
        <I18nextProvider
          i18n={i18n({
            language: _language,
            translations: _translations,
          })}
        >
          {children}
        </I18nextProvider>
      ));
    }

    // We want AppLoaderHandler to wrap all other providers;
    availableProviders.push((children) => (
      <AppLoadedHandler onAppLoaded={onAppLoaded} host={props.host}>
        {children}
      </AppLoadedHandler>
    ));

    return (
      <WithProviders providers={availableProviders}>
        <UserComponent {...widgetProps} />
      </WithProviders>
    );
  };
  const cssPath = isEditor
    ? `${name}EditorMode.css`
    : `${name}ViewerWidget.css`;

  const stylablePath = isEditor
    ? `${name}EditorMode.stylable.bundle.css`
    : `${name}ViewerWidget.stylable.bundle.css`;

  if (!sentry) {
    return withStyles(Widget, {
      cssPath: [cssPath, stylablePath],
    });
  }

  return withSentryErrorBoundary(
    withStyles(Widget, {
      cssPath: [cssPath, stylablePath],
    }),
    buildSentryOptions(sentry.DSN, 'Viewer', getArtifact()),
  );
};

export default getWidgetWrapper;
