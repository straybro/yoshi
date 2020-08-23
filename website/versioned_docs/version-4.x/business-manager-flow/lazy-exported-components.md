---
id: lazy-exported-components
title: Lazy Exported Components
sidebar_label: Lazy Exported Components
---

`business-manager-flow` wraps exported components with `React.Suspense` and `React.lazy`. 

In many cases, it is encouraged to display a fallback UI, while the dynamically imported module is being fetched.
Exported-components, unlike pages, are not consumed by the Business-Manager platform. Thus, no fallback UI is displayed, and it is the responsibility of the hosting component to take care of that.

Hosting components can pass a `fallback` prop to the component they consume from `ModuleRegistry.component`.

For example:

```typescript jsx
import React from 'react';
import {Loader} from 'wix-style-react';

export function MyHostingComponent() {
  const [MyConsumedComponent] = React.useState(() => ModuleRegistry.component('COMPONENT_ID'));

  return (
    <MyConsumedComponent
      fallback={
        <div className="loader">
          <Loader />
        </div>
      }
    />
  );
}
```
 
