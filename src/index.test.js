const { get, post, put, del, patch, head, options } = require('microrouter');

const { createServer } = require('./index');

const routes = [
  get('/get', () => 'get'),
  post('/post', () => 'post'),
  put('/put', () => 'put'),
  del('/del', () => 'del'),
  patch('/patch', () => 'patch'),
  head('/head', () => 'head'),
  options('/options', () => 'options'),
];

let server;

beforeAll(async () => {
  server = await createServer(routes);
});

// Shutdown the server so test suite does not hang
afterAll(async () => {
  await server.close();
});

test('post should return expected value', async () => {
  const result = await server.get('/get');
  expect(result).toEqual('get');
});

test('post should return expected value', async () => {
  const result = await server.post('/post');
  expect(result).toEqual('post');
});

test('put should return expected value', async () => {
  const result = await server.put('/put');
  expect(result).toEqual('put');
});

test('del should return expected value', async () => {
  const result = await server.del('/del');
  expect(result).toEqual('del');
});

test('patch should return expected value', async () => {
  const result = await server.patch('/patch');
  expect(result).toEqual('patch');
});

test('head should return expected value', async () => {
  const result = await server.head('/head');
  expect(result).toEqual({
    connection: 'close',
    'content-length': '4',
    date: expect.anything(),
  });
});
