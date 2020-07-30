---
id: lifecycle-hooks
title: Lifecycle Hooks
sidebar_label: Lifecycle Hooks
---

## Module Lifecycle

### `init()`
Used to run code in the `init` lifecycle hook. More info [here](https://github.com/wix-private/business-manager/blob/master/business-manager-api/docs/business-manager-module.md#init).

#### Usage
Create a file `src/module.{ts,js}`:

```typescript
import { ModuleInitFn } from "yoshi-flow-bm-runtime";

export const init: ModuleInitFn = ({ module, moduleParams }) => {
  // ...
};
```

### `config()`
Used to run code in the `config` lifecycle hook. More info [here](https://github.com/wix-private/business-manager/blob/master/business-manager-api/docs/business-manager-module.md#config).


#### Usage
Create a file `src/module.{ts,js}`:

```typescript
import { ModuleConfigFn } from "yoshi-flow-bm-runtime";

export const config: ModuleConfigFn = (
  { module, moduleParams },
  sourceModuleId,
  configPayload
) => {
  // ...
};
```

## Page / Exported Component Lifecycle

### `files`
Used to load additional scripts during parallel to component load.

#### Usage
Create a file ending with `.module.ts` (if it doesn't exist) next to your existing page or exported component.

```typescript
// src/pages/foo.module.ts
import { FilesFn } from 'yoshi-flow-bm-runtime';

export const files: FilesFn = ({ moduleParams }) => [
  `https://.../${moduleParams.config.topology.someArtifactsTopology}/...`
]
```

### `resolve`
Used to run async operations  

#### Usage
Create a file ending with `.module.ts` (if it doesn't exist) next to your existing page or exported component.

```typescript
// src/exported-components/shared-modal.module.tsx
import { ResolveFn } from 'yoshi-flow-bm-runtime';

// Will be injected to configured component
interface ResolvedProps {
  foo: string;
}

export const resolve: ResolveFn<ResolvedProps> = async ({ moduleParams }) => ({
  foo: await fetchBar(moduleParams),
});
```
