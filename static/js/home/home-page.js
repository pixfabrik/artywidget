'use strict';
(function() {

  // ----------
  var component = App.HomePage = function(config) {
    var self = this;

    this.$el = config.$el;
    this.$artworkStub = this.$el.find('.artwork-stub');

    App.request({
      method: 'get-all-artworks',
      success: function(data) {
        // data.artworks = data.artworks.concat(data.artworks);
        data.artworks = _.shuffle(data.artworks);
        App.template('artwork-list', data).appendTo(self.$artworkStub);
      },
      error: function(message) {
        self._error(message);
      }
    });
  };

  // ----------
  component.prototype = {
    // ----------
    _error: function(message) {
      $('.error').text(message);
    }
  };

})();
