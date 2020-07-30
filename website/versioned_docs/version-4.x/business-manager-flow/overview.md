---
id: overview
title: Business-Manager Flow
sidebar_label: BM Flow
---

> 🧪 Experimental

## Overview

The Business-Manager is Wix's backoffice platform.
For more information on the platform, see the [official docs](https://github.com/wix-private/business-manager/).

Yoshi's Business-Manager Flow eases the development process of Business-Manager applications by reducing boilerplate, automating common tasks and solving infrastructure and runtime problems in a single place.

Inspired by [Next.js](https://nextjs.org/#file-system-routing) It requires the developer to create a specific file structure and can statically analyze it to provide features like file system routing, auto generation of module config and more.

## Concepts

### Module Bundle

BM Flow auto-generates a module bundle file for you, which will automatically register the necessary pages & public API for your application at runtime.

### Pages

Adding Page Components to your application is as simple as creating a new file somewhere in the special `src/pages` directory:

```typescript jsx
// src/pages/index.tsx

export default () => {
  useEffect(() => {
    notifyViewFinishedLoading("<YOUR_PAGE_COMPONENT_NAME>");
  }, []);

  return <Page>...</Page>;
};
```

#### Route

The pages' route will be determined by the page file's path relative to the root `src/pages` directory, prefixed with the [`routeNamespace` config option](./configuration.md#routenamespace).
For example:

| Path                    | Route      |
| ----------------------- | ---------- |
| `src/pages/index.tsx`   | `/`        |
| `src/pages/foo.tsx`     | `/foo`     |
| `src/pages/foo/bar.tsx` | `/foo/bar` |

### Exported Components

Similar to [pages](#pages), exposing components from your Business-Manager module is done by creating a new file in the special `src/exported-components` directory:

```typescript jsx
// src/exported-components/shared-modal.tsx

export default () => {
  return <Modal>...</Modal>;
};
```

### Methods

Exposing methods from your Business-Manager module is done by creating files in the special `src/methods` directory:

```typescript
// src/methods/some-method.ts
import { MethodFn } from "yoshi-flow-bm-runtime";

const method: MethodFn = ({ module, moduleParams }, ...args) => {
  // Do plenty of things
};

export default method;
```

## Initial Setup

Run `EXPERIMENTAL_FLOW_BM=true npx create-yoshi-app` & choose template `flow-bm`.

This will bootstrap a new Business-Manager application, along with a single (root) page.

## Commands

### Development

Run `npx yoshi-bm start` to start your Business-Manager application.
This serves your application's statics and opens up production Business-Manager, pre-configured with the needed overrides.

> To override this, pass `--url`, for example: `npx yoshi-bm start --url http://localhost:3000`.

### Deployment

Run `npx yoshi-bm build` to build your Business-Manager application.
This builds your module bundle and generates a working `module_MODULE_ID.json` file in your `target` directory, for your [integration with Business-Manager](https://github.com/wix-private/business-manager/blob/master/business-manager-web/docs/module-config-file.md).

### Testing

Run `npx yoshi-bm test` to run your tests with the configured test runner (Jest by default). Pass `--watch` to start it in watch mode.
