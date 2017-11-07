'use strict';
(function() {

  // ----------
  var component = App.ArtworkPage = function(config) {
    var self = this;

    this.artworkId = config.params[0];
    this.$el = config.$el;
    this.$pageContent = this.$el.find('.page-content');
    this.isFavorite = false;

    App.request({
      method: 'get-artwork',
      content: {
        _id: this.artworkId
      },
      success: function(data) {
        App.template('artwork-page-content', data).appendTo(self.$pageContent);
        App.addNavBar(self.$el.find('.nav-bar-stub'));
        self.$leftArrow = self.$el.find('.left-arrow');
        self.$rightArrow = self.$el.find('.right-arrow');
        self.$favoriteButton = self.$el.find('.favorite-button');

        self.isFavorite = !!data.artwork.isFavorite;
        self.$favoriteButton.toggleClass('full', self.isFavorite);

        self.$leftArrow.on('click', function() {
          self.previous();
        });

        self.$rightArrow.on('click', function() {
          self.next();
        });

        self.$favoriteButton.on('click', function() {
          if (App.user.id) {
            if (self.isFavorite) {
              self.removeFavorite();
            } else {
              self.saveFavorite();
            }
          } else {
            App.simpleModal({
              title: 'Log In to Save Favorites',
              buttons: [
                {
                  title: 'Cancel',
                  className: 'cancel'
                },
                {
                  title: 'Log In',
                  href: '/login/?redirect=' + encodeURIComponent(location.pathname)
                },
                {
                  title: 'Sign Up',
                  href: '/signup/?redirect=' + encodeURIComponent(location.pathname)
                }
              ]
            });
          }
        });
      },
      error: function(message) {
        App.errorModal('Unable to load artwork', message);
      }
    });
  };

  // ----------
  component.prototype = {
    // ----------
    previous: function() {
      var self = this;

      App.request({
        method: 'previous-artwork',
        content: {
          _id: this.artworkId
        },
        success: function(data) {
          location.href = '/artwork/' + data._id;
        },
        error: function(message) {
          App.errorModal('Unable to find previous artwork', message);
        }
      });
    },

    // ----------
    next: function() {
      var self = this;

      App.request({
        method: 'next-artwork',
        content: {
          _id: this.artworkId
        },
        success: function(data) {
          location.href = '/artwork/' + data._id;
        },
        error: function(message) {
          App.errorModal('Unable to find next artwork', message);
        }
      });
    },

    // ----------
    saveFavorite: function() {
      var self = this;

      App.request({
        method: 'set-favorite',
        content: {
          artworkId: this.artworkId
        },
        success: function(data) {
          self.isFavorite = true;
          self.$favoriteButton.addClass('full');
        },
        error: function(message) {
          App.errorModal('Unable to save favorite', message);
        }
      });
    },

    // ----------
    removeFavorite: function() {
      var self = this;

      App.request({
        method: 'remove-favorite',
        content: {
          artworkId: this.artworkId
        },
        success: function(data) {
          self.isFavorite = false;
          self.$favoriteButton.removeClass('full');
        },
        error: function(message) {
          App.errorModal('Unable to remove favorite', message);
        }
      });
    }
  };

})();
