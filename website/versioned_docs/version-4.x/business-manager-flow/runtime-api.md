---
id: runtime-api
title: Runtime API
sidebar_label: Runtime API
---

# `yoshi-flow-bm-runtime`

## I18N

BM Flow provides integration with [`@wix/wix-i18n-config`](https://github.com/wix-private/fed-infra/tree/master/wix-i18n-config).
To opt-in, make sure to:
1. Configure a default `locale` using [`translations.defualt`](./configuration.md#translationsdefault) (usually `"en"`).
1. Make sure your translations files are in `src/assets/locale/messages_{LOCALE}.json`.

Once enabled, your pages & exported components will be wrapped with a preconfigured `<I18nextProvider />`.

> For more info, see [`@wix/wix-i18n-config`](https://github.com/wix-private/fed-infra/tree/master/wix-i18n-config).

### Usage

```typescript jsx
import { useTranslation } from 'yoshi-flow-bm-runtime';

export default () => {
  const [t] = useTranslation();

  return (
    <div>{t('some.translation.key')}</div>
  );
};
```

> **Note:** Suspense is enabled by default, use [`translations.suspense`](./configuration.md#translationssuspense) to disable.

## Experiments

To opt-into the built-in Experiments integration, make sure you pass a non-empty array of scopes in [`experimentsScopes`](./configuration.md#experimentsscopes).
Pages & exported components will be pre-wrapped with `<ExperimentsProvider />` configured to conduct the scopes provided.

### Usage

```typescript jsx
import { useExperiments } from "yoshi-flow-bm-runtime";

export default () => {
  const { experiments } = useExperiments();

  return (
    <div
      style={{ backgroundColor: experiments.enabled("spec") ? "red" : "blue" }}
    />
  );
};
```

## Sentry

Enable by providing the flow with your Sentry DSN using the [`sentry.DSN`](./configuration.md#sentrydsn) config option.
Your Sentry DSN string, it is auto-generated for you on project generation. 

When enabled, wraps your pages & exported-components with an initialized Sentry client.

> **Note:** When generating a project using `create-yoshi-app`, you get this configured for you!

### Usage

```typescript jsx
import { useSentry } from "yoshi-flow-bm-runtime";

export default () => {
  const sentryClient = useSentry();
  
  const clickHandler = () => {
    try {
      doSomething();
    } catch (error) {
      sentryClient.captureException(error);
    }
  }

  return (
    <div onClick={clickHandler} />
  );
};
```


## Fedops

Create a valid `fedops.json` file in order to opt-in to the built-in Fedops integration.

Simply by having a `fedops.json`, your page/exported components will be pre-configured with a Fedops instance available through Context:

```typescript jsx
import React, { useEffect } from 'react';
import { useFedops } from 'yoshi-flow-bm-runtime';

export default () => {
  const fedops = useFedops();

  useEffect(() => {
    fedops.appLoaded();
  }, []);

  return <div>...</div>
}
```

## App Load

When developing a Business-Manager app, we usually need to call `notifyViewStartLoading` & `notifyViewFinishedLoading` respectively (for BI purposes, and for BM's global loader).

When using the BM Flow, we call `notifyViewStartLoading` for you, along with also calling `fedops.appLoaded()` for you [if you have a `fedops.json` file](#fedops)!

We support the following 2 methods to signal the flow that your app has been loaded:

- Automatic

```typescript jsx
import { useAppLoaded } from 'yoshi-flow-bm-runtime';

export default () => {
  useAppLoaded({ auto: true });
  return <div>...</div>;
};
```

- Manual  

```typescript jsx
import { useAppLoaded } from 'yoshi-flow-bm-runtime';

export default () => {
  const appLoaded = useAppLoaded();
  
  useEffect(() => {
    fetchSomething().then(appLoaded);
  }, []);

  return <div>...</div>;
};
```

## BI

Enable by passing a valid bi-logger package name using the [`bi`](./configuration.md#bi-optional) config option.

When enabled, wraps your pages & components with an initialized logger instance.

### Usage

```typescript jsx
import { useBILogger } from 'yoshi-flow-bm-runtime';

export default () => {
  const biLogger = useBILogger();
  
  const clickHandler = () => {
    biLogger.someBIEvent({ /* ... */ });
  };
  
  return <button onClick={clickHandler}>Click Me!</button>;
};
```
 
