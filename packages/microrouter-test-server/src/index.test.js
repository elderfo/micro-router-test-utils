const { get, post, put, del, patch, head, options } = require('microrouter');
const { json, send } = require('micro');
const faker = require('faker');

const { createServer } = require('./index');

const routes = [
  get('/get', () => 'get'),
  post('/post', async req => json(req)),
  put('/put', async req => json(req)),
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

describe('get', () => {
  it('should return expected value', async () => {
    const result = await server.get('/get');
    expect(result).toEqual('get');
  });

  it('should reject with a non 200 status code', async () => {
    const tmpServer = await createServer([
      get('/get', (req, res) => send(res, 400)),
    ]);

    try {
      await expect(tmpServer.get('/get')).rejects.toHaveProperty(
        'statusCode',
        400
      );
    } finally {
      tmpServer.close();
    }
  });
});

describe('post', () => {
  it('should return expected value', async () => {
    const payload = { abc: faker.random.uuid() };
    const result = await server.post('/post', {
      json: true,
      body: payload,
    });
    expect(result).toEqual(payload);
  });

  it('should reject with a non 200 status code', async () => {
    const tmpServer = await createServer([
      post('/post', (req, res) => send(res, 400)),
    ]);

    try {
      await expect(tmpServer.post('/post')).rejects.toHaveProperty(
        'statusCode',
        400
      );
    } finally {
      tmpServer.close();
    }
  });
});

describe('put', () => {
  test('should return expected value', async () => {
    const payload = { abc: faker.random.uuid() };
    const result = await server.put('/put', {
      json: true,
      body: payload,
    });
    expect(result).toEqual(payload);
  });

  it('should reject with a non 200 status code', async () => {
    const tmpServer = await createServer([
      put('/put', (req, res) => send(res, 400)),
    ]);

    try {
      await expect(tmpServer.put('/put')).rejects.toHaveProperty(
        'statusCode',
        400
      );
    } finally {
      tmpServer.close();
    }
  });
});

describe('del', () => {
  test('should return expected value', async () => {
    const result = await server.del('/del');
    expect(result).toEqual('del');
  });

  it('should reject with a non 200 status code', async () => {
    const tmpServer = await createServer([
      del('/del', (req, res) => send(res, 400)),
    ]);

    try {
      await expect(tmpServer.del('/del')).rejects.toHaveProperty(
        'statusCode',
        400
      );
    } finally {
      tmpServer.close();
    }
  });
});

describe('patch', () => {
  test('should return expected value', async () => {
    const result = await server.patch('/patch');
    expect(result).toEqual('patch');
  });

  it('should reject with a non 200 status code', async () => {
    const tmpServer = await createServer([
      patch('/patch', (req, res) => send(res, 400)),
    ]);

    try {
      await expect(tmpServer.patch('/patch')).rejects.toHaveProperty(
        'statusCode',
        400
      );
    } finally {
      tmpServer.close();
    }
  });
});

describe('head', () => {
  test('should return expected value', async () => {
    const result = await server.head('/head');
    expect(result).toEqual({
      connection: 'close',
      'content-length': '4',
      date: expect.anything(),
    });
  });

  it('should reject with a non 200 status code', async () => {
    const tmpServer = await createServer([
      head('/head', (req, res) => send(res, 400)),
    ]);

    try {
      await expect(tmpServer.head('/head')).rejects.toHaveProperty(
        'statusCode',
        400
      );
    } finally {
      tmpServer.close();
    }
  });
});
