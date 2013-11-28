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
        },
        requirejs: {
            compile: {
                options: {
                    findNestedDependencies: true,
                    baseUrl: "src/js",
                    mainConfigFile: "src/js/main.js",
                    dir: "build/requirejs",
                    modules: [{
                        name: "views/greetings/admin/greetingsAdmin",
                        exclude: [
                            'template!'
                        ]
                    }]
                }
            }
        },
        handlebars: {
            compile: {
                options: {
                    namespace: "JST",
                    amd: true
                },
                files: {
                    "src/templates/templates.js": ["src/templates/**/*.html"]
                }
            }
        },
        recess: {
            dist: {
                files:{
                    'src/bower_components/greetingBootstrap/bootstrap.css':['src/bower_components/greetingBootstrap/bootstrap.less']
                },
                options: {
                    compile: true
                }
            }
        },
        watch: {
            options: {
               livereload: true,
            },
            files: "src/bower_components/greetingBootstrap/*.less",
            tasks: ["recess"]
        }
    });

    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-recess');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-img');
    grunt.loadNpmTasks('grunt-contrib-requirejs');
    grunt.loadNpmTasks('grunt-contrib-handlebars');
    // Default task(s).
    grunt.registerTask('default', ['jshint']);
    grunt.registerTask('minify', ['uglify']);
    grunt.registerTask('compressImages', ['img']);

};