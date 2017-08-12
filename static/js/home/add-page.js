'use strict';
(function() {

  // ----------
  var component = App.AddPage = function(config) {
    var self = this;

    this.$el = config.$el;

    var $artworkName = $('.artworkName').focus();
    var $artworkUrl = $('.artworkUrl');
    var $infoUrl = $('.infoUrl');
    var $authorName = $('.authorName');
    var $authorUrl = $('.authorUrl');
    var $form = $('.add-form');
    var $submit = $('.add-button');

    $form.on('submit', function(event) {
      event.preventDefault();
    });

    $submit.on('click', function() {
      App.request({
        method: 'add-artwork',
        content: {
          artworkName: $.trim($artworkName.val()),
          artworkUrl: $.trim($artworkUrl.val()),
          infoUrl: $.trim($infoUrl.val()),
          authorName: $.trim($authorName.val()),
          authorUrl: $.trim($authorUrl.val())
        },
        success: function(result) {
          location.href = '/artwork/' + result._id + '/';
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
