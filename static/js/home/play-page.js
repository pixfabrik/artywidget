'use strict';
(function() {

  // ----------
  var component = App.PlayPage = function(config) {
    var self = this;

    this.$el = config.$el;
    this.$iframe = this.$el.find('.artwork-iframe');
    this.incoming = [];

    if (App.user.name) {
      App.request({
        method: 'get-person-favorites',
        content: {
          username: App.user.name
        },
        success: function(data) {
          if (data.favorites.length) {
            self.favorites = data.favorites;
            self.next();
          } else {
            self.gateway();
          }
        },
        error: function(message) {
          App.errorModal('Unable to load person', message);
        }
      });
    } else {
      this.gateway();
    }
  };

  // ----------
  component.prototype = {
    // ----------
    next: function() {
      var self = this;

      if (this.incoming.length === 0) {
        this.incoming = _.shuffle(this.favorites);
      }

      var artwork = this.incoming.pop();
      this.$iframe.prop({
        src: artwork.url
      });

      if (this.favorites.length > 1) {
        setTimeout(function() {
          self.next();
        }, 1000 * 60 * 5); // 5 minutes
      }
    },

    // ----------
    gateway: function() {
      this.$el.html(App.template('play-page-gateway'));
      $('html').removeClass('for-play-page');
      App.addNavBar(this.$el.find('.nav-bar-stub'));
    }
  };

})();
