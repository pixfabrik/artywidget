var artworks = require('../artworks');
var ObjectId = require('mongodb').ObjectId;
var views = require('../views');

exports.home = function(req, res) {
  views.sendHTML(req, res, 'home');
};

exports.artwork = function(req, res) {
  var artworkId = req.params.artworkId;

  var options = {
    // We need to force http for artwork pages, because some of the art we show via the iframe may be in http
    forceProtocol: 'http'
  };

  var finish = function(imageUrl) {
    views.sendHTML(req, res, 'home', options);
  };

  if (artworkId) {
    artworkId = ObjectId(artworkId);
    artworks.get({ _id: artworkId }, function(artwork) {
      if (artwork) {
        options.social = {
          title: artwork.name,
          description: artwork.authorName ? 'by ' + artwork.authorName : '',
          imageUrl: artwork.imageUrl
        };

        finish();
      } else {
        finish();
      }
    }, function() {
      finish();
    });
  } else {
    finish();
  }
};
