---
id: runtime-api
title: Runtime API
sidebar_label: Runtime API
---

# `yoshi-flow-bm-runtime`

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
