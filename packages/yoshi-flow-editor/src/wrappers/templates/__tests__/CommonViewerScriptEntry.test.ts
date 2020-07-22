import {
  OOI_WIDGET_COMPONENT_TYPE,
  PLATFORM_WIDGET_COMPONENT_TYPE,
} from 'yoshi-flow-editor-runtime/build/constants';
import commonViewerScriptEntry from '../CommonViewerScriptEntry';

describe('CommonViewerScriptEntry template', () => {
  it('generates correct template with a single controller', () => {
    const generateControllerEntryContent = commonViewerScriptEntry({
      viewerScriptWrapperPath:
        'yoshi-flow-editor-runtime/build/viewerScript.js',
      sentryConfig: null,
      projectName: 'someProject',
      defaultTranslations: {},
      createControllersStrategy: 'all',
      biConfig: {},
      visitorBiLoggerPath: 'a/b/c',
      translationsConfig: null,
      appName: 'someapp',
      controllersMeta: [
        {
          controllerFileName: 'project/src/components/button/controller.ts',
          id: '123',
          widgetType: OOI_WIDGET_COMPONENT_TYPE,
          controllerId: 'CONTROLLER_ID',
          componentName: 'SomeWidget',
        },
      ],
      experimentsConfig: {
        scope: 'test-scope',
      },
      viewerEntryFileName: 'project/src/app.ts',
    });

    expect(generateControllerEntryContent).toMatchSnapshot();
  });

  it('generates correct template with a single controller and without viewerEntryFileName', () => {
    const generateControllerEntryContent = commonViewerScriptEntry({
      viewerScriptWrapperPath:
        'yoshi-flow-editor-runtime/build/viewerScript.js',
      sentryConfig: null,
      projectName: 'someProject',
      appName: 'someApp',
      visitorBiLoggerPath: 'a/b/c',
      defaultTranslations: null,
      createControllersStrategy: 'all',
      biConfig: {},
      translationsConfig: {
        default: 'en',
      },
      controllersMeta: [
        {
          controllerFileName: 'project/src/components/button/controller.ts',
          componentName: 'SomeComp',
          id: '123',
          widgetType: OOI_WIDGET_COMPONENT_TYPE,
        },
      ],
      experimentsConfig: {
        scope: 'test-scope',
      },
      viewerEntryFileName: null,
    });

    expect(generateControllerEntryContent).toMatchSnapshot();
  });

  it('generates correct template with multiple controllers', () => {
    const generateControllerEntryContent = commonViewerScriptEntry({
      viewerScriptWrapperPath:
        'yoshi-flow-editor-runtime/build/viewerScript.js',
      sentryConfig: null,
      appName: 'someapp',
      visitorBiLoggerPath: 'a/b/c',
      projectName: 'someProject',
      createControllersStrategy: 'controller',
      defaultTranslations: { a: 'b' },
      biConfig: {
        visitor: 'visitor-bi-package',
        owner: 'owner-bi-package',
      },
      translationsConfig: {
        default: 'en',
      },
      controllersMeta: [
        {
          controllerFileName: 'project/src/components/todo/controller.ts',
          id: '123',
          widgetType: OOI_WIDGET_COMPONENT_TYPE,
          controllerId: 'CONTROLLER_ID',
          componentName: 'SomeWidget',
        },
        {
          controllerFileName: 'project/src/components/todo/controller.ts',
          id: '567',
          widgetType: OOI_WIDGET_COMPONENT_TYPE,
          controllerId: 'CONTROLLER_ID',
          componentName: 'SomeWidget',
        },
      ],
      experimentsConfig: {
        scope: 'test-scope',
      },
      viewerEntryFileName: 'project/src/app.ts',
    });

    expect(generateControllerEntryContent).toMatchSnapshot();
  });

  it('generates correct template with controllerId override', () => {
    const generateControllerEntryContent = commonViewerScriptEntry({
      viewerScriptWrapperPath:
        'yoshi-flow-editor-runtime/build/viewerScript.js',
      sentryConfig: null,
      projectName: 'someProject',
      appName: 'someapp',
      createControllersStrategy: 'all',
      defaultTranslations: { a: 'b' },
      visitorBiLoggerPath: null,
      biConfig: {
        visitor: 'visitor-bi-package',
        owner: 'owner-bi-package',
      },
      translationsConfig: {
        default: 'en',
      },
      controllersMeta: [
        {
          controllerFileName: 'project/src/components/todo/controller.ts',
          id: '123',
          widgetType: PLATFORM_WIDGET_COMPONENT_TYPE,
          controllerId: 'CONTROLLER_ID',
          componentName: 'SomeWidget',
        },
        {
          controllerFileName: 'project/src/components/todo/controller.ts',
          id: '567',
          controllerId: '09876',
          widgetType: PLATFORM_WIDGET_COMPONENT_TYPE,
          componentName: 'SomeWidget',
        },
      ],
      experimentsConfig: {
        scope: 'test-scope',
      },
      viewerEntryFileName: 'project/src/app.ts',
    });

    expect(generateControllerEntryContent).toMatchSnapshot();
  });

  it('generates correct template w/o controllers', () => {
    const generateControllerEntryContent = commonViewerScriptEntry({
      viewerScriptWrapperPath:
        'yoshi-flow-editor-runtime/build/viewerScript.js',
      sentryConfig: null,
      projectName: 'someProject',
      createControllersStrategy: 'all',
      visitorBiLoggerPath: 'a/b/c',
      biConfig: {
        visitor: 'visitor-bi-package',
        owner: 'owner-bi-package',
      },
      translationsConfig: {
        default: 'en',
      },
      defaultTranslations: { a: 'b' },
      appName: 'someApp',
      controllersMeta: [],
      experimentsConfig: {
        scope: 'test-scope',
      },
      viewerEntryFileName: 'project/src/app.ts',
    });

    expect(generateControllerEntryContent).toMatchSnapshot();
  });

  it('generates correct template with sentry', () => {
    const generateControllerEntryContent = commonViewerScriptEntry({
      translationsConfig: {
        default: 'en',
      },
      defaultTranslations: { a: 'b' },
      projectName: 'someProject',
      createControllersStrategy: 'all',
      biConfig: {
        visitor: 'visitor-bi-package',
        owner: 'owner-bi-package',
      },
      visitorBiLoggerPath: null,
      viewerScriptWrapperPath:
        'yoshi-flow-editor-runtime/build/viewerScript.js',
      sentryConfig: {
        DSN: 'https:xxx@123',
        teamName: 'team-name',
        projectName: 'project-name',
        id: 'xxx',
      },
      appName: 'someApp',
      controllersMeta: [
        {
          controllerFileName: 'project/src/components/button/controller.ts',
          id: '123',
          widgetType: OOI_WIDGET_COMPONENT_TYPE,
          controllerId: 'CONTROLLER_ID',
          componentName: 'SomeWidget',
        },
      ],
      experimentsConfig: {
        scope: 'test-scope',
      },
      viewerEntryFileName: 'project/src/app.ts',
    });

    expect(generateControllerEntryContent).toMatchSnapshot();
  });
});
