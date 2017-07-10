const micro = require('micro');
const {
  router,
  get,
  post,
  put,
  del,
  patch,
  head,
  options,
} = require('microrouter');
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
    options('/*', notfound),
  ]);

const createServerWithWildcards = routes =>
  listen(micro(router(...addWildcardRoutes(routes))));

const execute = (method, baseUrl, uri, options) =>
  request[method](`${baseUrl}${uri}`, options);

const createService = async routes => {
  const baseUrl = await createServerWithWildcards(routes);

  return {
    get: (uri, options) => execute('get', baseUrl, uri, options),
    post: (uri, options) => execute('post', baseUrl, uri, options),
    put: (uri, options) => execute('put', baseUrl, uri, options),
    del: (uri, options) => execute('del', baseUrl, uri, options),
    patch: (uri, options) => execute('patch', baseUrl, uri, options),
    head: (uri, options) => execute('head', baseUrl, uri, options),
    options: (uri, options) => execute('options', baseUrl, uri, options),
  };
};

module.exports = {
  createService,
};
