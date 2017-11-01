#!/bin/env node

var _ = require('underscore');
var artworks = require('./artworks');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var db = require('./db');
var express = require('express');
var envHelpers = require('./env-helpers');
var http = require('http');
var keys = require('./keys');
var MongoClient = require('mongodb').MongoClient;
var path = require('path');
var people = require('./people');
var Router = require('./router');
var session = require('express-session');

var MongoStore = require('connect-mongo')(session);

// SESSIONS:
// * username
// * userId (as string)

// ----------
var App = {
  // ----------
  init: function() {
    var self = this;

    this.setupVariables();
    keys.init();

    if (this.isProd) {
      this.setupTerminationHandlers();
    }

    this.initDb(function() {
      db.init(self.db);
      people.init(self.db, keys.passwordSalt);
      artworks.init(self.db);
      self.initializeServer();
      self.start();
    });
  },

  // ----------
  initDb: function(callback) {
    var self = this;

    var url = 'mongodb://' + this.dbConnectString;
    MongoClient.connect(url, function(err, database) {
      if (err) {
        console.log('[App.initDb] error connecting', err);
        callback();
        return;
      }

      console.log('Connected correctly to db.');
      self.db = database;
      callback();
    });
  },

  // ----------
  start: function() {
    var self = this;

    var server = http.createServer();

    server.on('request', this.app);
    server.listen(this.port, this.ipAddress, function() {
      console.log('%s: Node server started on http://%s:%d ...', Date(Date.now()), self.ipAddress, self.port);
    });
  },

  // ----------
  setupVariables: function() {
    this.ipAddress = envHelpers.ipAddress;
    this.port = envHelpers.port;
    this.wsPort = envHelpers.wsPort;
    this.isProd = envHelpers.isProd;
    this.baseUrl = envHelpers.baseUrl;

    this.dbConnectString = '127.0.0.1:27017/dev';
    // if server env variables are present, use the available connection info:
    if (process.env.APP_CONFIG) {
      var config = JSON.parse(process.env.APP_CONFIG);
      this.dbConnectString = config.mongo.user + ':' +
        process.env.MONGODB_DB_PASSWORD + '@' + config.mongo.hostString;
    }
  },

  // ----------
  terminator: function(sig){
    if (typeof sig === 'string') {
       console.log('%s: Received %s - terminating sample app ...', Date(Date.now()), sig);
       process.exit(1);
    }

    console.log('%s: Node server stopped.', Date(Date.now()));
  },

  // ----------
  setupTerminationHandlers: function(){
    var self = this;

    process.on('exit', function() { self.terminator(); });

    // Removed 'SIGPIPE' from the list - bugz 852598.
    var events = ['SIGHUP', 'SIGINT', 'SIGQUIT', 'SIGILL', 'SIGTRAP', 'SIGABRT',
     'SIGBUS', 'SIGFPE', 'SIGUSR1', 'SIGSEGV', 'SIGUSR2', 'SIGTERM'
    ];

    events.forEach(function(element, index, array) {
      process.on(element, function() {
        self.terminator(element);
      });
    });
  },

  // ----------
  initializeServer: function() {
    var self = this;

    this.app = express();

    this.app.use(bodyParser.urlencoded({
      extended: false,
      limit: '100mb'
    }));

    this.app.use(cookieParser());

    // this.app.use(function(req, res, next) {
    //   res.header("Access-Control-Allow-Origin", "*");
    //   res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    //   next();
    // });

    this.app.use(session({
      secret: keys.sessionSecret,
      resave: false,
      saveUninitialized: false,
      store: new MongoStore({ db: this.db }),
      cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 30 // 30 days
      }
    }));

    this.app.use('/static', express.static(path.join(__dirname, '..', 'static')));

    this.router = new Router(this.app);
  }
};

// ----------
App.init();
