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
        ['/play', 'Play'],
        ['/artwork/(.*)', 'Artwork'],
        ['/person/(.*)', 'Person'],
        ['', 'Home'],
        ['.*', 'NotFound']
      ]);
    },

    // ----------
    simpleModal: function(args) {
      args.message = args.message || '';
      var $modal = App.template('simple-modal', args).appendTo('body');

      $modal.on('click', '.cancel', function() {
        $modal.remove();
      });

      $modal.on('click', '.modal-content', function(event) {
        event.stopPropagation();
      });

      $modal.on('click', function() {
        $modal.remove();
      });
    },

    // ----------
    errorModal: function(title, message) {
      this.simpleModal({
        title: title,
        message: 'Error: ' + message,
        buttons: [
          {
            title: 'OK',
            className: 'cancel'
          }
        ]
      });
    }
  });

})();
