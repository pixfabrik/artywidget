var defaults = require('./routes/defaults');
var api = require('./routes/api');
var user = require('./routes/user');

module.exports = function(express) {
  // -- DEFAULT
  express.get('/', defaults.home);

  // -- USER
  express.get('/logout', user.logout);

  // -- API
  express.post('/api/:method', api.callApi);

  console.log('Routes initialized');
};
