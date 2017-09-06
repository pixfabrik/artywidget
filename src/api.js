var _ = require('underscore');
var artworks = require('./artworks');
var fs = require('fs');
var images = require('./images');
var ObjectId = require('mongodb').ObjectId;
var people = require('./people');
var request = require('request');
var zot = require('./zot-node');

var methods, $;

// ----------
module.exports = {
  // ----------
  process: function(req, res) {
    var method = req.params.method;
    if (methods[method]) {
      methods[method](req, function(result) {
        $.success(res, result);
      }, function(err) {
        $.fail(res, err ? err.toString() : 'unknown error', err ? err.name : undefined);
      });
    } else {
      $.fail(res, 'unknown method: ' + method);
    }
  }
};

// ----------
$ = {
  // ----------
  success: function(res, data) {
    res.send(JSON.stringify(_.extend({
      status: 'ok'
    }, data)));
  },

  // ----------
  fail: function(res, message, name) {
    res.send(JSON.stringify({
      status: 'error',
      message: message || 'unknown error',
      name: name
    }));
  },

  // ----------
  checkSignedIn: function(req, what, success, failure) {
    var userId = ObjectId(req.session.userId);
    if (userId) {
      success(userId);
    } else {
      failure('You must be signed in to ' + what + '.');
    }
  },

  // ----------
  checkErr: function(err, success, failure) {
    if (err) {
      failure(err);
    } else {
      success();
    }
  }
};

// ----------
methods = {

  // PEOPLE

  // ----------
  login: function(req, success, failure) {
    var username = (req.body.username || '').trim();
    var password = req.body.password;

    var finish = function(person) {
      if (!person || person.password !== password) {
        failure('Unknown username or password.');
      } else {
        req.session.username = person.username;
        req.session.userId = person._id.toString();
        success();
      }
    };

    if (!username) {
      failure('Username or email is required.');
    } else if (!password) {
      failure('Password is required.');
    } else {
      password = people.hash(password);
      people.get({ username: username }, function(person) {
        if (person) {
          finish(person);
        } else {
          people.get({ email: username }, function(person) {
            finish(person);
          }, failure);
        }
      }, failure);
    }
  },

  // ----------
  'create-person': function(req, success, failure) {
    var username = (req.body.username || '').trim();
    var email = (req.body.email || '').trim();
    var password = req.body.password;
    if (!username) {
      failure('Username is required.');
    } else if (!email) {
      failure('Email is required.');
    } else if (!password) {
      failure('Password is required.');
    } else if (password.length < 6) {
      failure('Password must be at least 6 characters long;');
    } else {
      password = people.hash(password);
      people.get({ username: username }, function(person) {
        if (person) {
          failure('That username is already taken.');
        } else {
          people.create({
            username: username,
            password: password,
            email: email,
            creationDate: (new Date()).toISOString()
          }, function(person) {
            req.session.username = username;
            req.session.userId = person._id.toString();
            success();
          }, failure);
        }
      }, failure);
    }
  },

  // ----------
  'get-all-people': function(req, success, failure) {
    people.getMany({}, null, function(records) {
      success({
        people: _.map(records, function(record) {
          return _.pick(record, ['username']);
        })
      });
    }, failure);
  },

  // ARTWORKS

  // ----------
  'add-artwork': function(req, success, failure) {
    var artworkName = (req.body.artworkName || '').trim();
    var artworkUrl = (req.body.artworkUrl || '').trim();
    var infoUrl = (req.body.infoUrl || '').trim();
    var authorName = (req.body.authorName || '').trim();
    var authorUrl = (req.body.authorUrl || '').trim();

    if (!req.session.userId) {
      failure(new Error('You must be logged in to add an artwork.'));
    } else {
      people.get({ _id: ObjectId(req.session.userId) }, function(person) {
        if (!person) {
          failure(new Error('You must be logged in to add an artwork.'));
        } else {
          if (!artworkUrl) {
            failure('You must include an artwork URL.');
          } else {
            artworks.get({ url: artworkUrl }, function(artwork) {
              if (artwork) {
                failure('That artwork has already been added.');
              } else {
                artworks.create({
                  name: artworkName,
                  url: artworkUrl,
                  infoUrl: infoUrl,
                  authorName: authorName,
                  authorUrl: authorUrl,
                  creationDate: (new Date()).toISOString(),
                  submitterId: person._id,
                }, function(artwork) {
                  success({
                    _id: artwork._id
                  });
                }, failure);
              }
            }, failure);
          }
        }
      }, failure);
    }
  },

  // ----------
  'get-artwork': function(req, success, failure) {
    var id = req.body._id;

    if (!id) {
      failure('Missing ID.');
    } else {
      artworks.get({ _id: ObjectId(id) }, function(artwork) {
        success({
          artwork: _.pick(artwork, ['name', 'url', 'infoUrl', 'authorName', 'authorUrl'])
        });
      }, failure);
    }
  },

  // ----------
  'previous-artwork': function(req, success, failure) {
    var id = req.body._id;

    if (!id) {
      failure('Missing ID.');
    } else {
      artworks.getMany({}, null, function(records) {
        var index = -1;
        var record;
        for (var i = 0; i < records.length; i++) {
          record = records[i];
          if (record._id.toString() === id) {
            index = i - 1;
            break;
          }
        }

        if (index < 0) {
          index = records.length - 1;
        }

        success({
          _id: records[index]._id.toString()
        });
      }, failure);
    }
  },

  // ----------
  'next-artwork': function(req, success, failure) {
    var id = req.body._id;

    if (!id) {
      failure('Missing ID.');
    } else {
      artworks.getMany({}, null, function(records) {
        var index = -1;
        var record;
        for (var i = 0; i < records.length; i++) {
          record = records[i];
          if (record._id.toString() === id) {
            index = i + 1;
            break;
          }
        }

        if (index === -1 || index > records.length - 1) {
          index = 0;
        }

        success({
          _id: records[index]._id.toString()
        });
      }, failure);
    }
  },

  // ----------
  'get-all-artworks': function(req, success, failure) {
    artworks.getMany({}, null, function(records) {
      success({
        artworks: _.map(records, function(record) {
          return _.pick(record, ['name', '_id', 'imageUrl', 'authorName']);
        })
      });
    }, failure);
  },

  // ----------
  'add-artwork-image-from-form': function(req, success, failure) {
    var artworkId = req.body.artwork;

    if (!req.file) {
      failure('Missing image.');
    } else {
      fs.readFile(req.file.path, function(err, data) {
        fs.unlink(req.file.path, function(err) {
          if (err) {
            console.log('error deleting temp file', err);
          }
        });

        if (err) {
          failure(err);
        } else if (!artworkId) {
          failure('Missing artwork ID.');
        } else if (!req.session.userId) {
          failure(new Error('You must be logged in to add an image.'));
        } else {
          var userId = ObjectId(req.session.userId);
          people.get({ _id: userId }, function(person) {
            if (!person) {
              failure('You must be logged in to add an image');
            } else if (!people.isAdmin(person)) {
              failure('This only works for admins.');
            } else {
              artworkId = ObjectId(artworkId);
              artworks.get({ _id: artworkId }, function(artwork) {
                if (!artwork) {
                  failure('Missing artwork.');
                } else {
                  var finish = function() {
                    images.create(userId, data, req.file.mimetype, function(url) {
                      artwork.imageUrl = url;
                      artworks.update(artwork, function() {
                        success();
                      }, failure);
                    }, failure);
                  };

                  if (artwork.imageUrl) {
                    var imageId = images.idFromUrl(artwork.imageUrl);
                    images.get({ _id: imageId }, function(image) {
                      if (!image) {
                        failure('Unable to replace image; record not found');
                      } else {
                        images.delete(image, finish, failure);
                      }
                    }, failure);
                  } else {
                    finish();
                  }
                }
              }, failure);
            }
          }, failure);
        }
      });
    }
  }
};
