var admin = require('./routes/admin');
var api = require('./routes/api');
var defaults = require('./routes/defaults');
var user = require('./routes/user');

module.exports = function(express) {
  // -- DEFAULT
  express.get('/', defaults.home);
  express.get('/add', defaults.home);

  // -- USER
  express.get('/login', user.login);
  express.get('/signup', user.login);
//  express.get('/settings', user.settings);
  express.get('/logout', user.logout);

  // -- ADMIN
  express.get('/admin', admin.main);

  // -- API
  express.post('/api/:method', api.callApi);

  console.log('Routes initialized');
};
