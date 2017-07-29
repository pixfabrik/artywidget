var views = require('../views');

exports.logout = function(req, res) {
  req.session.destroy();
  views.sendHTML(req, res, 'logout');
};
