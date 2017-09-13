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

const execute = (method, baseUrl, uri, args) =>
  request[method === 'options' ? 'opts' : method](
    ...[`${baseUrl}${uri}`, ...args]
  );

const createServer = async routes => {
  const { baseUrl, server } = await createServerWithWildcards(routes);

  return {
    get: (uri, ...args) => execute('get', baseUrl, uri, args),
    post: (uri, ...args) => execute('post', baseUrl, uri, args),
    put: (uri, ...args) => execute('put', baseUrl, uri, args),
    del: (uri, ...args) => execute('del', baseUrl, uri, args),
    patch: (uri, ...args) => execute('patch', baseUrl, uri, args),
    head: (uri, ...args) => execute('head', baseUrl, uri, args),
    close: () => server.close(),
  };
};

module.exports = {
  createServer,
};
