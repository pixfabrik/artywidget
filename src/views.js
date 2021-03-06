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
      // Note that on OpenShift, req.protocol and req.secure don't give us the info we need
      var secureFlag = (req.headers['x-forwarded-proto'] === 'https');
      var newSecureFlag = (options.forceProtocol === 'https');
      if (envHelpers.isProd && secureFlag !== newSecureFlag) {
        var baseUrl = (newSecureFlag ? envHelpers.baseSecureUrl : envHelpers.baseUrl);
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
      forClient: JSON.stringify(forClient),
      headExtra: ''
    };

    if (options.social) {
      data.headExtra += '<meta property="og:title" content="' + options.social.title + '" />\n';
      data.headExtra += '<meta property="og:description" content="' + options.social.description + '" />\n';
      data.headExtra += '<meta property="og:image" content="' + options.social.imageUrl + '" />\n';

      data.headExtra += '<meta name="twitter:card" content="summary_large_image" />\n';
      data.headExtra += '<meta name="twitter:site" content="@artywidget" />\n';
      data.headExtra += '<meta name="twitter:title" content="' + options.social.title + '" />\n';
      data.headExtra += '<meta name="twitter:description" content="' + options.social.description + '" />\n';
      data.headExtra += '<meta name="twitter:image" content="' + options.social.imageUrl + '" />\n';
    }

    res.send(viewCache.base(data));
  },

  // ----------
  getTemplate: function(name) {
    return viewCache[name] || noOp;
  }
};
