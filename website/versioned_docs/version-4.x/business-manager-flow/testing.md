---
id: testing
title: Testing
sidebar_label: Testing
---

The BM Flow supports component tests using Jest.

## Component Tests
The flow supports component tests (`src/**/*.spec.*`), using [`jest-yoshi-preset`](../jest-yoshi-preset.md):

```json
// package.json
{
  "jest": {
    "preset": "jest-yoshi-preset"
  }
}
```


Run `npx yoshi-bm test` to run component tests using Jest (`--watch` can also be used).

In local development, we read the filesystem and infer the project's structure accordingly.

In component tests, we provide 2 test providers, `PageTestProvider` for pages, and `ExportedComponentTestProvider` for exported components.

Each of them works out-of-the-box, and accepts the same set of optional props:

### `moduleParams` (optional)
Used to mock the `moduleParams` [provided by the flow](./runtime-api.md#moduleparams).
Defaults to a [minimal `moduleParams` object](https://github.com/wix-private/yoshi/blob/00fa01f76645364394487a9d2385eb096947e723/packages/yoshi-flow-bm-runtime/src/test/index.tsx#L32-L44).

#### Example
```typescript jsx
// src/pages/index.spec.tsx
import Index from './index'; 

const mockModuleParams: IBMModuleParams = { /* ... */ };

it('should work', () => {
  const { /* ... */ } = render(
    <PageTestProvider moduleParams={mockModuleParams}>
      <Index />
    </PageTestProvider>,
  );

  // ...
});
```

### `i18n` (optional)
Used to mock the `@wix/wix-i18n-config` instance used with [the flow's i18n integration](./runtime-api.md#i18n).
Defaults to an empty `i18next` instance with no translations loaded, set to `'en'`.

#### Example
```typescript jsx
// src/pages/index.spec.tsx
import Index from './index';
import { PageTestProvider, initI18n } from 'yoshi-flow-bm-runtime/test';
import messages from '../assets/locale/messages_de.json';

it('should translate', () => {
  const { getByTestId } = render(
    <PageTestProvider>
      <Index />
    </PageTestProvider>,
  );

  expect(getByTestId('app-title').textContent).toBe('app.title');
});
```

### `experiments` (optional)
Used to mock experiments conducted by the [built-in experiments integration](./runtime-api.md#experiments).
Defaults to `{}`.

#### Example
```typescript jsx
// src/pages/index.spec.tsx
import Index from './index';

const mockExperiments = { 
  'specs.scope.ShowButton': 'true'
};

it('should work when FT is on', () => {
  const { getByTestId } = render(
    <PageTestProvider experiments={mockExperiments}>
      <Index />
    </PageTestProvider>,
  );

  expect(getByTestId('button')).not.toBeNull();
});
```

### `fedops` (optional)
Used to mock the `appName` used in the Fedops logger initialized by the flow.
Defaults to `''`.

Read more 

#### Example
```typescript jsx
// src/pages/index.spec.tsx
import Index from './index';
import { 
  useFakeReporter, 
  reset, 
  isInteractionCompleted
} from '@wix/fedops-logger/testkit';

beforeAll(() => useFakeReporter());

beforeEach(() => reset());

it('should work', async () => {
  const { getByTestId } = render(
    <PageTestProvider>
      <Index />
    </PageTestProvider>,
  );
    
  fireEvent.click(getByTestId('button'));
  
  await wait(() => expect(isInteractionCompleted('interacting')).toBe(true));
});
```

### `bi` (optional)
Used to mock the schema logger used in the flow's [BI integration](./runtime-api.md#bi).

#### Example
```typescript jsx
// src/pages/index.spec.tsx
import Index from './index';
import biLoggerTestkit from '@wix/bi-logger-testkit';
import webBiLogger from '@wix/web-bi-logger';
import initSchemaLogger from '@wix/bi-logger-yoshi'; // replace with your own

const biLogger = initSchemaLogger(webBiLogger)({});

beforeEach(() => {
  biLoggerTestkit.reset();
})

it('should work', async () => {
  const { getByTestId } = render(
    <PageTestProvider bi={biLogger}>
      <Index />
    </PageTestProvider>,
  );

  fireEvent.click(getByTestId('button'));

  await wait(() => expect(biLoggerTestkit.events().length).not.toBe(0));
});
```

<!-- 
## Production E2Es
Coming Soon
-->
