// * userId
// * artworkId

var db = require('./db');

module.exports = {
  // ----------
  get: function(query, success, failure) {
    db.get('favorites', query).then(success, failure);
  },

  // ----------
  getMany: function(query, sort, success, failure) {
    db.getMany('favorites', query, sort).then(success, failure);
  },

  // ----------
  create: function(favorite, success, failure) {
    db.save('favorites', favorite).then(success, failure);
  },

  // ----------
  delete: function(query, success, failure) {
    db.remove('favorites', query).then(success, failure);
  }
};
