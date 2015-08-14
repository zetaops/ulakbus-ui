module.exports = function (grunt) {

    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        uglify: {
            dist: {
                options: {
                    banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
                },
                //build: {
                //    src: 'src/<%= pkg.name %>.js',
                //    dest: 'build/<%= pkg.name %>.min.js'
                //},
                files: {
                    'dist/app.js': ['dist/app.js']
                }
            }
        },
        bower: {
            install: {
                options: {
                    install: true,
                    copy: false,
                    targetDir: './libs',
                    cleanTargetDir: true
                }
            }
        },
        jshint: {
            all: ['Gruntfile.js', 'app/*.js', 'app/**/*.js']
        },
        karma: {
            options: {
                configFile: 'karma.conf.js'
            },
            unit: {
                singleRun: true
            },

            continuous: {
                singleRun: false,
                autoWatch: true
            }
        },
        html2js: {
            dist: {
                src: ['index.html', 'app/components/**/*.html'],
                dest: 'tmp/templates.js'
            }
        },
        concat: {
            options: {
                separator: ';'
            },
            dist: {
                src: ['app/**/*controller.js', 'app/**/*service.js', 'app/zetalib/**/*.js', 'app.js', 'app.routes.js'],
                dest: 'dist/app.js'
            },
            components: {
                src: ['app/bower_components/**/*.min.js'],
                dest: 'dist/bower_components/components.js'
            }
        },
        watch: {
            dev: {
                files: ['Gruntfile.js', 'app/**/*.js', 'index.html', 'app/components/**/*.html'],
                tasks: ['jshint', 'karma:unit', 'html2js:dist', 'concat:dist', 'clean:temp'],
                options: {
                    atBegin: true
                }
            },
            min: {
                files: ['Gruntfile.js', 'app/**/*.js', 'index.html', 'app/components/**/*.html'],
                tasks: ['jshint', 'karma:unit', 'html2js:dist', 'concat:dist', 'clean:temp', 'uglify:dist'],
                options: {
                    atBegin: true
                }
            }
        },
        nggettext_extract: {
            pot: {
                files: {
                    'po/template.pot': ['app/**/*.html']
                }
            },
        },
        nggettext_compile: {
            all: {
                files: {
                    'dist/shared/translations.js': ['po/*.po']
                }
            },
            dev: {
                files: {
                    'app/shared/translations.js': ['po/*.po']
                }
            }
        }
    });

    // Default task(s).
    //grunt.registerTask('default', ['uglify']);

    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-connect');
    grunt.loadNpmTasks('grunt-contrib-compress');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-html2js');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-bower-task');
    grunt.loadNpmTasks('grunt-karma');
    grunt.loadNpmTasks('grunt-angular-gettext');


    // todo: reorganize dev and other tasks
    grunt.registerTask('dev', ['bower', 'connect:server', 'watch:dev']);
    grunt.registerTask('test', ['bower', 'jshint', 'karma:continuous']);
    grunt.registerTask('minified', ['bower', 'connect:server', 'watch:min']);
    grunt.registerTask('extract_i18n', ['nggettext_extract']);
    grunt.registerTask('compile_i18n', ['nggettext_compile']);
    grunt.registerTask('default', [
        'bower',
        'html2js:dist',
        'concat:dist',
        'concat:components',
        'uglify:dist',
        'nggettext_extract',
        'nggettext_compile'
    ]);

};