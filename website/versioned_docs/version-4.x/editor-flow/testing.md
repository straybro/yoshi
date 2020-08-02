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

### e2e (sled)
*File pattern used to get sled tests is **`sled/**/*.e2e.spec.ts`***

`end-to-end` tests are handled by [sled](https://wix-private.github.io/sled/) and located under `sled` directory.

After project generated with create-yoshi-app, `sled` directory will be inited with simple tests for each component. It's a basic snapshot and a browser interaction tests.
`sled` will use `viewerUrl` in `dist/sites.ts` as a default page to process e2e tests. Initially it's a basic introductory website, but after `viewerUrl` will be updated to real website with your app installed, sled will be started against it.

To add more sled tests to your projects, please check [the official guide](https://wix-private.github.io/sled/docs/quick-start).
