'use strict';
(function() {

  // ----------
  _.extend(window.App, {
    // ----------
    initMain: function() {
      var self = this;

      this.route([
        ['/add', 'Add'],
        ['/about', 'About'],
        ['/artwork/(.*)', 'Artwork'],
        ['', 'Home'],
        ['.*', 'NotFound']
      ]);
    }
  });

})();
