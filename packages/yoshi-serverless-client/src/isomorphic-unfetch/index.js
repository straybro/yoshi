function r(m) {
  return (m && m.default) || m;
}

module.exports = global.fetch =
  global.fetch ||
  (typeof process === 'undefined'
    ? // eslint-disable-next-line import/no-extraneous-dependencies
      r(require('unfetch'))
    : function (url, opts) {
        // eslint-disable-next-line import/no-extraneous-dependencies
        return r(require('node-fetch'))(
          url.replace(/^\/\//g, 'https://'),
          opts,
        );
      });
