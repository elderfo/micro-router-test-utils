_**Micro Router Test Server-**_ A tiny test server for [microrouter](https://github.com/pedronauck/micro-router) and Zeit's [micro](https://github.com/zeit/micro)

[![Build Status](https://travis-ci.org/elderfo/microrouter-test-server.svg?branch=master)](https://travis-ci.org/elderfo/microrouter-test-server)

## Features
* **Async**. Designed for usage with `async` and `await`
* **Simple**. Test routes on a local live server.
* **Tiny**. < 60 lines of code.
* **Independent**. No reliance on specific testing frameworks.

## Usage

Install as dev dependency

```bash
yarn install microrouter-test-server -D
```

Write a test (with [Jest](https://facebook.github.io/jest/))

```js
// routes.test.js
const { get } = require('microrouter');
const { createServer } = require('microrouter-test-server');

const routes = [
  get('/route1', () => 'route1'), 
  get('/route2', () => 'route2')
];

let server;

beforeAll(async () => {
  server = await createServer(routes);
});

afterAll(async () => {
  await server.close();
});

test('GET route1 should return expected value', async () => {
  const result = await server.get('/route1');
  expect(result).toEqual('route1');
});

test('GET route2 should return expected value', async () => {
  const result = await server.get('/route2');
  expect(result).toEqual('route2');
});
```


## Api

### `async createServer(routes = Array<microrouter-route>)`
* `routes` - an array of routes returned by the route methods (`get`, `post`, `put`, `del`, `patch`, `head` and `options`) of `microrouter`
* returns `Promise<Object>` with methods:
  * `get(uri = String, options = Object)`
  * `post(uri = String, options = Object)`
  * `put(uri = String, options = Object)`
  * `del(uri = String, options = Object)`
  * `patch(uri = String, options = Object)`
  * `head(uri = String, options = Object)`
  * `uri` is the relative path to the route
  * `options` is the configuration object for [Request](https://github.com/request/request)
  * methods return a promise ala [request-promise](https://github.com/request/request-promise)

### `async close()`
* Closes the active connection to the test server.

## Contributing

1. [Fork](https://help.github.com/articles/fork-a-repo/) this repository to your GitHub account and then [clone](https://help.github.com/articles/cloning-a-repository/) it to your local system
2. Install dependencies using Yarn: `yarn install`
3. Make the necessary changes and ensure that the tests are passing using `yarn test`
4. Send a pull request
