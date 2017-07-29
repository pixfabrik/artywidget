// * username
// * password
// * email

var crypto = require('crypto');

module.exports = {
  // ----------
  init: function(db, salt) {
    this._db = db;
    this._salt = salt;
  },

  // ----------
  hash: function(password) {
    var hash = crypto.createHash('sha512');
    hash.update(password + this._salt);
    return hash.digest('hex');
  },

  // ----------
  get: function(query, success, failure) {
    this._db.collection('people').find(query).limit(1).toArray(function(err, docs) {
      if (err) {
        failure(err);
      } else {
        success(docs[0]);
      }
    });
  },

  // ----------
  create: function(person, success, failure) {
    this._db.collection('people').insert(person, function(err, result) {
      if (err) {
        failure(err);
      } else if (!result.ops || !result.ops.length) {
        failure(new Error('Unable to create account.'));
      } else {
        success(result.ops[0]);
      }
    });
  },

  // ----------
  update: function(person, success, failure) {
    var self = this;

    this._db.collection('people').update({ _id: person._id }, person, function(err, result) {
      if (err) {
        failure(err);
      } else {
        success(person);
      }
    });
  }
};
