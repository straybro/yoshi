---
id: testing
title: Testing
sidebar_label: Testing
---

Yoshi flow editor supports unit and e2e testing configuration for Out of iFrame projects. Moreover, you can always add [sled](https://wix-private.github.io/sled/) tests to your app to verify the widget is rendering correctly in production environment.

By running `npm run test` we'll run both unit (jest) and e2e (sled) tests.

### unit (jest)
*File pattern used for unit tests is **`src/**/*.spec.ts`***

Each unit test are being executed in [JSDOM](https://github.com/jsdom/jsdom) environment.
OOI template generated with `create-yoshi-app` already have unit tests for `Widget`, `controller` and `Settings` parts.

It's based on [`jest-yoshi-preset`](https://bo.wix.com/pages/yoshi/docs/jest-yoshi-preset), so it provides the same testing configuration as other yoshi apps.

#### Testing controller lifecycle
For proper integration testing, we recommend to use sled, but if you still want to test your controller part with jest you can emulate the controller lifecycle.

Since editor flow provides extended API with some useful features, you have to mock this part.
By using `componentWrapper` for component and controller, you can emulate `flowAPI` instance.

`controllerWrapper` accepts controller function (the one you are exporting from `controller.ts`) and returns a controller with mocked `flowAPI`.

With `componentWrapper` you can just pass your `component`, `controller` and `initAppForPage` to receive React Component with mocked controller lifecycle.

_controller.spec.ts_
```ts
import { componentWrapper } from 'yoshi-flow-editor-runtime/test';
import Widget from './Widget';
import controller from './controller';
import { initAppForPage } from '../../viewer.app.ts';
import { render, screen } from '@testing-library/react'

test('Widget is rendered', () => {
  const widget = render(
    componentWrapper({
      component: Widget,
      controller: controller,
      initAppForPage: initAppForPage, // optional
      wrapperOptions: {}
    })
  );
  expect(screen.getByRole('button')).toHaveTextContent('hello')
});
```
`componentWrapper` can be rendered as a regular React Component during testing.

`wrapperOptions` - options will be passed to `ViewerScriptWrapper`.  Docs and available options are available under [ViewerScriptWrapper docs](https://github.com/wix-private/native-components-infra#viewerscriptwrapper).

---

In case you are developing **multi-GAble** widget and `createControllers` are happening in non-editor-flow project, you can pass mocked fedops, bi, sentry loggers, experiments, and translations.

This is an example how to mock a simple integation between widget and controller using `controllerWrapper` and `ViewerScriptWrapper` on your side:

*`createViewerScript.ts`*
```ts
export const createViewerScript = (controllers, opts) => {
  return {
    createControllers(configs) {
      return configs.map(config => {
        const factory = controllers[config.type];
        return factory({
          ...config,
          prepopulated: {
            biLogger: opts.biLogger,
            fedopsLogger: opts.fedopsLogger,
            sentryMonitor: opts.sentryMonitor,
            translations: opts.translations,
            experimentss: opts.experiments,
          }
        });
      });
    }
  };
};
```
In `createViewerScript` function you can pass `prepopulated` values with mocks. It will prevent data to be fetched.

*We believe it can be fully replaced with sled since instead of mocks we are testing our components against the real environment.*

### e2e (sled)
*File pattern used to get sled tests is **`sled/**/*.e2e.spec.ts`***

`end-to-end` tests are handled by [sled](https://wix-private.github.io/sled/) and located under `sled` directory.

After project generated with create-yoshi-app, `sled` directory will be inited with simple tests for each component. It's a basic snapshot and a browser interaction tests.
`sled` will use `viewerUrl` in `dist/sites.ts` as a default page to process e2e tests. Initially it's a basic introductory website, but after `viewerUrl` will be updated to real website with your app installed, sled will be started against it.

To add more sled tests to your projects, please check [the official guide](https://wix-private.github.io/sled/docs/quick-start).
