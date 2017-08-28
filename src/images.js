// collection name: 'images'
// * creatorId
// * type

var AWS = require('aws-sdk');
var db = require('./db');
var ObjectId = require('mongodb').ObjectId;

var s3 = new AWS.S3();

module.exports = {
  baseUrl: 'https://s3.amazonaws.com/artywidget/images/',
  bucket: 'artywidget/images',

  // ----------
  idFromUrl: function(url) {
    var id = url
      .replace(this.baseUrl, '')
      .replace(/\..*$/, '');

    return ObjectId(id);
  },

  // ----------
  create: function(creatorId, data, mimetype, success, failure) {
    var self = this;

    var type = mimetype.replace(/^image\/(.*)$/, '$1');
    db.save('images', {
      creatorId: creatorId,
      type: type
    }).then(function(doc) {
      var key = doc._id + '.' + type;

      s3.putObject({
        Bucket: self.bucket,
        Key: key,
        ACL: 'public-read',
        ContentType: 'image/' + type,
        Body: data
      }, function(err, data) {
        if (err) {
          failure(err);
        } else {
          var url = self.baseUrl + key;
          // console.log(url);
          success(url);
        }
      });
    }, failure);
  },

  // ----------
  delete: function(image, callback) {
    s3.deleteObject({
      Bucket: this.bucket,
      Key: image._id + '.' + image.type
    }, function(err, data) {
      if (err) {
        callback(err);
      } else {
        db.remove('images', {
          _id: image._id
        }).then(function(removedCount) {
          callback(null, removedCount);
        }, callback);
      }
    });
  }
};
