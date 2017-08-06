// * name
// * url
// * authorName
// * authorUrl

module.exports = {
  // ----------
  init: function(db) {
    this._db = db;
  },

  // ----------
  get: function(query, success, failure) {
    this._db.collection('artworks').find(query).limit(1).toArray(function(err, docs) {
      if (err) {
        failure(err);
      } else {
        success(docs[0]);
      }
    });
  },

  // ----------
  create: function(artwork, success, failure) {
    this._db.collection('artworks').insert(artwork, function(err, result) {
      if (err) {
        failure(err);
      } else if (!result.ops || !result.ops.length) {
        failure(new Error('Unable to add artwork.'));
      } else {
        success(result.ops[0]);
      }
    });
  },

  // ----------
  update: function(artwork, success, failure) {
    var self = this;

    this._db.collection('artworks').update({ _id: artwork._id }, artwork, function(err, result) {
      if (err) {
        failure(err);
      } else {
        success(artwork);
      }
    });
  }
};
