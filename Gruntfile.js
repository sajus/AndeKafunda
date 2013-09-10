module.exports = function(grunt) {
    'use strict';
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        jshint: {
            all: ['Gruntfile.js', 'routes/**/*.js', 'models/**/*.js', 'src/js/**/*.js'],
            options: {
                ignores: ['src/js/vendors/**/*.js']
            }
        }
    });

    // Load the plugin that provides the "jshint" task.
    grunt.loadNpmTasks('grunt-contrib-jshint');

    // Default task(s).
    grunt.registerTask('default', ['jshint']);

};