import { IWidgetControllerConfig } from '@wix/native-components-infra/dist/src/types/types';
import { fedOpsLoggerFactory } from '@wix/native-components-infra/dist/test/mocks/fedopsLoggerFactoryMock';
import { PubSubMock } from '@wix/native-components-infra/dist/test/mocks/pubSubMock';
import { StorageMock } from '@wix/native-components-infra/dist/test/mocks/storageMock';

import { merge } from 'lodash';

export const platformAPIs = {
  fedOpsLoggerFactory,
  pubSub: new PubSubMock(),
  getCsrfToken: jest.fn(),
  storage: new StorageMock() as any,
};

export const wixCodeAPIMock = {
  location: {
    navigateToSection: jest.fn(),
    baseUrl: '/',
    path: ['/'],
    onChange: jest.fn(),
    query: {},
    url: '',
    queryParams: { add: jest.fn(), remove: jest.fn() },
  },
  user: {
    currentUser: {
      id: '1',
      loggedIn: true,
      role: 'Admin',
      getEmail: jest.fn(),
      getPricingPlans: jest.fn(),
      getRoles: jest.fn(),
    },
    promptLogin: jest.fn(),
    logout: jest.fn(),
    promptForgotPassword: jest.fn(),
    onLogin: jest.fn(),
    emailUser: jest.fn(),
    register: jest.fn(),
    login: jest.fn(),
    applySessionToken: jest.fn(),
  },
  seo: {
    renderSEOTags: jest.fn(),
    isInSEO: jest.fn(),
    setSeoStatusCode: jest.fn(),
  },
  window: {
    openModal: jest.fn(),
    trackEvent: jest.fn(),
    closeWindow: jest.fn(),
    openPopup: jest.fn(),
    openPersistentPopup: jest.fn(),
    locale: 'en',
    viewMode: 'Site',
    isMobileFriendly: true,
    rendering: {
      env: 'browser',
      renderCycle: 1,
    },
    formFactor: 'Desktop',
    multilingual: {
      isEnabled: false,
      currentLanguage: 'en',
      siteLanguages: [],
    },
  },
  site: {
    language: 'en',
    getSectionUrl: jest.fn(),
    getCurrentPageInfo: jest.fn(),
    getSiteStructure: jest.fn(),
    setPageMetaData: jest.fn(),
    isAppSectionInstalled: jest.fn(),
    currentPage: { id: 'home' },
    getPublicAPI: jest.fn(),
    revision: 'x.x.',
    onInstanceChanged: jest.fn(),
  },
} as any;

export const controllerConfigMock = (
  extended: Partial<IWidgetControllerConfig> = {},
): IWidgetControllerConfig =>
  merge(
    {
      type: 'xxx',
      compId: 'xxx',
      warmupData: jest.fn(),
      $w: jest.fn() as any,
      platformAPIs,
      config: {
        publicData: {
          COMPONENT: {},
          APP: {},
        },
        style: {
          styleParams: {
            numbers: {},
            booleans: {},
            googleFontsCssUrl: '/',
          },
        },
        externalId: '123',
      },
      appParams: {
        instance: 'xxx',
        instanceId: '123',
        appDefinitionId: 'APP_DEF_ID',
        baseUrls: {
          staticsBaseUrl: '/',
        },
      },
      setProps: jest.fn(),
      wixCodeApi: wixCodeAPIMock,
    },
    extended,
  );
