var exec = require('child_process').exec;
var zot = require('../src/zot-node');
var env = require('./env'); // gitignored

var collections = ['artworks', 'images', 'people'];

var run = function(args) {
  console.log(args.command);

  zot.asyncEach(collections, function(name, i, next) {
    var command = args.command + ' --host ' + env.evennode.host +
      ' --db ' + env.evennode.db +
      ' --username ' + env.evennode.username +
      ' --password ' + env.evennode.password +
      ' --collection ' + name +
      ' --out transfer/data/' + name + '.' + args.extension;

    exec(command, function(err, stdout, stderr) {
      if (err) {
        console.log('err', name, 'trying again');
        exec(command, function(err, stdout, stderr) {
          if (err) {
            console.log('err', name, 'giving up', err, stderr);
          } else {
            console.log('done', name, stdout);
          }

          setTimeout(next, 1000);
        });
      } else {
        console.log('done', name, stdout);
        setTimeout(next, 1000);
      }
    });
  }, args.onComplete);
};

run({
  command: 'mongoexport',
  extension: 'json',
  onComplete: function() {
    run({
      command: 'mongodump',
      extension: 'dump',
      onComplete: function() {
        console.log('complete!');
      }
    });
  }
});
