---
id: testing
title: Testing
sidebar_label: Testing
---

Now that you have a few server functions and some client code that calls them, how would you test that?

# Server E2E Tests

Suppose we have the following server function:

```js
// greet.api.ts
import { method } from "yoshi-server";

export const greeting = method(function(name: string) {
  return {
    greet: `hello ${name}!`,
    name
  };
});
```

Testing it can been done by calling the function, just like we call it from the client.

For example:

```js
// server.e2e.ts
import HttpClient from "yoshi-server-client";
import { greet } from "../src/api/greeting.api";

const client = new HttpClient({
  baseUrl: "http://localhost:3000"
});

test("should reject on a JSON response", async () => {
  const response = await client.request(greet)("Yaniv");

  expect(response.greet).toBe("hello Yaniv");
});
```

# Component tests

> In component tests, we want to test a component in isolation, so we mock the server responses. In order to do that, we use the `yoshi-server-testing` library.

Start by installing it:

```
npm install --save-dev yoshi-server-testing
```

Let's use the following component as an example:

```js
// component.tsx
import React from "react";
import { HttpClient } from "yoshi-server-client";
import { greet } from "./api/greeting.api";

interface PropsType {
  httpClient: HttpClient;
}

export default class App extends React.Component<PropsType> {
  state = { text: "" };
  async componentDidMount() {
    const { httpClient } = this.props;
    // trigger an http request that will "run" `greet('world')` on the server.
    const result = await httpClient.request(greet)("world");
    this.setState({ text: result.greeting });
  }

  render() {
    return (
      <div>
        <h2 id="my-text">{this.state.text}</h2>
      </div>
    );
  }
}
```

Start by defining your mocks, which defines how the server function should respond, given specific arguments.

For example, for each call to `greet` method, with "Yaniv" as an argument, the response will be an object with "Hello Yaniv":

```js
const mocks = [
  {
    request: { method: greet, args: ["Yaniv"] },
    result: () => ({
      greeting: "Hello Yaniv"
    })
  }
];
```

Next, initialise `HttpClient` from `yoshi-server-testing`, with the mocks. It replaces `yoshi-server-client`'s `HttpClient` and will return results based on the mocks it was initialised with:

```js
const httpClientMock = new HttpClient(mocks);
```

You can now inject the `httpClientMock` to your component. In this example we will pass it as a prop. You can also use [`jest.mock`](https://jestjs.io/docs/en/mock-functions.html) instead.

```js
ReactDOM.render(<Component httpClient={httpClientMock} />, div);
```

---

Here is the full example:

```js
import React from "react";
import ReactDOM from "react-dom";
import HttpClient from "yoshi-server-testing";
import eventually from "wix-eventually";
import Component from "./component";
import { greet } from "./api/greeting.api";

const mocks = [
  {
    request: { method: greet, args: ["Yaniv"] },
    result: () => ({
      greeting: "Hello Yaniv"
    })
  }
];

const httpClientMock = new HttpClient(mocks);

it("should pass", async () => {
  const div = document.createElement("div");
  ReactDOM.render(<Component httpClient={httpClientMock} />, div);
  return eventually(() => {
    expect(div.innerHTML).toMatch("Hello Yaniv");
  });
});
```

# Browser E2E tests

Browser/e2e tests shouldn't know anything about Yoshi Server inner implementation. Test your application as you normally do, using [sled](https://github.com/wix-private/sled) or [jest-yoshi-preset](https://bo.wix.com/pages/yoshi/docs/jest-yoshi-preset).
