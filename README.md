_**Micro Router Test Server-**_ A tiny test server for [microrouter](https://github.com/pedronauck/micro-router) and Zeit's [micro](https://github.com/zeit/micro)

[![Build Status](https://travis-ci.org/elderfo/microrouter-test-server.svg?branch=master)](https://travis-ci.org/elderfo/microrouter-test-server)
[![codecov](https://codecov.io/gh/elderfo/microrouter-test-server/branch/master/graph/badge.svg)](https://codecov.io/gh/elderfo/microrouter-test-server)

## Features
* **Async**. Designed for usage with `async` and `await`
* **Simple**. Test routes on a local live server.
* **Tiny**. < 60 lines of code.
* **Independent**. No reliance on specific testing frameworks.

## Pre-requisites

Node 7+

## Usage

Install as dev dependency

```bash
yarn install microrouter-test-server -D
```

Write a test (with [Jest](https://facebook.github.io/jest/))

```js
// routes.test.js
const { get, post, put } = require('microrouter');
const { json, send } = require('micro');
const { createServer } = require('microrouter-test-server');

const routes = [
  get('/route1', () => 'route1'),
  post('/route2', req => json(req)),
  put('/route3', (req, res) => send(res, 400, 'route3')),
];

let server;

beforeAll(async () => {
  server = await createServer(routes);
});

afterAll(async () => {
  await server.close();
});

test('GET of route1 should return expected value', async () => {
  const result = await server.get('/route1');
  expect(result).toEqual('route1');
});

test('POST to route2 should return the payload', async () => {
  const payload = { abc: 123 };
  const result = await server.post('/route2', {
    json: true,
    body: payload,
  });
  expect(result).toEqual(payload);
});

test('PUT to route3 should reject with non-2xx status', async () => {
  await expect(server.put('/route3')).rejects.toHaveProperty('statusCode', 400);
});
```

## API

### `async createServer(routes = Array<microrouter-route>)`
* `routes` - an array of routes returned by the route methods (`get`, `post`, `put`, `del`, `patch`, `head` and `options`) of `microrouter`
* returns `Promise<Object>` with methods:
  * `get(uri: String, options: RequestOptions)`
  * `post(uri: String, options: RequestOptions)`
  * `put(uri: String, options: RequestOptions)`
  * `del(uri: String, options: RequestOptions)`
  * `patch(uri: String, options: RequestOptions)`
  * `head(uri: String, options: RequestOptions)`
    * `uri` is the relative path to the route
    * `options` is the configuration object for [`request`](https://github.com/request/request#requestoptions-callback)/[`request-promise`](https://github.com/request/request#requestoptions-callback)
    * methods return a promise ala [request-promise](https://github.com/request/request-promise)

### `async close()`
* Closes the active connection to the test server.

## Examples

### POST a payload

```js
const result = await server.post('/route2', {
  json: true,
  body: { my: 'payload' },
});
```

### Handle non-2xx responses

`microrouter-test-server` uses [`request-promise`](https://github.com/request/request#requestoptions-callback) to handle requests. By default, this library rejects on any status other than a 2xx. Here's a few ways to handle it:

#### .catch(StatusCodeError)

```js
server.post('/route')
  .then(body => {
    // 2xx status 
  })
  .catch(err => {
    console.log(err.statusCode);
  })
```

#### Get the full response object

```js
const response = await server.post('/route', {
  simple: false,
  resolveWithFullResponse: true,
});

if (response.statusCode == 200) {
  doSomething(response);
} else {
  handleFailure();
}
```
[More info](https://github.com/request/request-promise#fulfilled-promises-and-the-resolvewithfullresponse-option)

## Contributing

1. [Fork](https://help.github.com/articles/fork-a-repo/) this repository to your GitHub account and then [clone](https://help.github.com/articles/cloning-a-repository/) it to your local system
2. Install dependencies using Yarn: `yarn install`
3. Make the necessary changes and ensure that the tests are passing using `yarn test`
4. Send a pull request
