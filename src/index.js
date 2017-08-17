const micro = require('micro');
const { router, get, post, put, del, patch, head } = require('microrouter');
const request = require('request-promise');
const listen = require('test-listen');

const notfound = (req, res) => micro.send(res, 404, 'Not found route');

const addWildcardRoutes = routes =>
  routes.concat([
    get('/*', notfound),
    post('/*', notfound),
    put('/*', notfound),
    del('/*', notfound),
    patch('/*', notfound),
    head('/*', notfound),
  ]);

const createServerWithWildcards = async routes => {
  const server = micro(router(...addWildcardRoutes(routes)));
  const baseUrl = await listen(server);

  return {
    server,
    baseUrl,
  };
};

const execute = (method, baseUrl, uri, opts) =>
  request[method === 'options' ? 'opts' : method](`${baseUrl}${uri}`, opts);

const createServer = async routes => {
  const { baseUrl, server } = await createServerWithWildcards(routes);

  return {
    get: (uri, opts) => execute('get', baseUrl, uri, opts),
    post: (uri, opts) => execute('post', baseUrl, uri, opts),
    put: (uri, opts) => execute('put', baseUrl, uri, opts),
    del: (uri, opts) => execute('del', baseUrl, uri, opts),
    patch: (uri, opts) => execute('patch', baseUrl, uri, opts),
    head: (uri, opts) => execute('head', baseUrl, uri, opts),
    close: () => server.close(),
  };
};

module.exports = {
  createServer,
};
