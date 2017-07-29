var _ = require('underscore');

module.exports = {
  // ----------
  init: function() {
    var self = this;

    var map = {
      sessionSecret: 'SESSION_SECRET',
      passwordSalt: 'PASSWORD_SALT'
    };

    if (process.env.OPENSHIFT_NODEJS_IP) {
      _.each(map, function(v, k) {
        self[k] = process.env[v];
      });
    } else {
      var local = require('./keys-local');
      _.each(map, function(v, k) {
        self[k] = local[k];
      });
    }

    _.each(map, function(v, k) {
      if (!self[k]) {
        console.log('MISSING ' + k + '!!');
      }
    });
  }
};
