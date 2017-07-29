var views = require('../views');

exports.home = function(req, res) {
  views.sendHTML(req, res, 'home');
};
