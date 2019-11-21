# Yoshi Editor Flow

> - Editor platform - A platform to write applications that runs on Wix Viewer and Editor.

## The Problems

### The boilerplate problem

Today, creating an app for the editor platform requires a lot of configuration and a big amount of boilerplate. While we can preconfgiure and add the needed boilerplate in a template (generated by `create-yoshi-app`) having this boilerplate has some disadventages:

- Longer learning curve (Developers have more code to read and understand)
- Developers move slower if their codebase is bigger and more complex.
- The same logic is being tested in many apps.
- Changing things across the board require changes in many projects.

### The API problem

The _Editor Platform_'s own APIs design to let you do anything, those APIs are hard to break due to the way we manage frontend runtime libraries/platforms in Wix. This makes the platform slower in reactivity to changes.

## The Proposal

We believe it's possible to create friendlier APIs and generate a compatiable code during build time. It will enable us to move fast, break the API by creating major versions that are all compatible to _the platform_.

Those APIs will be simpler and will move all possible boilerplate out of the developer's codebase.

---

For example, let's take an E-commerce application when we have main _Store_ widget that shows a list of products and a _Cart_ widget that shows the amount of added products. The user can drag and drop them around, and use them independently accros its site.

![shop](shop.jpeg "Shop")

### File structure

**Currently** we would create the following (or similar) file strucutre to create an app like this:

```
├── components
│   ├── cart
│   │   ├── Component.js
│   │   ├── Settings.js
│   │   └── controller.js
│   └── shop
│       ├── Settings.js
│       ├── Component.js
│       └── controller.js
├── entries
│   ├── cart.editor.js
│   ├── cart.settings.js
│   ├── cart.viewer.js
│   ├── shop.editor.js
│   ├── shop.settings.js
│   ├── shop.viewer.js
│   └── viewerScript.js
└── templates
    ├── cart.vm
    ├── cartSettings.vm
    ├── shop.vm
    └── shopSettings.vm
```

This is the **proposed** file structure:

```
├── initApp.js
└── components
    ├── cart
    │   ├── Component.js
    │   ├── Settings.js
    │   └── controller.js
    └── shop
        ├── Component.js
        ├── Settings.js
        └── controller.js
```

Understanding that every component is built out of a _Viewer-app_ + _Editor-app_ + _Settings-panel_ + _controller_ We can create A File System convention that represent it; We'll have a `components` directory, each directory represents a widget/page component and should have its product name (`shop`, `cart`). In each directory we'll have `Component` & `Settings` files, which will be bundled on their own and each `controller` will be a part of the viewer script worker bundle.

This will remove the configuration boilerplate of the entry points and will make the creation of a new bundle as easy as creating a new file. It will also reduce the mental load of understanding what webpack entries are, what bundles are created etc...

The fact that the framework knows the type of each file enable it to improve performance and provide features without a breaking API changes from the framework's side:

- **Dynamically loaded controllers** - We can create a worker bundle for each controller and load it only if it's needed.

- **Write a React _Component_ that works on the Editor and Viewer** - While the _Editor-app_ and the _Viewer-app_ diffrantiate in the way that the platform loads them, they looks the same and have a pretty similar feature set. Therefore you can write a single _Component_ and the framework will provide both Editor and A Viewer components to the platform.

- **Create a dedicated server bundle for the viewer component** - There are some bugs that occure because our client bundle runs in the server, for example, dynamic imports don't work. We can create a dedicated server bundle for each component.

- **No need for `html/vm/ejs` files** - In most cases, those template files are the same for everyone, load `React`, polyfills, your app's `js` and `css` assets, and set some variables on the `window` object. We can create those automatically.

- **Generated viewer script** - The viewer script contains the logic of matching between a component and its corresponding controller, this logic can done in build time using the convention presented above. There is also `initAppForPage`/`createControllers` functions, which will be available in the `initApp.js` file instead. There is app level logic and component level logic, and we want the files structure to express that.

### The Architecture

![architecture](architecture.jpeg "Architecture")

#### The Controller

Just like the platform's controller but accepts different arguments:

- `controllerConfig` - The config that supplied by the platform
- `frameworkData` - Data that supplied by the framework (`{experimentsPromise, translations, fedops ...}`)
- `appData` - The returned object from `initApp` function

```js
export default async ({ controllerConfig, frameworkData, appData }) => {
  console.log(appData.relevantForAllComps); // true

  const state = { foo: "bar" };
  const experiments = await frameworkData.experimentsPromise;

  function doSomething() {
    state.foo = "baz";
    controllerConfig.setProps(state);
  }

  return {
    pageReady: () => {
      controllerConfig.setProps({ ...state, doSomething });
    }
  };
};
```

#### The Component

Exposes a React component that accept props.
The props includes a `frameworkData` which includes all of the instances of `{experimentsPromise, translations}` etc... It will be padded by the relevant providers (For example `wixUiTpaProvider`)

```js
export default props => {
  const { foo, doSomething, frameworkData } = props;

  return (
    <div>
      <h1>{frameworkData.settings.title}</h1>
      <App
        doSomething={doSomething}
        foo={foo}
        experiments={frameworkData.experiments}
      />
    </div>
  );
};
```

#### The Settings

```js
...

export default () => {
  return (
    <div>
      <h1>Change title</h1>
      <input type="text" onChange={onChangeInput} />
    </div>
  );
};
```

#### The `initApp` file/function

A function that runs early as possible and enables our app to have decisions that are true for all of our components

> It's important to say that things that will be written here will run even if there is a single widget on the page. Also the controllers will wait for the returned promise to resolve. So mind the code you write here.

- `platformParams` - The config that supplied by the platform
- `controllerConfigs` - A list of all controller configs
- `frameworkData` - Data that supplied by the framework (`{experimentsPromise, translationsPromise, fedops ...}`)

```js
export default async ({ platformParams, controllerConfigs, frameworkData }) => {
  return { relevantForAllComps: true };
};
```