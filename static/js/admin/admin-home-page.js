'use strict';
(function() {

  // ----------
  var component = App.AdminHomePage = function(config) {
    var self = this;

    this.$el = config.$el;
    this.$peopleList = this.$el.find('.people-list');
    this.$artworkList = this.$el.find('.artwork-list');

    App.request({
      method: 'get-all-people',
      success: function(data) {
        App.template('people-list', data).appendTo(self.$peopleList);
      },
      error: function(message) {
        self._error(message);
      }
    });

    this.renderArtworks();
  };

  // ----------
  component.prototype = {
    // ----------
    renderArtworks: function() {
      var self = this;

      this.$artworkList.empty();

      App.request({
        method: 'get-all-artworks',
        success: function(data) {
          var $artworks = App.template('artwork-list', data).appendTo(self.$artworkList);

          $artworks.on('change', 'input[type="file"]', function(event) {
            var $target = $(event.currentTarget);
            var $form = $target.closest('form');
            var formData = new FormData($form[0]);

            App.request({
              method: 'add-artwork-image-from-form',
              content: formData,
              contentType: false,
              processData: false,
              error: function(message) {
                self._error(message);
              },
              success: function(data) {
                self.renderArtworks();
              }
            });
          });
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
