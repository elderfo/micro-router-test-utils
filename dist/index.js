function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

const micro = require('micro');
const {
  router,
  get,
  post,
  put,
  del,
  patch,
  head,
  options
} = require('microrouter');
const request = require('request-promise');
const listen = require('test-listen');

const notfound = (req, res) => micro.send(res, 404, 'Not found route');

const addWildcardRoutes = routes => routes.concat([get('/*', notfound), post('/*', notfound), put('/*', notfound), del('/*', notfound), patch('/*', notfound), head('/*', notfound), options('/*', notfound)]);

const createServerWithWildcards = routes => listen(micro(router(...addWildcardRoutes(routes))));

const execute = (method, baseUrl, uri, options) => request[method](`${baseUrl}${uri}`, options);

const createService = (() => {
  var _ref = _asyncToGenerator(function* (routes) {
    const baseUrl = yield createServerWithWildcards(routes);

    return {
      get: function (uri, options) {
        return execute('get', baseUrl, uri, options);
      },
      post: function (uri, options) {
        return execute('post', baseUrl, uri, options);
      },
      put: function (uri, options) {
        return execute('put', baseUrl, uri, options);
      },
      del: function (uri, options) {
        return execute('del', baseUrl, uri, options);
      },
      patch: function (uri, options) {
        return execute('patch', baseUrl, uri, options);
      },
      head: function (uri, options) {
        return execute('head', baseUrl, uri, options);
      },
      options: function (uri, options) {
        return execute('options', baseUrl, uri, options);
      }
    };
  });

  return function createService(_x) {
    return _ref.apply(this, arguments);
  };
})();

module.exports = {
  createService
};