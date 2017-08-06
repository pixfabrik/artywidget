var _ = require('underscore');
var fs = require('fs');

var viewCache = {};
var noOp = function() {
  return false;
};

var keys = [
  'login',
  'logout',
  'home',
  'base'
];

_.templateSettings = {
  interpolate : /\{\{(.+?)\}\}/g
};

_.each(keys, function(v, i) {
  var html = fs.readFileSync('views/' + v + '.html', {
    encoding: 'utf8'
  });

  viewCache[v] = _.template(html);
});

module.exports = {
  // ----------
  sendHTML: function(req, res, name, requiresSession) {
    res.setHeader('Content-Type', 'text/html');

    var username;
    var forClient = {};

    if (req.session) {
      username = req.session.username;
      forClient.username = req.session.username;
      forClient.userId = req.session.userId;
    }

    if (requiresSession && !username) {
      name = 'login';
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
