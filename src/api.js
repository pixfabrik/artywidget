var _ = require('underscore');
var ObjectId = require('mongodb').ObjectId;
var people = require('./people');
var request = require('request');
var zot = require('./zot-node');

// ----------
module.exports = {
  // ----------
  process: function(req, res) {
    var method = req.params.method;
    if (methods[method]) {
      methods[method](req, function(result) {
        $.success(res, result);
      }, function(err) {
        $.fail(res, err ? err.toString() : 'unknown error', err ? err.name : undefined);
      });
    } else {
      $.fail(res, 'unknown method: ' + method);
    }
  }
};

// ----------
var $ = {
  // ----------
  success: function(res, data) {
    res.send(JSON.stringify(_.extend({
      status: 'ok'
    }, data)));
  },

  // ----------
  fail: function(res, message, name) {
    res.send(JSON.stringify({
      status: 'error',
      message: message || 'unknown error',
      name: name
    }));
  }
};

// ----------
var methods = {
};
