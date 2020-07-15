import * as fakeTpaResponse from './fake-tpa-response.json';

(window.Wix as any) = new (class WixMock {
  modelCache = {};
  siteColors: any;
  siteTextPresets: any;
  styleParams: any;

  constructor() {
    this.siteColors = fakeTpaResponse.res.siteColors;
    this.siteTextPresets = fakeTpaResponse.res.siteTextPresets;
    this.styleParams = fakeTpaResponse.res.style;
  }

  public getComponentInfo() {
    return 'componentInfo';
  }

  public getSiteInfo(cb: Function) {
    cb({
      url: 'https://wix.com/my-site',
      baseUrl: 'https://wix.com/',
    });
  }

  public addEventListener() {}

  public Utils = {
    getViewMode() {
      return 'standalone';
    },
    getCompId() {
      return 'compId';
    },
    getUid() {
      return '123';
    },
    getLocale() {
      return 'en';
    },
    getSiteOwnerId() {
      return '';
    },
    getDeviceType() {
      return 'desktop';
    },
    getInstanceValue() {
      return '';
    },
    getInstanceId() {
      return '';
    },
  };

  public Events = {
    INSTANCE_CHANGED: 'INSTANCE_CHANGED',
    PUBLIC_DATA_CHANGED: 'PUBLIC_DATA_CHANGED',
  };

  public Styles = {
    getSiteColors: (cb: Function) => cb(this.siteColors),
    getSiteTextPresets: (cb: Function) => cb(this.siteTextPresets),
    getStyleParams: (cb: Function) => cb(this.styleParams),
    getStyleId: (cb: Function) => cb('style-jp8ide5x'),
  };

  public Data = {
    Public: {
      getAll: (cb: Function) => cb({}),
      set: () => {},
    },
  };
})();
