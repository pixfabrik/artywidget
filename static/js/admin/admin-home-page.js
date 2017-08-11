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

    App.request({
      method: 'get-all-artworks',
      success: function(data) {
        App.template('artwork-list', data).appendTo(self.$artworkList);
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
