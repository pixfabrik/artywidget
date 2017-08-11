'use strict';
(function() {

  // ----------
  _.extend(window.App, {
    // ----------
    initMain: function() {
      var self = this;

      console.log('admin');

      this.route([
        ['/admin', 'AdminHome'],
        ['.*', 'NotFound']
      ]);
    }
  });

})();
