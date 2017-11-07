var Promise = require('promise');

module.exports = {
  // ----------
  init: function(db) {
    this.db = db;
  },

  // ----------
  count: function(collectionName) {
    var self = this;

    return new Promise(function(resolve, reject) {
      self.db.collection(collectionName).count(function(err, result) {
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      });
    });
  },

  // ----------
  get: function(collectionName, query) {
    var self = this;

    return new Promise(function(resolve, reject) {
      self.db.collection(collectionName).find(query).limit(1).toArray(function(err, docs) {
        // console.log(JSON.stringify(docs));
        if (err) {
          reject(err);
        } else {
          resolve(docs[0]);
        }
      });
    });
  },

  // ----------
  getMany: function(collectionName, query, sort) {
    var self = this;

    return new Promise(function(resolve, reject) {
      var options = {};
      if (sort) {
        options.sort = sort;
      }

      self.db.collection(collectionName).find(query, options).toArray(function(err, docs) {
        // console.log(JSON.stringify(docs));
        if (err) {
          reject(err);
        } else {
          resolve(docs);
        }
      });
    });
  },

  // ----------
  getAll: function(collectionName, sort) {
    return this.getMany(collectionName, {}, sort);
  },

  // ----------
  save: function(collectionName, doc) {
    var self = this;

    return new Promise(function(resolve, reject) {
      if (doc._id) {
        self.db.collection(collectionName).update({ _id: doc._id }, doc, function(err, result) {
          if (err) {
            reject(err);
          } else {
            resolve(doc);
          }
        });
      } else {
        self.db.collection(collectionName).insert(doc, function(err, result) {
          if (err) {
            reject(err);
          } else if (!result.ops || !result.ops.length) {
            reject(new Error('[db.save] no result from insert'));
          } else {
            resolve(result.ops[0]);
          }
        });
      }
    });
  },

  // ----------
  set: function(collectionName, values) {
    var self = this;

    return new Promise(function(resolve, reject) {
      if (values._id) {
        var id = values._id;
        delete values._id;

        self.db.collection(collectionName).update({ _id: id }, { $set: values }, function(err, result) {
          if (err) {
            reject(err);
          } else {
            resolve();
          }
        });
      } else {
        reject(new Error('[db.set] values._id is required'));
      }
    });
  },

  // ----------
  remove: function(collectionName, query) {
    var self = this;

    return new Promise(function(resolve, reject) {
      if (query) {
        self.db.collection(collectionName).deleteOne(query, function(err, result) {
          if (err) {
            reject(err);
          } else {
            var removedCount = result.deletedCount;
            resolve(removedCount);
          }
        });
      } else {
        reject(new Error('[db.remove] missing query'));
      }
    });
  },

  // ----------
  removeAll: function(collectionName) {
    var self = this;

    return new Promise(function(resolve, reject) {
      self.db.collection(collectionName).remove(function(err, result) {
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      });
    });
  }
};
