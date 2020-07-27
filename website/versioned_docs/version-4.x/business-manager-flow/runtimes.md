---
id: runtime-API
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
