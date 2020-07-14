---
id: environment-variables
title: Environment Variables
sidebar_label: Environment Variables
---

## PROGRESS_BAR

When you want to disable the progress bar you can add `PROGRESS_BAR=false` before you run command. E.g.

```
PROGRESS_BAR=false yoshi build
```

```
PROGRESS_BAR=false yoshi start
```

## DEBUG

If you want to debug things during start without it cleaning the screen every time this mode is for you. Using `DEBUG` will diable the progress bar as well.

```
DEBUG=true yoshi start
```

Read more about [debugging yoshi](./debugging#debug-yoshis-code)

## PROFILE

Launches the build profiler that shows how much time was invested in a task of the build. For example, if you want to know how long does it takes to process `css` files or if `babel-loader` was the bottle-neck of the build.

In the end of the compilation you'll be presented with a table that shows that information.

```
PROFILE=true yoshi build
```

```
PROFILE=true yoshi start
```

### YOSHI_PUBLIC_PATH

Every app bundle can be potentially divided into multiple files, which are loaded asynchrnously. The `YOSHI_PUBLIC_PATH` parameter lets you configure where these files can be found in production. By default, most Wix frontend applications will work just fine without setting this environment variable, as most of them are served from `static.parastorage.com`. You should use it only if you're serving your files from a non-standard location in production.

```
YOSHI_PUBLIC_PATH="https://special.wix.com/files/"
```
