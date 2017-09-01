var admin = require('./routes/admin');
var api = require('./routes/api');
var defaults = require('./routes/defaults');
var multer  = require('multer');
var user = require('./routes/user');

module.exports = function(express) {
  // -- DEFAULT
  express.get('/', defaults.home);
  express.get('/add', defaults.home);
  express.get('/artwork/:artworkId', defaults.artwork);

  // -- USER
  express.get('/login', user.login);
  express.get('/signup', user.login);
//  express.get('/settings', user.settings);
  express.get('/logout', user.logout);

  // -- ADMIN
  express.get('/admin', admin.main);

  // -- API
  var upload = multer({ dest: 'uploads/' });
  express.post('/api/:method', upload.single('image'), api.callApi);

  console.log('Routes initialized');
};
