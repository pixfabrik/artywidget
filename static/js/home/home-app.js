'use strict';
(function() {

  // ----------
  _.extend(window.App, {
    // ----------
    initMain: function() {
      var self = this;

      this.route([
        ['/add', 'Add'],
        ['/artwork/(.*)', 'Artwork'],
        ['', 'Home'],
        ['.*', 'NotFound']
      ]);
    }
  });

})();
