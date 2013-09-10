module.exports = function(grunt) {
    'use strict';
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        jshint: {
            all: ['Gruntfile.js', 'routes/**/*.js', 'models/**/*.js', 'src/js/**/*.js'],
            options: {
                ignores: ['src/js/vendors/**/*.js'],
                undef: true,
                browser: true,
                node: true,
                jquery: true,
                strict: true,
                globals: {
                    define: true,
                    requirejs: true,
                    google: true
                }
            }
        },
        uglify: {
            options: {
                banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
            },
            dynamic_mappings: {
                files: [{
                    expand: true,
                    cwd: 'src/',
                    src: ['**/*.js'],
                    dest: 'build',
                    ext: '.js'
                }, {
                    expand: true,
                    cwd: 'models/',
                    src: ['**/*.js'],
                    dest: 'build/models',
                    ext: '.js'
                }, {
                    expand: true,
                    cwd: 'routes/',
                    src: ['**/*.js'],
                    dest: 'build/routes',
                    ext: '.js'
                }]
            }
        },
        img: {

            task1: {
                src: 'uploads',
                dest: 'build/images/uploads'
            },

            task2: {
                src: 'src/imgs',
                dest: 'build/images/src'
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    // grunt.loadNpmTasks('grunt-contrib-imagemin');
    grunt.loadNpmTasks('grunt-img');
    // Default task(s).
    grunt.registerTask('default', ['jshint']);
    grunt.registerTask('minify', ['uglify']);
    grunt.registerTask('compressImages', ['img']);

};