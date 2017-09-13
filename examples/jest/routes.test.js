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

test('PUT to route3 should be able to get a full response', async () => {
  const response = await server.put('/route3', {
    simple: false,
    resolveWithFullResponse: true,
  });

  expect(response.statusCode).toBe(400);
});

test('PUT to route3 should be able get body and ignore non 2xx status', async () => {
  const body = await server.put('/route3', {
    simple: false,
  });

  expect(body).toBe('route3');
});
