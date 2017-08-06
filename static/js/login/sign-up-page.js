(function() {

  // ----------
  var component = App.SignUpPage = function(config) {
    var self = this;

    this.$el = config.$el;

    var $username = $('.username').focus();
    var $password = $('.password');

    $('.login-form').on('submit', function(event) {
      event.preventDefault();

      var password = $password.val();
      if (password !== $('.confirm-password').val()) {
        self._error('Passwords must match.');
        return;
      }

      App.request({
        method: 'create-person',
        content: {
          username: $.trim($username.val()),
          password: password,
          email: $.trim($('.email').val())
        },
        success: function() {
          location.href = '/';
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
