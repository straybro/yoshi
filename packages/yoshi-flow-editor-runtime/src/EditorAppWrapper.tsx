import React, { Suspense } from 'react';
import { ViewerScriptWrapper } from '@wix/native-components-infra';
import SentryGlobal from '@sentry/browser';
import { IAppParams } from '@wix/native-components-infra/dist/src/HOC/ViewerScriptWrapper/viewerScriptWrapper';
import { ErrorBoundary } from './react/ErrorBoundary';
import { WixSDK } from './react/SDK/SDKRenderProp';
import WidgetWrapper from './WidgetWrapper';
import { createControllers, initAppForPageWrapper } from './viewerScript.js';
import {
  IWixSDKContext,
  IWixSDKEditorEnvironmentContext,
} from './react/SDK/SDKContext';
import { WixSDKProvider } from './react/SDK/WixSDKProvider';
import {
  SentryConfig,
  ExperimentsConfig,
  TranslationsConfig,
  DefaultTranslations,
  BIConfig,
} from './constants';
import { InitAppForPageFn, CreateControllerFn } from './types';
import { VisitorBILoggerFactory } from './generated/bi-logger-types';

declare global {
  interface Window {
    __CI_APP_VERSION__: string;
    Sentry: typeof SentryGlobal;
  }
}
interface IEditorAppCreatorProps {
  UserComponent: React.ComponentType<any>;
  userController: CreateControllerFn;
  customInitAppForPage: InitAppForPageFn;
  translationsConfig: TranslationsConfig;
  name: string;
  sentry: SentryConfig | null;
  experimentsConfig: ExperimentsConfig | null;
  defaultTranslations: DefaultTranslations | null;
  biConfig: BIConfig;
  projectName: string;
  biLogger: VisitorBILoggerFactory | null;
}
interface IEditorAppWithWixSDKCreatorProps extends IEditorAppCreatorProps {
  sdk: IWixSDKContext;
  wrapperOptions?: Partial<IAppParams>;
}

interface IEditorAppWrapperProps extends IEditorAppCreatorProps {
  children: React.ReactNode;
}

export type IEditorAppWrapperOptions = Partial<IAppParams>;

// TODO: fill overrides and whatnot from santawrapper
export const createEditorAppForWixSDK = ({
  UserComponent,
  userController,
  customInitAppForPage,
  name,
  sentry,
  experimentsConfig,
  translationsConfig,
  defaultTranslations,
  projectName,
  biConfig,
  biLogger,
  sdk,
  wrapperOptions,
}: IEditorAppWithWixSDKCreatorProps) => {
  const WithComponent = WidgetWrapper(UserComponent, {
    name,
    Wix: sdk.Wix,
    sentry: null,
    isEditor: true,
  });

  return ViewerScriptWrapper(WithComponent, {
    viewerScript: {
      createControllers: createControllers(
        userController,
        translationsConfig,
        experimentsConfig,
        defaultTranslations,
        biConfig,
        biLogger,
        projectName,
      ),
      initAppForPage: initAppForPageWrapper({
        initAppForPage: customInitAppForPage,
        defaultTranslations,
        translationsConfig,
        sentryConfig: sentry,
        experimentsConfig,
        inEditor: true,
        projectName,
        biLogger,
        biConfig,
        appName: null,
      }),
    },
    Wix: sdk.Wix,
    widgetConfig: {
      widgetId: '',
      getAllPublicData: true,
    },
    ...(wrapperOptions ?? {}),
  });
};

interface IEditorAppWithCreatorState {
  EditorAppComponent: React.ComponentType | null;
}
interface IEditorAppWithCreatorProps extends IEditorAppWrapperProps {
  sdk: IWixSDKContext;
}

class EditorAppWithCreator extends React.Component<
  IEditorAppWithCreatorProps,
  IEditorAppWithCreatorState
> {
  constructor(props: IEditorAppWithCreatorProps) {
    super(props);

    let EditorAppComponent = null;
    if (props.sdk.Wix) {
      EditorAppComponent = createEditorAppForWixSDK(props);
      // Just to verify we are not exposing it.
    } else if ((props.sdk as any).editorSDK) {
      throw new Error('Editor App does not support editorSDK');
    }

    this.state = {
      EditorAppComponent,
    };
  }
  render() {
    const { EditorAppComponent } = this.state;

    if (!EditorAppComponent) {
      return null;
    }

    return <EditorAppComponent {...this.props} />;
  }
}

export default (props: IEditorAppWrapperProps) => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <WixSDKProvider>
        <WixSDK>
          {(sdk) => {
            if (!props.sentry) {
              return (
                <ErrorBoundary handleException={(error) => console.log(error)}>
                  <EditorAppWithCreator sdk={sdk} {...props} />
                </ErrorBoundary>
              );
            }

            const Wix = sdk
              ? (sdk as IWixSDKEditorEnvironmentContext).Wix
              : null;

            if (Wix) {
              window.Sentry.configureScope((scope) => {
                scope.setTag('msid', Wix.Utils.getInstanceValue('metaSiteId'));
                scope.setTag('environment', 'Editor');
                scope.setUser({
                  id: Wix.Utils.getInstanceValue('uid'),
                });
              });
            }

            return (
              <ErrorBoundary handleException={window.Sentry.captureException}>
                <EditorAppWithCreator sdk={sdk} {...props} />
              </ErrorBoundary>
            );
          }}
        </WixSDK>
      </WixSDKProvider>
    </Suspense>
  );
};
