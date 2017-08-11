'use strict';
(function() {

  // ----------
  var component = App.ArtworkPage = function(config) {
    var self = this;

    var id = config.params[0];
    this.$el = config.$el;
    this.$pageContent = this.$el.find('.page-content');

    App.request({
      method: 'get-artwork',
      content: {
        _id: id
      },
      success: function(data) {
        App.template('artwork-page-content', data).appendTo(self.$pageContent);
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
