module.exports = function (grunt) {

    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        uglify: {
            dist: {
                options: {
                    banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n',
                    mangle: false
                },
                files: {
                    'dist/app.js': ['dist/app.js'],
                    'dist/bower_components/components.js': ['dist/bower_components/components.js']
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
            options: {
                rename: function (moduleName) {
                    return moduleName.replace('../app/', '');
                }
            },
            prod: {
                src: ['app/components/**/*.html'],
                dest: 'dist/templates.js'
            }
        },
        concat: {
            options: {
                separator: '\n\n'
            },
            js: {
                src: [
                    'app/app.js', 'app/app_routes.js', 'app/zetalib/**/*service.js', 'app/zetalib/general.js', 'app/zetalib/interceptors.js', 'app/components/**/*controller.js', 'app/components/**/*service.js'],
                dest: 'dist/app.js'
            },
            components: {
                src: [
                    'app/bower_components/angular/angular.js',
                    'app/bower_components/angular-route/angular-route.js',
                    'app/bower_components/angular-cookies/angular-cookies.js',
                    'app/bower_components/angular-resource/angular-resource.js',
                    'app/bower_components/angular-bootstrap/ui-bootstrap.js',
                    'app/bower_components/angular-bootstrap/ui-bootstrap-tpls.js',
                    'app/bower_components/angular-sanitize/angular-sanitize.js',
                    'app/bower_components/tv4/tv4.js',
                    'app/bower_components/objectpath/lib/ObjectPath.js',
                    'app/bower_components/angular-schema-form/dist/schema-form.js',
                    'app/bower_components/angular-schema-form/dist/bootstrap-decorator.js',
                    'app/bower_components/angular-schema-form-datepicker/bootstrap-datepicker.js',
                    'app/bower_components/angular-gettext/dist/angular-gettext.js'
                ],
                dest: 'dist/bower_components/components.js'
            },
            css: {
                src: ['app/bower_components/**/**/*.css', 'app/app.css'],
                dest: 'dist/app.css'
            }
        },
        watch: {
            dev: {
                files: ['app/**/*.js', 'app/components/**/*.html'],
                tasks: ['karma:unit', 'html2js:dist', 'concat:dist'],
                options: {
                    atBegin: true
                }
            },
            min: {
                files: ['app/**/*.js', 'index.html', 'app/components/**/*.html'],
                tasks: ['karma:unit', 'html2js:dist', 'concat:dist', 'uglify:dist'],
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
            }
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
        },
        env: {

            options: {

                /* Shared Options Hash */
                //globalOption : 'foo'

            },

            dev: {

                NODE_ENV: 'DEVELOPMENT'

            },

            prod: {

                NODE_ENV: 'PRODUCTION'

            }

        },
        connect: {
            server: {
                options: {
                    port: 8080,
                    base: 'app'
                }
            }
        },
        preprocess : {

            dev: {

                src: 'index.html',
                dest: 'app/index.html'

            },

            prod: {

                src: 'index.html',
                dest: 'dist/index.html',
                options: {

                    context: {
                        name: '<%= pkg.name %>',
                        version: '<%= pkg.version %>',
                        now: '<%= now %>',
                        ver: '<%= ver %>'
                    }

                }

            }
        }
    });


    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-connect');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-html2js');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-bower-task');
    grunt.loadNpmTasks('grunt-karma');
    grunt.loadNpmTasks('grunt-angular-gettext');
    grunt.loadNpmTasks('grunt-preprocess');
    grunt.loadNpmTasks('grunt-env');

    grunt.registerTask('dev', ['bower', 'env:dev', 'preprocess:dev', 'connect:server', 'watch:dev']);
    grunt.registerTask('test', ['bower', 'karma:continuous']);
    grunt.registerTask('i18n', ['nggettext_extract', 'nggettext_compile']);
    grunt.registerTask('default', [
        'bower',
        'nggettext_extract',
        'nggettext_compile',
        'concat:js',
        'concat:css',
        'concat:components',
        'env:prod',
        'preprocess:prod',
        'html2js:prod',
        'uglify:dist'
    ]);
};