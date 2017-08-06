(function() {

  // ----------
  var component = App.AddPage = function(config) {
    var self = this;

    this.$el = config.$el;

    var $artworkName = $('.artworkName').focus();
    var $artworkUrl = $('.artworkUrl');
    var $authorName = $('.authorName');
    var $authorUrl = $('.authorUrl');

    $('.add-form').on('submit', function(event) {
      event.preventDefault();

      App.request({
        method: 'add-artwork',
        content: {
          artworkName: $.trim($artworkName.val()),
          artworkUrl: $.trim($artworkUrl.val()),
          authorkName: $.trim($authorName.val()),
          authorUrl: $.trim($authorUrl.val())
        },
        success: function() {
          self._error('Success!');
        },
        error: function(message) {
          self._error(message);
        }
      });
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
