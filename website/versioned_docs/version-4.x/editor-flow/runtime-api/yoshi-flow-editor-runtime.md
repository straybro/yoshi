---
id: yoshi-flow-editor-runtime
title: yoshi-flow-editor-runtime
sidebar_label: yoshi-flow-editor-runtime
---

Package that exports various Higher Order Components (HOCs) and methods to reduce boilerplate on client's side and organize the app structure in a better way.

## `WixSDK`

WixSDK is a HOC that loads [IStaticWix](https://github.com/wix-private/fed-infra/blob/master/js-sdk-wrapper/src/types.ts) object.

It renders a `children` function with `sdk` argument:

`sdk`: `{ Wix: IWixStatic | null }`

```tsx
import { WixSDK } from "yoshi-flow-editor-runtime";

export default () => (
  <WixSDK>{sdk =>
    <SomeComp Wix={sdk.Wix} /> // IStaticWix | null
  }</WixSDK>
);
```

`sdk.Wix` will be `null` if `WixSDK` is being used in Widget part and rendered in Viewer mode, so make sure you are checking if it's not `null` to use it.

#### Props

**isEditor** - should be passed for Settings part. It triggers a `WixSDK`, so it will use strict types for `sdk.Wix` and it won't be _optional_.

_Settings.ts_

```tsx
import { WixSDK } from "yoshi-flow-editor-runtime";

export default () => (
  <WixSDK isEditor>{sdk =>
    <SomeComp Wix={sdk.Wix} /> // IStaticWix
  }</WixSDK>
);
```

## `BILogger`
Renders a `children` function with `biLogger` relevant for current environment.

You can configure 2 different kinds of BI logger according to user's roles: `owner` and `visitor`:

- **Owner** will be available in `Settings` panel.
- **Visitor** will be available in `Widget`, `controller` and `initAppForPage` in `viewer.app.ts`.

After you generate a project, a demo BI logger (`bi-logger-editor-flow-template`) will be added to `.application.json` configuration.
It's a show case and should be finally repaced in `.application.json` and `package.json` with user's BI logger schema. 
To configure own BI logger, please read the [fed-handbook BI section](https://github.com/wix-private/fed-handbook/blob/master/BI.md#overview).

**Settings.tsx**
```tsx
// Somewhere deep in the component tree
const ColorPicker = () => (
  <BILogger owner>
    {biLogger => (
      <ColorPickerColorSpace
        onChange={(color) => {
          logger.logColorChange({ color });
        }}
      />
    )}
  </BILogger>
);
```

**controller.ts**
```tsx
const createController = async ({ flowAPI, controllerConfig }) => {
  const { setProps } = controllerConfig;

  onSomeAction = async () => {
    // Do something...
    await flowAPI.biLogger?.somethingWasDone({});
  };

  return {
    async pageReady() {
      setProps({
        onSomeAction,
      });
      await flowAPI.biLogger?.templateWidgetLoaded({});
    },
  }
}
```

### `BILoggerDefaults`
To update defaults for each event being called from the `BILogger` render prop, you can update the context by wrapping your root component, 
which contain consumers.

```Settings.tsx
import { BILogger, BILoggerDefaults } from 'yoshi-flow-editor-runtime'

<BILoggerDefaults defaults={{ someData: 'hey' }}>
  <div>
  // Somwhere deeper...
  <BILogger owner>
    {biLogger => (
      <ColorPickerColorSpace
        onChange={() => {
          logger.logColorChange({ color }); // Event will include `someData` field.
        }}
      />
    )}
  </BILogger>
  </div>
</BILoggerDefaults>
```

> To update defaults in controller, you can just call `flowAPI.biLogger.util.updateDefaults(newDefaults)`.

### Testing
For unit testing components that contain a BI logger you should wrap it in `BILoggerProvider` HOC imported from `yoshi-flow-editor-runtime/test`.

It accepts `logger` property which can be a plain object with bi methods you want to mock.

_Widget.spec.tsx_
```tsx
import { BILoggerProvider } from 'yoshi-flow-editor-runtime/test';

it('should send a BI event on button click', async () => {
  const buttonClickedBIEvent = jest.fn();
  const { getByTestId } = render(
    <BILoggerProvider logger={{ onButtonClicked: buttonClickedBIEvent }}>
      <Widget />
    </BILoggerProvider>
  );
  expect(buttonClickedBIEvent).toHaveBeenCalled();
});
```

## `translate`
It's a HOC from `react-i18next` that allows using translations for `Widget` and `Settings` components.

All translations should be located under `assets/locales/messages_:LANGUAGE.json` by default.
If you want to change the prefix of translations file name, set `prefix` field to `.application.json`'s translations object.

⚠️ You should not use `I18NextProvider`. Editor flow already provides needed context based on website's language.

Just wrapping any component will give an access to app's translations via `t` property:

_Widget.tsx_
```tsx
import { translate, InjectedTranslateProps } from 'yoshi-flow-editor-runtime';

export default translate()(({ t }: InjectedTranslateProps) => {
  return <h1 data-hook="app-title">{t('app.widget.welcome')}</h1>;
});
```

### Testing
For unit testing components that use `translation` HOC, you can use `I18NextProvider` from `yoshi-flow-editor-runtime/test`.

It will configue 18n mock and won't send any additional network requests:

_Widget.spec.tsx_
```tsx
import { I18nextProvider } from 'yoshi-flow-editor-runtime/test';

it('should render a title correctly', async () => {
  const { getByTestId } = render(
    <I18nextProvider>
      <Widget />
    </I18nextProvider>
  );

  expect(getByTestId('app-title').textContent).toBe('app.widget.welcome');
});
```

## `withExperiments`
Connects a React component to underlying experiments.
A higher-order React component class that builds props from the experiments state and passes them to the wrapped component for Widget and Settings.

⚠️ You should not use `ExperimentsProvider`. Editor flow already provides needed context based on your experiments configuration under `.application.json`.

For more info about `withExperiments` HOC, please read [official README](https://github.com/wix-private/fed-infra/tree/master/experiments/wix-experiments-react#withexperimentscomponent).

_Widget.tsx_
```tsx
import { withExperiments } from 'yoshi-flow-editor-runtime';

export default withExperiments<WidgetProps>(({ experiments }) => {
  return <h1 data-hook="app-title">{experiments.isEnabled('specs.scope.ShowEmoji') ? '👋' : 'Hey!'}</h1>;
});
```

### Testing
Editor flow provides easy way to mock experiments you want to test via `ExperimentsProvider` from `yoshi-flow-editor-runtime/test`.

Just pass experiments needed to be mocked via `experiments` property:

```tsx
import { ExperimentsProvider } from 'yoshi-flow-editor-runtime/test';

it('should render a title correctly', async () => {
  const { getByTestId } = render(
    <ExperimentsProvider experiments={{ 'specs.scope.ShowEmoji': true }}>
      <Widget />
    </ExperimentsProvider>
  );

  expect(getByTestId('app-title').textContent).toBe('👋');
})
```

