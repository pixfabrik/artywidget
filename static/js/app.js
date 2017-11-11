'use strict';
(function() {

  // ----------
  window.App = {
    // ----------
    init: function() {
      var self = this;

      this.isProd = (location.hostname !== 'localhost');

      if (!window.console) {
        window.console = {
          log: function() {},
          warn: function() {},
          error: function() {},
          assert: function() {}
        };
      }

      this.urlParams = {};

      _.each(location.search.replace(/^\?/, '').split('&'), function(v, i) {
        var parts = v.split('=');
        self.urlParams[parts[0]] = parts[1];
      });

      this.isTouch = 'ontouchstart' in document.documentElement;
      // this.isTouch = true;
      if (!this.isTouch) {
        $('html').addClass('no-touch');
      }

      this.user = {};
      if (this.fromServer) {
        this.user.id = this.fromServer.userId;
        this.user.name = this.fromServer.username;
      }

      if (this.initMain) {
        this.initMain();
      }
    },

    // ----------
    addNavBar: function($parent) {
      $parent.html(this.template('nav-bar', {
        username: this.user.name
      }));
    },

    // ----------
    route: function(routes) {
      var self = this;

      var path = location.pathname.replace(/\/$/, '');

      _.any(routes, function(v, i) {
        // console.log(path, v[0]);
        var regex = new RegExp('^' + v[0] + '$');
        var match = regex.exec(path);
        if (match) {
          self.goToPage(v[1], _.rest(match, 1));
          return true;
        }

        return false;
      });
    },

    // ----------
    goToPage: function(pageName, params) {
      var self = this;

      var pageClass = App[pageName + 'Page'];
      var templateName = pageName.toLowerCase() + '-page';

      $('html').addClass('for-' + templateName);

      var $el = $('<div>')
        .addClass(templateName)
        .appendTo('.content');

      this.template(templateName)
        .appendTo($el);

      if (pageClass) {
        this.page = new pageClass({
          $el: $el,
          params: params
        });
      }

      var $navBarStub = $('.nav-bar-stub');
      if ($navBarStub.length) {
        this.addNavBar($navBarStub);
      }
    },

    // ----------
    request: function(config) {
      var failure = function(message, name) {
        if (config.error) {
          config.error(message || 'An unknown error occurred.', name);
        }
      };

      var url = '';
      url += '/api/' + config.method;

      $.ajax({
        method: 'POST',
        url: url,
        data: config.content,
        contentType: config.contentType,
        processData: config.processData,
        success: function(data) {
          if (!data || !data.status) {
            failure('The server is not responding correctly.');
          } else if (data.status !== 'ok') {
            failure(data.message, data.name);
          } else {
            if (config.success) {
              config.success(data);
            }
          }
        },
        error: function(jqXHR, textStatus, errorThrown) {
          failure(errorThrown || textStatus);
        }
      });
    },

    // ----------
    template: function(name, config) {
      var $template = $('#' + name + '-template');
      if (!$template.length) {
        console.error('[App.template] missing template', name);
        return $('');
      }

      var rawTemplate = $.trim($template.text());
      if (!rawTemplate) {
        console.error('[App.template] empty template', name);
      }

      var template = _.template(rawTemplate);
      var html = template(config);
      return $(html);
    }
  };

  // ----------
  $(document).ready(function() {
    App.init();
  });

})();
