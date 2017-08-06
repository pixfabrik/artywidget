_.extend(window.App, {
  // ----------
  initMain: function() {
    var self = this;

    this.route([
      ['/login', 'SignIn'],
      ['/signup', 'SignUp'],
      ['/settings', 'Settings'],
      ['.*', 'NotFound']
    ]);
  }
});
