'use strict';
(function() {

  // ----------
  var component = App.PersonPage = function(config) {
    var self = this;

    this.username = config.params[0];
    this.$el = config.$el;
    this.$pageContent = this.$el.find('.page-content');

    App.request({
      method: 'get-person-favorites',
      content: {
        username: this.username
      },
      success: function(data) {
        App.template('person-page-content', data).appendTo(self.$pageContent);
        App.addNavBar(self.$el.find('.nav-bar-stub'));
        App.template('artwork-list', { artworks: data.favorites }).appendTo(self.$pageContent.find('.artwork-stub'));
      },
      error: function(message) {
        App.errorModal('Unable to load person', message);
      }
    });
  };

  // ----------
  component.prototype = {
  };

})();
