var people = require('../people');
var views = require('../views');

// ----------
exports.main = function(req, res) {
  people.adminCheck(req, function() {
    views.sendHTML(req, res, 'admin');
  }, function() {
    views.sendHTML(req, res, 'home');
  });
};
