var exec = require('child_process').exec;
var zot = require('../src/zot-node');
var env = require('./env'); // gitignored

var collections = ['images', 'artworks', 'people'];

zot.asyncEach(collections, function(name, i, next) {
  var collectionName = name;
  if (collectionName === 'images') {
    collectionName = 'images2'; // mongoimport seems to have trouble with that collection name
  }

  var command = 'mongoimport --host ' + env.evennode.host +
    ' --db ' + env.evennode.db +
    ' --username ' + env.evennode.username +
    ' --password ' + env.evennode.password +
    ' --collection ' + collectionName +
    ' --file ' + name + '.json';

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
