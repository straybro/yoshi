---
id: library-flow
title: Library Flow
sidebar_label: Library Flow
---

A zero configuraiton toolkit to create modern TypeScript libraries @ Wix.

> See [App Flow](https://bo.wix.com/pages/yoshi/docs/guides/app-flow#__docusaurus) for developing client applications

![Editor-flow-example](https://user-images.githubusercontent.com/11733036/77347439-85e60400-6d40-11ea-8270-ae6ac2714a55.gif)

### What is a library?

> In the scope of frontend development

A library is a chunk of code that you want to reuse between client applications, servers and other libraries. This toolkit focuses on **client libararies**, or libraries that will be consumed in JavaScript client applications.

## Features

- 100% TypeScript
- Bundle with webpack (optional)
- Support tree-shaking and dynamic imports
- Fast Slick watch mode
- Optimized, fast build process
- Zero configuration needed

## Installation

```sh
EXPERIMENTAL_FLOW_LIBRARY=true npx create-yoshi-app <my-library>
```

Choose `flow-library` & `TypeScript`.

In case you want to ship a `.css` bundle with your library, also run `npm install -D yoshi-style-dependencies`.

## Usage

- `yoshi-library start` - Start a development server which rebuilds on any change
- `yoshi-library test` - Run the tests using `jest`
- `yoshi-library lint` - Run `eslint`
- `yoshi-library build` - Prepare the library for production deployment/publish

## Configuration

We try to limit confugration, but there are still different use-cases that requires us to provide the following:

### bundle

Adding a umd bundle which will be created on `dist/statics/<packageJsonName>.umd.js`

```js
{
  "yoshiFlowLibrary": {
    "bundle": true
  }
}
```

### bundle.library

Changing how this library will be exposed (on the `window` object for example)

> This value corresponds to webpack's [library option](https://webpack.js.org/configuration/output/#outputlibrary)

> The variable MyLibrary will be bound with the return value of your entry file, if the resulting output is included as a script tag in an HTML page. In this case on `window.MyLibrary`

Defaults to your project name in `package.json`

```js
{
  "yoshiFlowLibrary": {
    "bundle": {
      "library": "MyLibrary"
    }
  }
}
```

### bundle.externals

The externals configuration option provides a way of excluding dependencies from the output bundles. Instead, the created bundle relies on that dependency to be present in the consumer's (any end-user application) environment. This feature is typically most useful to library developers, however there are a variety of applications for it.

> Corresponds with webpack's [externals options](https://webpack.js.org/configuration/externals/)

```js
{
  "yoshiFlowLibrary": {
    "bundle": {
      "externals": {
        "react": "React",
        "react-dom": "ReactDOM"
      }
    }
  }
}
```

### bundle.entry

Adding another entry will create another bundle in the `dist/statics` directory.

Defaults to `index.ts`

> Corresponds with webpack's [entry option](https://webpack.js.org/configuration/entry-context/#entry)

> NOTE: All values here are relative to the `src` directory, the following example will take `src/anotherEntry.ts`

```js
{
  "yoshiFlowLibrary": {
    "bundle": {
      "entry": "anotherEntry.ts"
    }
  }
}
```

### bundle.port

The port which will be used by [webpack-dev-server](https://github.com/webpack/webpack-dev-server).

Defaults to `3300`

```js
{
  "yoshiFlowLibrary": {
    "bundle": {
      "port": 3333
    }
  }
}
```

### bundle.https

Whether [webpack-dev-server](https://github.com/webpack/webpack-dev-server) will run on `https` or `http`.

Defaults to `false` (`http`)

```js
{
  "yoshiFlowLibrary": {
    "bundle": {
      "port": 3333
    }
  }
}
```

## FAQ

### What `build` command produces?

```none
─── dist
    ├── cjs (commonjs files)
    ├── esm (esmodules files)
    ├── statics (umd bundle) - [optional]
    └── types (d.ts files)
```

> After installing the library through `npm` this is how its output is being routed using the following fields in its `package.json` file

```
{
  "main": "dist/cjs/index.js", // for NodeJS, used in component tests
  "module": "dist/es/index.js", // for webpack, because of dynamic import and Tree-Shaking
  "types": "dist/types/index.d.ts", // for the IDE and other TypeScript projects
  ...
}
```

The bundle (`dist/statics` directory) is deployed to the cdn (`parastorage`) and should be used from there

### Why does this supports only TypeScript?

In Wix more than 80% of the frontend code is written with `TypeScript`. When creating a reusable library, having types is important for IDE features such a auto-completions and auto-import to work. It also helps preventing mistakes on other `TypeScript` projects that uses the library. It's also important to remember that there is a trade-off regarding maintaining support in multiple different use-cases and this trade-off means that when doing that, we won't be able to invest time deliver more features or make this flow more optimize. If you've only worked with JavaScript so far, I suggest you to let it an opportunity and see if it works for you.

### How can I use a library create by this Flow?

There are 2 main ways to consume a libaray:

1. **from `npm`** - import the library from the application's code and bundle it (Using `yoshi`'s app flow is guaranteed to work)
2. **from the `cdn`** - Consume the already bundled library using a `<script src="library.umd.js">` tag. (You'll need to specify it in the [`externals`](https://bo.wix.com/pages/yoshi/docs/api/configuration#externals) configuration option)

Using the second method also enables the version of the library to be controlled by the library author, so things like `GA` of the library would be able to get to production without the application code needs to be modified.

> Here are some pros and cons

|                                  | from `npm` | from the `cdn` |
| -------------------------------- | ---------- | -------------- |
| Consume from a GA\*              | X          | V              |
| Tree-shake unused code           | V          | X              |
| Affects app's build time         | V          | X              |
| Perform dynamic import           | V          | V              |
| Share dependencies with your app | V          | X              |
