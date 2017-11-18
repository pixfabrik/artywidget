'use strict';
(function() {

  // ----------
  var component = App.PlayPage = function(config) {
    var self = this;

    this.$el = config.$el;
    this.$iframe = this.$el.find('.artwork-iframe');
    this.$overlay = this.$el.find('.overlay');
    this.$overlayContent = this.$overlay.find('.overlay-content');
    this.incoming = [];

    var username;
    if (App.urlParams.favorites) {
      username = App.urlParams.favorites;
    } else {
      username = App.user.name;
    }

    if (username) {
      App.request({
        method: 'get-person-favorites',
        content: {
          username: username
        },
        success: function(data) {
          if (data.favorites.length) {
            self.favorites = data.favorites;
            self.start();
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
    start: function() {
      var self = this;

      this.next();

      this.$overlay.on('mousemove', function() {
        self.interactiveOverlay(true);
        clearTimeout(self.mouseTimeout);
        self.mouseTimeout = setTimeout(function() {
          self.interactiveOverlay(false);
        }, 5000);
      });
    },

    // ----------
    interactiveOverlay: function(flag) {
      this.interactiveOverlayFlag = flag;
      this.renderOverlay();
    },

    // ----------
    renderOverlay: function() {
      if (!this.artwork) {
        return;
      }

      this.$overlayContent.html(App.template('play-overlay', {
        artwork: this.artwork,
        interactive: !!this.interactiveOverlayFlag
      }));

      this.$overlayContent.toggleClass('interactive', !!this.interactiveOverlayFlag);
    },

    // ----------
    next: function() {
      var self = this;

      if (this.incoming.length === 0) {
        this.incoming = _.shuffle(this.favorites);
      }

      this.artwork = this.incoming.pop();
      this.$iframe.prop({
        src: this.artwork.url
      });

      this.renderOverlay();

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
