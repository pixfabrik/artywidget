module.exports = function(grunt) {
  var _ = grunt.util._;

  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-less');

  var buildRoot = 'static/build/';

  // ----------
  var modules = [
    'home',
    'login'
  ];

  var gruntConfig = {
    clean: {
      build: [buildRoot]
    },
    uglify: {
      options: {
        // sourceMap: true
      }
    },
    concat: {
      build: {
        src: [
          'static/lib/zot.js',
          'static/lib/*.js'
        ],
        dest: 'static/build/lib.js'
      }
    },
    less: {
    },
    watch: {
      files: [
        'Gruntfile.js',
        'static/js/**',
        'static/style/**',
        'static/lib/**'
      ],
      tasks: 'build'
    }
  };

  _.each(modules, function(v, i) {
    gruntConfig.uglify[v] = {
      src: [
        'static/js/app.js',
        'static/js/*.js',
        'static/js/' + v + '/*.js'
      ],
      dest: 'static/build/' + v + '.min.js'
    };
  });

  _.each(modules, function(v, i) {
    gruntConfig.less[v] = {
      src: [
        'static/lib/normalize.3.0.2.css',
        'static/style/common.less',
        'static/style/' + v + '/*.less'
      ],
      dest: 'static/build/' + v + '.css'
    };
  });

  grunt.initConfig(gruntConfig);

  // ----------
  grunt.registerTask('copy:build', function() {
    grunt.file.copy('static/lib/underscore-min.map',
      'static/build/underscore-min.map');
  });

  // ----------
  grunt.registerTask('build', [
    'clean', 'uglify', 'concat', 'less', 'copy:build'
  ]);

  // ----------
  grunt.registerTask('dev', [
    'build', 'watch'
  ]);

};
