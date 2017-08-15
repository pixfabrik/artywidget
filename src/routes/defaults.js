var views = require('../views');

exports.home = function(req, res) {
  views.sendHTML(req, res, 'home');
};

exports.artwork = function(req, res) {
  views.sendHTML(req, res, 'home', {
    // We need to force http for artwork pages, because some of the art we show via the iframe may be in http
    forceProtocol: 'http'
  });
};
