'use strict';
(function() {

  // ----------
  var component = App.HomePage = function(config) {
    var self = this;

    this.$el = config.$el;
    this.$artworkStub = this.$el.find('.artwork-stub');

    if (App.user.id) {
      App.request({
        method: 'get-all-artworks',
        success: function(data) {
          App.template('home-artwork', data).appendTo(self.$artworkStub);
        },
        error: function(message) {
          self._error(message);
        }
      });
    }
  };

  // ----------
  component.prototype = {
    // ----------
    _error: function(message) {
      $('.error').text(message);
    }
  };

})();
