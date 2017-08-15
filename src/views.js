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

    // if (options.forceProtocol) {
    //   var newSecureFlag = (options.forceProtocol === 'https');
    //   if (envHelpers.isProd && req.secure !== newSecureFlag) {
    //     var baseUrl = (newSecureFlag ? envHelpers.baseSecureUrl : envHelpers.baseUrl);
    //     res.redirect(301, baseUrl + req.url);
    //     return;
    //   }
    // }

    res.setHeader('Content-Type', 'text/html');

    var username;
    var forClient = {
      secure: req.secure,
      protocol: req.protocol,
      keys: _.keys(req)
    };

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
