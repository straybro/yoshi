import { overrideQueryParamsWithModel } from '../utils';

describe('addOverrideQueryParamsWithModel', () => {
  const cdnUrl = 'https://localhost:5005/';
  const serverUrl = 'https://localhost:5004';
  it('generates override params for single url', () => {
    const overrideParams = overrideQueryParamsWithModel(
      {
        appName: 'app',
        artifactId: '7891',
        editorEntryFileName: 'a/b/editor.app.ts',
        initApp: 'a/b',
        appDefId: 'APP_DEF_ID',
        components: [
          {
            name: 'comp',
            id: 'WIDGET_ID',
            type: 'widget',
            fileName: 'proj/comp/Widget.ts',
            controllerFileName: 'proj/comp/controller.ts',
            settingsFileName: 'proj/comp/settings.ts',
          },
        ],
      },
      { cdnUrl, serverUrl },
    );
    const urlWithParams = overrideParams('https://mysite.com');

    expect(urlWithParams).toBe(
      `https://mysite.com/?tpaWidgetUrlOverride=WIDGET_ID=${serverUrl}/editor/comp&tpaSettingsUrlOverride=WIDGET_ID=${serverUrl}/settings/comp&widgetsUrlOverride=WIDGET_ID=${cdnUrl}compViewerWidget.bundle.js&viewerPlatformOverrides=APP_DEF_ID=${cdnUrl}viewerScript.bundle.js&editorScriptUrlOverride=APP_DEF_ID=${cdnUrl}editorScript.bundle.js&overridePlatformBaseUrls=APP_DEF_ID={"staticsBaseUrl":"${cdnUrl}"}`,
    );
  });

  it('generates override params for multiple url', () => {
    const overrideParams = overrideQueryParamsWithModel(
      {
        appName: 'app',
        artifactId: '7891',
        editorEntryFileName: 'a/b/editor.app.ts',
        initApp: 'a/b',
        appDefId: 'APP_DEF_ID',
        components: [
          {
            name: 'comp',
            id: 'COMP_WIDGET_ID',
            type: 'widget',
            fileName: 'proj/comp/Widget.ts',
            controllerFileName: 'proj/comp/controller.ts',
            settingsFileName: 'proj/comp/settings.ts',
          },
          {
            name: 'page',
            id: 'PAGE_WIDGET_ID',
            type: 'page',
            fileName: 'proj/page/Widget.ts',
            controllerFileName: 'proj/page/controller.ts',
            settingsFileName: 'proj/page/settings.ts',
          },
        ],
      },
      { cdnUrl, serverUrl },
    );
    const urlWithParams = overrideParams('https://mysite.com');

    expect(urlWithParams).toBe(
      `https://mysite.com/?tpaWidgetUrlOverride=COMP_WIDGET_ID=${serverUrl}/editor/comp,PAGE_WIDGET_ID=${serverUrl}/editor/page&tpaSettingsUrlOverride=COMP_WIDGET_ID=${serverUrl}/settings/comp,PAGE_WIDGET_ID=${serverUrl}/settings/page&widgetsUrlOverride=COMP_WIDGET_ID=${cdnUrl}compViewerWidget.bundle.js,PAGE_WIDGET_ID=${cdnUrl}pageViewerWidget.bundle.js&viewerPlatformOverrides=APP_DEF_ID=${cdnUrl}viewerScript.bundle.js&editorScriptUrlOverride=APP_DEF_ID=${cdnUrl}editorScript.bundle.js&overridePlatformBaseUrls=APP_DEF_ID={"staticsBaseUrl":"${cdnUrl}"}`,
    );
  });

  it("doesn't generate override params for editor script", () => {
    const overrideParams = overrideQueryParamsWithModel(
      {
        appName: 'app',
        artifactId: '7891',
        editorEntryFileName: null,
        initApp: 'a/b',
        appDefId: 'APP_DEF_ID',
        components: [
          {
            name: 'comp',
            id: 'WIDGET_ID',
            type: 'widget',
            fileName: 'proj/comp/Widget.ts',
            controllerFileName: 'proj/comp/controller.ts',
            settingsFileName: 'proj/comp/settings.ts',
          },
        ],
      },
      { cdnUrl, serverUrl },
    );
    const urlWithParams = overrideParams('https://mysite.com');

    expect(urlWithParams).toBe(
      `https://mysite.com/?tpaWidgetUrlOverride=WIDGET_ID=${serverUrl}/editor/comp&tpaSettingsUrlOverride=WIDGET_ID=${serverUrl}/settings/comp&widgetsUrlOverride=WIDGET_ID=${cdnUrl}compViewerWidget.bundle.js&viewerPlatformOverrides=APP_DEF_ID=${cdnUrl}viewerScript.bundle.js&overridePlatformBaseUrls=APP_DEF_ID={"staticsBaseUrl":"${cdnUrl}"}`,
    );
  });
});
