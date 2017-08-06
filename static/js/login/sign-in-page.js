(function() {

  // ----------
  var component = App.SignInPage = function(config) {
    var self = this;

    this.$el = config.$el;

    var $username = $('.username').focus();
    var $password = $('.password');

    $('.login-form').on('submit', function(event) {
      event.preventDefault();

      App.request({
        method: 'login',
        content: {
          username: $.trim($username.val()),
          password: $password.val()
        },
        success: function() {
          if (App.urlParams.redirect) {
            location.href = App.urlParams.redirect;
          } else {
            location.reload();
          }
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
