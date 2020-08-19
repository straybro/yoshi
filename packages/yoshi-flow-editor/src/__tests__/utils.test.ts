import {
  OOI_WIDGET_COMPONENT_TYPE,
  PAGE_COMPONENT_TYPE,
} from 'yoshi-flow-editor-runtime/build/constants';
import { overrideQueryParamsWithModel } from '../utils';

describe('addOverrideQueryParamsWithModel', () => {
  const cdnUrl = 'https://localhost:5005/';
  const serverUrl = 'https://localhost:5004';
  it('generates override params for single url', () => {
    const overrideParams = overrideQueryParamsWithModel(
      {
        appName: 'app',
        projectName: '@wix/app',
        artifactId: '7891',
        createControllersStrategy: 'all',
        externalViewerScriptPath: null,
        editorEntryFileName: 'a/b/editor.app.ts',
        viewerEntryFileName: 'a/b',
        biConfig: {
          visitor: 'bi-visitor-package',
          owner: 'bi-owner-package',
        },
        appDefId: 'APP_DEF_ID',
        sentry: null,
        translationsConfig: {},
        urls: {
          viewerUrl: 'https://google.com',
          editorUrl: 'https://google.com',
        },
        experimentsConfig: {
          scope: 'test-scope',
        },
        components: [
          {
            name: 'comp',
            id: 'WIDGET_ID',
            type: OOI_WIDGET_COMPONENT_TYPE,
            widgetFileName: 'proj/comp/Widget.ts',
            viewerControllerFileName: 'proj/comp/controller.ts',
            editorControllerFileName: null,
            settingsFileName: 'proj/comp/settings.ts',
            settingsMobileFileName: 'proj/comp/settings.mobile.ts',
          },
        ],
      },
      { cdnUrl, serverUrl },
    );
    const urlWithParams = overrideParams('https://mysite.com', 'editorUrl');

    expect(urlWithParams).toBe(
      `https://mysite.com/?tpaWidgetUrlOverride=WIDGET_ID=${serverUrl}/editor/comp&tpaMobileUrlOverride=WIDGET_ID=https://localhost:5004/editor/comp&tpaSettingsUrlOverride=WIDGET_ID=${serverUrl}/settings/comp&widgetsUrlOverride=WIDGET_ID=${cdnUrl}compViewerWidget.bundle.js&viewerPlatformOverrides=APP_DEF_ID=${cdnUrl}viewerScript.bundle.js&editorScriptUrlOverride=APP_DEF_ID=${cdnUrl}editorScript.bundle.js&overridePlatformBaseUrls=APP_DEF_ID={"staticsBaseUrl":"${cdnUrl}"}`,
    );
  });

  it('generates override params for multiple url', () => {
    const overrideParams = overrideQueryParamsWithModel(
      {
        appName: 'app',
        projectName: '@wix/app',
        artifactId: '7891',
        urls: {},
        externalViewerScriptPath: null,
        createControllersStrategy: 'controller',
        translationsConfig: {},
        biConfig: {
          visitor: 'bi-visitor-package',
          owner: 'bi-owner-package',
        },
        experimentsConfig: {
          scope: 'test-scope',
        },
        editorEntryFileName: 'a/b/editor.app.ts',
        viewerEntryFileName: 'a/b',
        appDefId: 'APP_DEF_ID',
        sentry: null,
        components: [
          {
            name: 'comp',
            id: 'COMP_WIDGET_ID',
            type: OOI_WIDGET_COMPONENT_TYPE,
            widgetFileName: 'proj/comp/Widget.ts',
            viewerControllerFileName: 'proj/comp/controller.ts',
            editorControllerFileName: null,
            settingsFileName: 'proj/comp/settings.ts',
            settingsMobileFileName: 'proj/comp/settings.mobile.ts',
          },
          {
            name: 'page',
            id: 'PAGE_WIDGET_ID',
            type: PAGE_COMPONENT_TYPE,
            widgetFileName: 'proj/page/Widget.ts',
            viewerControllerFileName: 'proj/page/controller.ts',
            editorControllerFileName: null,
            settingsFileName: 'proj/page/settings.ts',
            settingsMobileFileName: 'proj/comp/settings.mobile.ts',
          },
        ],
      },
      { cdnUrl, serverUrl },
    );
    const urlWithParams = overrideParams('https://mysite.com', 'editorUrl');

    expect(urlWithParams).toBe(
      `https://mysite.com/?tpaWidgetUrlOverride=COMP_WIDGET_ID=${serverUrl}/editor/comp,PAGE_WIDGET_ID=${serverUrl}/editor/page&tpaMobileUrlOverride=COMP_WIDGET_ID=https://localhost:5004/editor/comp,PAGE_WIDGET_ID=https://localhost:5004/editor/page&tpaSettingsUrlOverride=COMP_WIDGET_ID=${serverUrl}/settings/comp,PAGE_WIDGET_ID=${serverUrl}/settings/page&widgetsUrlOverride=COMP_WIDGET_ID=${cdnUrl}compViewerWidget.bundle.js,PAGE_WIDGET_ID=${cdnUrl}pageViewerWidget.bundle.js&viewerPlatformOverrides=APP_DEF_ID=${cdnUrl}viewerScript.bundle.js&editorScriptUrlOverride=APP_DEF_ID=${cdnUrl}editorScript.bundle.js&overridePlatformBaseUrls=APP_DEF_ID={"staticsBaseUrl":"${cdnUrl}"}`,
    );
  });

  it("doesn't generate override params for editor script", () => {
    const overrideParams = overrideQueryParamsWithModel(
      {
        appName: 'app',
        projectName: '@wix/app',
        artifactId: '7891',
        createControllersStrategy: 'all',
        urls: {},
        biConfig: {},
        externalViewerScriptPath: null,
        translationsConfig: null,
        editorEntryFileName: null,
        viewerEntryFileName: 'a/b',
        appDefId: 'APP_DEF_ID',
        experimentsConfig: {
          scope: 'test-scope',
        },
        sentry: null,
        components: [
          {
            name: 'comp',
            id: 'WIDGET_ID',
            type: OOI_WIDGET_COMPONENT_TYPE,
            widgetFileName: 'proj/comp/Widget.ts',
            viewerControllerFileName: 'proj/comp/controller.ts',
            editorControllerFileName: null,
            settingsFileName: 'proj/comp/settings.ts',
            settingsMobileFileName: null,
          },
        ],
      },
      { cdnUrl, serverUrl },
    );
    const urlWithParams = overrideParams('https://mysite.com', 'editorUrl');

    expect(urlWithParams).toBe(
      `https://mysite.com/?tpaWidgetUrlOverride=WIDGET_ID=${serverUrl}/editor/comp&tpaMobileUrlOverride=WIDGET_ID=https://localhost:5004/editor/comp&tpaSettingsUrlOverride=WIDGET_ID=${serverUrl}/settings/comp&widgetsUrlOverride=WIDGET_ID=${cdnUrl}compViewerWidget.bundle.js&viewerPlatformOverrides=APP_DEF_ID=${cdnUrl}viewerScript.bundle.js&editorScriptUrlOverride=APP_DEF_ID=https://localhost:5005/editorScript.bundle.js&overridePlatformBaseUrls=APP_DEF_ID={"staticsBaseUrl":"${cdnUrl}"}`,
    );
  });

  it('use only supported query params for appBuilder', () => {
    const overrideParams = overrideQueryParamsWithModel(
      {
        appName: 'app',
        projectName: 'some-project',
        artifactId: '7891',
        urls: {},
        createControllersStrategy: 'all',
        translationsConfig: {},
        externalViewerScriptPath: null,
        biConfig: {
          visitor: 'bi-visitor-package',
          owner: 'bi-owner-package',
        },
        editorEntryFileName: null,
        viewerEntryFileName: 'a/b',
        appDefId: 'APP_DEF_ID',
        experimentsConfig: {
          scope: 'test-scope',
        },
        sentry: null,
        components: [
          {
            name: 'comp',
            id: 'WIDGET_ID',
            type: OOI_WIDGET_COMPONENT_TYPE,
            widgetFileName: 'proj/comp/Widget.ts',
            viewerControllerFileName: 'proj/comp/controller.ts',
            editorControllerFileName: null,
            settingsFileName: 'proj/comp/settings.ts',
            settingsMobileFileName: 'proj/comp/settings.mobile.ts',
          },
        ],
      },
      { cdnUrl, serverUrl },
    );
    const urlWithParams = overrideParams('https://mysite.com', 'appBuilderUrl');

    expect(urlWithParams).toBe(
      `https://mysite.com/?viewerPlatformOverrides=APP_DEF_ID=${cdnUrl}viewerScript.bundle.js`,
    );
  });

  it('should not use any override if origin not recognaized', () => {
    const overrideParams = overrideQueryParamsWithModel(
      {
        appName: 'app',
        artifactId: '7891',
        urls: {},
        editorEntryFileName: null,
        projectName: 'some-project',
        createControllersStrategy: 'all',
        viewerEntryFileName: 'a/b',
        appDefId: 'APP_DEF_ID',
        externalViewerScriptPath: 'a/b/c',
        biConfig: {
          visitor: 'bi-visitor-package',
          owner: 'bi-owner-package',
        },
        translationsConfig: {},
        experimentsConfig: {
          scope: 'test-scope',
        },
        sentry: null,
        components: [
          {
            name: 'comp',
            id: 'WIDGET_ID',
            type: OOI_WIDGET_COMPONENT_TYPE,
            widgetFileName: 'proj/comp/Widget.ts',
            viewerControllerFileName: 'proj/comp/controller.ts',
            editorControllerFileName: null,
            settingsFileName: 'proj/comp/settings.ts',
            settingsMobileFileName: 'proj/comp/settings.mobile.ts',
          },
        ],
      },
      { cdnUrl, serverUrl },
    );
    const urlWithParams = overrideParams('https://mysite.com', 'FAKE');

    expect(urlWithParams).toBe(`https://mysite.com/`);
  });

  it("generates override params for settings only if it's included in the model's component", () => {
    const overrideParams = overrideQueryParamsWithModel(
      {
        appName: 'app',
        projectName: '@wix/app',
        artifactId: '7891',
        createControllersStrategy: 'all',
        editorEntryFileName: 'a/b/editor.app.ts',
        viewerEntryFileName: 'a/b',
        externalViewerScriptPath: null,
        biConfig: {
          visitor: 'bi-visitor-package',
          owner: 'bi-owner-package',
        },
        appDefId: 'APP_DEF_ID',
        sentry: null,
        translationsConfig: {},
        urls: {
          viewerUrl: 'https://google.com',
          editorUrl: 'https://google.com',
        },
        experimentsConfig: {
          scope: 'test-scope',
        },
        components: [
          {
            name: 'comp',
            id: 'WIDGET_ID',
            type: OOI_WIDGET_COMPONENT_TYPE,
            widgetFileName: 'proj/comp/Widget.ts',
            viewerControllerFileName: 'proj/comp/controller.ts',
            editorControllerFileName: null,
            settingsFileName: null,
            settingsMobileFileName: null,
          },
          {
            name: 'comp2',
            id: 'WIDGET_ID_2',
            type: OOI_WIDGET_COMPONENT_TYPE,
            widgetFileName: 'proj/comp/Widget2.ts',
            viewerControllerFileName: 'proj/comp/controller-2.ts',
            editorControllerFileName: null,
            settingsFileName: 'path/to/settings-2',
            settingsMobileFileName: null,
          },
        ],
      },
      { cdnUrl, serverUrl },
    );
    const urlWithParams = overrideParams('https://mysite.com', 'editorUrl');

    expect(urlWithParams).toBe(
      `https://mysite.com/?tpaWidgetUrlOverride=WIDGET_ID=https://localhost:5004/editor/comp,WIDGET_ID_2=https://localhost:5004/editor/comp2&tpaMobileUrlOverride=WIDGET_ID=https://localhost:5004/editor/comp,WIDGET_ID_2=https://localhost:5004/editor/comp2&tpaSettingsUrlOverride=WIDGET_ID_2=https://localhost:5004/settings/comp2&widgetsUrlOverride=WIDGET_ID=https://localhost:5005/compViewerWidget.bundle.js,WIDGET_ID_2=https://localhost:5005/comp2ViewerWidget.bundle.js&viewerPlatformOverrides=APP_DEF_ID=https://localhost:5005/viewerScript.bundle.js&editorScriptUrlOverride=APP_DEF_ID=https://localhost:5005/editorScript.bundle.js&overridePlatformBaseUrls=APP_DEF_ID={"staticsBaseUrl":"https://localhost:5005/"}`,
    );
  });
});
