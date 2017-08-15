var _ = require('underscore');
var envHelpers = require('./env-helpers');
var fs = require('fs');

var viewCache = {};
var noOp = function() {
  return false;
};

var keys = [
  'login',
  'logout',
  'home',
  'admin',
  'base'
];

_.templateSettings = {
  interpolate: /\{\{(.+?)\}\}/g
};

_.each(keys, function(v, i) {
  var html = fs.readFileSync('views/' + v + '.html', {
    encoding: 'utf8'
  });

  viewCache[v] = _.template(html);
});

module.exports = {
  // ----------
  sendHTML: function(req, res, name, options) {
    options = options || {};

    if (options.forceProtocol) {
      if (envHelpers.isProd && req.protocol !== options.forceProtocol) {
        var baseUrl = (options.forceProtocol === 'https' ? envHelpers.baseSecureUrl : envHelpers.baseUrl);
        res.redirect(301, baseUrl + req.url);
        return;
      }
    }

    res.setHeader('Content-Type', 'text/html');

    var username;
    var forClient = {};

    if (req.session) {
      username = req.session.username;
      forClient.username = req.session.username;
      forClient.userId = req.session.userId;
    }

    var data = {
      moduleName: name,
      mainContent: viewCache[name](),
      username: username,
      forClient: JSON.stringify(forClient)
    };

    res.send(viewCache.base(data));
  },

  // ----------
  getTemplate: function(name) {
    return viewCache[name] || noOp;
  }
};
