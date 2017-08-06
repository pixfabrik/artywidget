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
  // ----------
  login: function(req, success, failure) {
    var username = (req.body.username || '').trim();
    var password = req.body.password;

    var finish = function(person) {
      if (!person || person.password !== password) {
        failure('Unknown username or password.');
      } else {
        req.session.username = person.username;
        req.session.userId = person._id.toString();
        success();
      }
    };

    if (!username) {
      failure('Username or email is required.');
    } else if (!password) {
      failure('Password is required.');
    } else {
      password = people.hash(password);
      people.get({ username: username }, function(person) {
        if (person) {
          finish(person);
        } else {
          people.get({ email: username }, function(person) {
            finish(person);
          }, failure);
        }
      }, failure);
    }
  },

  // ----------
  'create-person': function(req, success, failure) {
    var username = (req.body.username || '').trim();
    var email = (req.body.email || '').trim();
    var password = req.body.password;
    if (!username) {
      failure('Username is required.');
    } else if (!email) {
      failure('Email is required.');
    } else if (!password) {
      failure('Password is required.');
    } else if (password.length < 6) {
      failure('Password must be at least 6 characters long;');
    } else {
      password = people.hash(password);
      people.get({ username: username }, function(person) {
        if (person) {
          failure('That username is already taken.');
        } else {
          people.create({
            username: username,
            password: password,
            email: email
          }, function(person) {
            req.session.username = username;
            req.session.userId = person._id.toString();
            success();
          }, failure);
        }
      }, failure);
    }
  }
};
