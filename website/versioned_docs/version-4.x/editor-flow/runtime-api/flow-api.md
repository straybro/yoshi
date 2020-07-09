---
id: flow-api
title: flowAPI
sidebar_label: flowAPI
---

To extend platform API's editor flow passes an additional value to platform methods.
This value is an object called `flowAPI`. It's already configured for:

- **app level**. `flowAPI` will be passed for `initAppForPage` and editor script methods from `editor.app.ts`. (`editorReady`, `getManifest`, etc)
- **component level:** `flowAPI` will be a field for user's `controller.ts`.

In this section we'll go through instances and helpers `flowAPI` provides. In practice, `flowAPI` is not a single instance. Its shape will vary according to consumer's environment:

- `editor.app.ts`: [`EditorScriptFlowAPI`](https://github.com/wix/yoshi/blob/master/packages/yoshi-flow-editor-runtime/src/FlowAPI.ts#L91)
- `viewer.app.ts`: [`ViewerScriptFlowAPI`](https://github.com/wix/yoshi/blob/master/packages/yoshi-flow-editor-runtime/src/FlowAPI.ts#L137)
- `controller.ts`: [`ControllerFlowAPI`](https://github.com/wix/yoshi/blob/master/packages/yoshi-flow-editor-runtime/src/FlowAPI.ts#L43)

### Sentry

_Available for `viewer.app.ts`, `editor.app.ts` and `controller`._

Open-source error tracking tool that helps developers monitor and fix crashes in real time. You can head to [the official documentation](https://docs.sentry.io/) for better understanding of Sentry's capabilities, API and configuration.

**All unhandled errors in `Widget`, `Settings`, `controller`, `viewer.app.ts`, `editor.app.ts` are being logged automatically**.

Each log event has different `environment` according to the context an error appeared:

| Error Context        | Logger Environment |
| -------------------- | ------------------ |
| **Widget** in viewer | Viewer             |
| **Widget** in editor | Editor             |
| **Settings**         | Editor             |
| **controller**       | Viewer:Worker      |
| **viewer.app**       | Viewer:Worker      |
| **editor.app**       | Editor:Worker      |

For example, if the error will appear in _controller.ts_

```ts
export default ({ flowAPI }) => {
  // This error is being logged by the Editor Flow
  throw new Error('Ooh, oops 🥴');

  try {
    // This error is being logged by user
    throw new Error('Ooh, oops 🥴);
  } catch (e) {
    flowAPI.reportError(e);
  }
};
```

It will be logged under `Viewer:Worker` environment.
![sentry-search](https://user-images.githubusercontent.com/11733036/84033045-f0eac280-a9a0-11ea-80dc-2770e60af399.png)
![sentry-error-row](https://user-images.githubusercontent.com/11733036/84033054-f3e5b300-a9a0-11ea-82f3-5c45f8667aed.png)

### `sentryMonitor`

_Available for `viewer.app.ts`, `editor.app.ts` and `controller`._

Provides a `Raven` or `Sentry Browser Client` instances according to the environment it's consumed. To prevent increasing a bundle, we're just taking the monitor passed by the platform. We create an instance which is specifically configured for your app and environment and pass it as a `flowAPI` property.

_controller.ts_

```ts
export default ({ flowAPI }) => {
  try {
    doSomethingDangerouseButNotVeryImportant();
  } catch (e) {
    flowAPI.sentryMonitor.captureMessage(
      "Something not important is not working."
    );
  }
};
```

### `reportError`

_Available for `viewer.app.ts`, `editor.app.ts` and `controller`._

It's a shorthand for `sentryMonitor.captureException`. Since this method is the main part of sentry interaction use-cases, we providing it as a separate method.

_controller.ts_

```ts
export default ({ flowAPI }) => {
  try {
    doSomethingDangerouseAndVeryImportant();
  } catch (e) {
    flowAPI.reportError(e); // the same as `flowAPI.sentryMonitor.captureException(e);`
  }
};
```

_editor.app.ts_

```ts
export const editorReady: EditorReadyFn = async (
  editorSDK, // platform
  appDefinitionId, // platform
  platformOptions, // platform
  flowAPI // editor flow
) => {
  if (platformOptions.firstInstall) {
    try {
      installApp();
    } catch (e) {
      flowAPI.reportError(e);
    }
  }
};
```

## Fedops

_Available for `editor.app.ts` and `controller`._

A javascript library to allow realtime monitoring, following the 'fedops' methodology.

After you initialize the app via `create-yoshi-app`, integrated it with lifecycle and pushed to the github, a [grafana](https://grafana.wixpress.com/login) dashboard will be created automatically for your app.

Boards for each component will be configured also.

**`appLoadStarted` and `appLoaded` events will be logged automatically by the Editor Flow.**
Moreover, both client-side rendering and server-side rendering logs for Widget are covered. So for most cases you don't need to handle fedops logs by yourself at all.


### `fedopsLogger`

Provides a `Fedops BaseLogger` initialized for current environment. Logs from `editor.app.ts` will be available for editor script board, `controller` - for component's board.

For more info relared to fedopsLogger API, please [follow this link](https://github.com/wix-private/fed-infra/tree/master/fedops/fedops-logger)

_controller.ts_

```ts
// appLoadStarted and appLoaded already covered by the editor flow 😌
export default ({ flowAPI }) => {
  const handleSubmitSomething = () => {
    flowAPI.fedopsLogger.interactionStarted(SUBMIT_SOMETHING_FEDOPS_INTERACTION);
    // process the action...
    flowAPI.fedopsLogger.interactionEnded(SUBMIT_SOMETHING_FEDOPS_INTERACTION);
  };

  return {
    pageReady() {
      setProps({
        handleSubmitSomething,
      });
    }
  };
};
```

## Translations
_Available for the `controller`, `viewer.app.ts` and `editor.app.ts`._
> Note, Since translations feature is common for Widget but not a controller, in most cases you won't need these calls.
For Widget you just need to use `translations` HOC. For more info, check [structure-api docs](../structure-api/application.md#locales).

To access translations object, use `flowAPI.translations`.

### `t`
Regular i18Next `t` helper already configured for your translations.
You can specify either one key as a String or multiple keys as an Array of Strings. The first one that resolves will be returned.

You can use it in `controller` or `initAppForPage` for viewer script:
*controller.ts*
```ts
export default async function({ flowAPI }) => {
  return {
    pageReady() {
      console.log(flowAPI.translations.t('app.widget.hello'));
    }
  };
}
```

Or in `editor.app.ts` for editor script.
*editor.app.ts*
```ts
export const editorReady: EditorReadyFn = async (
  sdk,
  appDefId,
  platformOptions,
  flowAPI,
) => {
  console.log(flowAPI.translations.t('app.editor.welcome'));
};
```

### `all`
Returns an object with all resolved translations.

*controller.ts*
```ts
export default async function({ flowAPI }) => {
  return {
    pageReady() {
      console.log(flowAPI.translations.all['app.widget.hello']);
    }
  };
}
```

### getSiteLanguage
_Available for the `controller`._

If multilingual is enabled, returns current language for it. If not, returns a site language. Will use a fallback language if nothing found.

_controller.ts_

```ts
export default async function({ flowAPI }) => {
  return {
    pageReady() {
      const language = flowAPI.getSiteLanguage();
      // ...
    }
  };
}
```

## isSSR

_Available for the `controller`._

A helper that returns `true` if current rendering environment is a server-side-rendering. Returns `false` in case of client-side-rendering.
[Read more about SSR and CRS](https://bo.wix.com/wix-docs/client/viewer-platform---ooi/about/get-started/guidelines#viewer-platform---ooi_about_get-started_guidelines_overview) for viewer platform.

## isMobile

_Available for the `controller`._

A helper that returns `true` if window's form factor is a mobile.

### getExperiments

_Available for `viewer.app.ts`, `editor.app.ts` and `controller`._

Returns a `Promise`, which will be resolved with `Experiments` instance for current app's scope.

To read more about experiments API, [check Experiments page](https://github.com/wix-private/fed-infra/tree/master/experiments/wix-experiments)

`getExperiments` won't trigger a fetch process for your experiments. To optimize performance, it's already triggered under the hood before method execution.
So technically `getExperiments` just returns a pending or resolved `Promise`.

_controller.ts_

```ts
export default async function({ flowAPI }) => {
  return {
    pageReady() {
      const experiments = await flowAPI.getExperiments();
      setProps({
        withNewButton: experiments.enabled('specs.my-scope.EnableNewButton'),
      });
    }
  };
}
```

Parallel loading example to improve your controller performance:

_controller.ts_

```ts
export default async function createController({ flowData }) => {
  return {
    pageReady() {
      const [experiments, someData] = await Promise.all([
        flowData.getExperiments(),
        getSomeData(),
      ]);
      setProps({
        withNewButton: experiments.enabled('specs.my-scope.EnableNewButton'),
        someData,
      });
    }
  };
}
```

> We are currently working on implementing more runtime helpers
