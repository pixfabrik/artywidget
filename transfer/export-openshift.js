var exec = require('child_process').exec;
var zot = require('../src/zot-node');
var env = require('./env'); // gitignored

var collections = ['artworks', 'images', 'people'];

zot.asyncEach(collections, function(name, i, next) {
  var command = 'mongoexport --host ' + env.openshift.host +
    ' --db ' + env.openshift.db +
    ' --username ' + env.openshift.username +
    ' --password ' + env.openshift.password +
    ' --collection ' + name +
    ' --out ' + name + '.json';

  exec(command, function(err, stdout, stderr) {
    if (err) {
      console.log('err', name, stderr);
    } else {
      console.log('done', name, stdout);
    }

    next();
  });
}, function() {
  console.log('complete!');
});
