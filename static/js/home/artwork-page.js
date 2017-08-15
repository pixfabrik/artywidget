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

        self.$leftArrow.on('click', function() {
          self.previous();
        });

        self.$rightArrow.on('click', function() {
          self.next();
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
