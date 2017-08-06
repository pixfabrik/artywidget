var views = require('../views');

exports.login = function(req, res) {
  if (req.session.username) {
    res.redirect('/');
  } else {
    views.sendHTML(req, res, 'login');
  }
};

exports.settings = function(req, res) {
  if (!req.session.username) {
    res.redirect('/login/?redirect=/settings/');
  } else {
    views.sendHTML(req, res, 'login');
  }
};

exports.logout = function(req, res) {
  req.session.destroy();
  views.sendHTML(req, res, 'logout');
};
