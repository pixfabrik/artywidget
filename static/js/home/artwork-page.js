'use strict';
(function() {

  // ----------
  var component = App.ArtworkPage = function(config) {
    var self = this;

    this.artworkId = config.params[0];
    this.$el = config.$el;
    this.$pageContent = this.$el.find('.page-content');

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

        self.$leftArrow.on('click', function() {
          self.previous();
        });

        self.$rightArrow.on('click', function() {
          self.next();
        });

        self.$favoriteButton.on('click', function() {
          if (App.user.id) {
            self.$favoriteButton.toggleClass('full');
          } else {
            var $modal = App.template('simple-modal', {
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
            }).appendTo('body');

            $modal.on('click', '.cancel', function() {
              $modal.remove();
            });

            $modal.on('click', '.modal-content', function(event) {
              event.stopPropagation();
            });

            $modal.on('click', function() {
              $modal.remove();
            });
          }
        });
      },
      error: function(message) {
        self._error(message);
      }
    });
  };

  // ----------
  component.prototype = {
    // ----------
    previous: function() {
      App.request({
        method: 'previous-artwork',
        content: {
          _id: this.artworkId
        },
        success: function(data) {
          location.href = '/artwork/' + data._id;
        },
        error: function(message) {
          self._error(message);
        }
      });
    },

    // ----------
    next: function() {
      App.request({
        method: 'next-artwork',
        content: {
          _id: this.artworkId
        },
        success: function(data) {
          location.href = '/artwork/' + data._id;
        },
        error: function(message) {
          self._error(message);
        }
      });
    },

    // ----------
    _error: function(message) {
      $('.error').text(message);
    }
  };

})();
