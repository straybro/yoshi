---
id: getting-started
title: Getting Started
sidebar_label: Getting Started
---

Welcome to Yoshi Server documentation!

Yoshi Server makes it easier to consume data from the server by adding an abstraction over client server communication, using conventions.

## Why we built Yoshi Server

#### Less boilerplate

With Yoshi Server, there's no need to setup a [node-platform](https://github.com/wix-platform/wix-node-platform) server.

#### Type safety for client-server communication

When using Typescript, client-server communication is fully typed.

#### Better error handling

Yoshi Server handles server errors and displays them on your browser.

#### Built in HMR support

HMR support out of the box, no need to setup anything.

#### Get updates easier

With Yoshi server, it will be easier to ship updates without breaking changes.

## Setup

We recommend creating a new Yoshi Server app using the [`create-yoshi-app`](https://bo.wix.com/pages/yoshi/docs/getting-started/create-app). It is available for both Fullstack and Business Manager apps.

```bash
npx create-yoshi-app my-app-name
```

## Manual setup

##### Prerequisits

- A fullstack app (both server and client are together, using the same `package.json` file).
- We currently support only projects using the `app-flow` ("projectType": "app" in your Yoshi configuration). If you do not use it, please migrate first (see https://bo.wix.com/pages/yoshi/docs/guides/app-flow for more details)

Install `yoshi-server` and `yoshi-server-client`:

```
npm install yoshi-server yoshi-server-client
```

Update `yoshi.config.js` of `package.json`'s `yoshi` section:

```diff
"yoshi": {
  "projectType": "app",
+  "yoshiServer": true,
...
}
```

Set your server to handle requests

Yoshi Server will handle server requests by convention (see [server functions](consuming-data-from-the-server#server-functions) and [route functions](exposing-route)). All we have to do is bootstrap it from our `index.js` file:

```js
require("yoshi-server/bootstrap");
```

Now you are ready to add your first Yoshi Server function.
