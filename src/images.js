// collection name: 'images'
// * creatorId
// * type
// * originalType

var AWS = require('aws-sdk');
var db = require('./db');
var ObjectId = require('mongodb').ObjectId;
var Jimp = require('jimp');
var envHelpers = require('./env-helpers');

var s3 = new AWS.S3();
var bucketBase = 'artywidget/' + (envHelpers.isProd ? '' : 'dev/');

module.exports = {
  baseUrl: 'https://s3.amazonaws.com/' + bucketBase + 'images/',
  bucket: bucketBase + 'images',
  originalsBucket: bucketBase + 'original-images',

  // ----------
  idFromUrl: function(url) {
    var id = url
      .replace(this.baseUrl, '')
      .replace(/\..*$/, '');

    return ObjectId(id);
  },

  // ----------
  get: function(query, success, failure) {
    db.get('images', query).then(success, failure);
  },

  // ----------
  create: function(creatorId, originalData, originalMime, success, failure) {
    var self = this;

    Jimp.read(originalData, function(err, image) {
      if (err) {
        failure(err);
      } else {
        var size = 1024;
        var width = image.bitmap.width;
        var height = image.bitmap.height;
        if (width > height) {
          image.resize(size, Jimp.AUTO);
        } else {
          image.resize(Jimp.AUTO, size);
        }

        image.quality(85);

        image.getBuffer(Jimp.MIME_JPEG, function(err, data) {
          if (err) {
            failure(err);
          } else {
            var type = 'jpeg';
            var originalType = originalMime.replace(/^image\/(.*)$/, '$1');
            db.save('images', {
              creatorId: creatorId,
              type: type,
              originalType: originalType
            }).then(function(doc) {
              var key = doc._id + '.' + type;
              var originalKey = doc._id + '.' + originalType;

              s3.putObject({
                Bucket: self.bucket,
                Key: key,
                ACL: 'public-read',
                ContentType: 'image/' + type,
                Body: data
              }, function(err, result) {
                if (err) {
                  failure(err);
                } else {
                  var url = self.baseUrl + key;
                  // console.log(url);
                  success(url);

                  // we want to save the original but we're not concerned if it fails
                  s3.putObject({
                    Bucket: self.originalsBucket,
                    Key: originalKey,
                    ACL: 'public-read',
                    ContentType: 'image/' + originalType,
                    Body: originalData
                  }, function(err, result) {
                    if (err) {
                      console.log('WARNING: Failed to save original image', originalKey, err);
                    }
                  });
                }
              });
            }, failure);
          }
        });
      }
    });


  },

  // ----------
  delete: function(image, success, failure) {
    // TODO: Delete the original too
    s3.deleteObject({
      Bucket: this.bucket,
      Key: image._id + '.' + image.type
    }, function(err, data) {
      if (err) {
        failure(err);
      } else {
        db.remove('images', {
          _id: image._id
        }).then(success, failure);
      }
    });
  }
};
