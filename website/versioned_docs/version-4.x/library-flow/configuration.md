---
id: configuration
title: Library Flow Configuration
sidebar_label: Configuration
---

We try to limit confugration, but there are still different use-cases that requires us to provide the following:

## bundle

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

## target

string enum (`web`/`node`) default to `web`

When configured to `node` opts out from creating the `esm` directory.
