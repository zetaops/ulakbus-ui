module.exports = function (grunt) {

    require('time-grunt')(grunt);
    require('jit-grunt')(grunt, {
        nggettext_extract: 'grunt-angular-gettext',
        nggettext_compile: 'grunt-angular-gettext'
    });

    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        uglify: {
            dist: {
                options: {
                    banner: '/*! <%= pkg.name %> <%= grunt.branchname %> <%= grunt.template.today("yyyy-mm-dd") %> */\n',
                    mangle: false
                },
                files: {
                    'dist/app.js': ['dist/app.js'],
                    'dist/bower_components/components.js': ['dist/bower_components/components.js']
                }
            },
            branch: {
                options: {
                    banner: '/*! <%= pkg.name %> <%= grunt.branchname %> <%= grunt.template.today("yyyy-mm-dd") %>' +
                    ' */\n',
                    mangle: false
                },
                files: {
                    'dist/<%= grunt.branchname %>/app.js': ['dist/app.js'],
                    'dist/<%= grunt.branchname %>/bower_components/components.js': ['dist/bower_components/components.js']
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
                    var mname = moduleName.replace('../app/', '');
                    mname = mname.replace('components/', '/components/');
                    return mname;
                }
            },
            prod: {
                src: ['app/components/**/*.html', 'app/shared/templates/**/*.html'],
                dest: 'dist/templates.js'
            },
            prod_bap:{
                src: ['app/components/bapComponents/*.html', 'app/shared/templates/**/*.html'],
                dest: 'dist/bapTemplates.js'
            },
            prod_branch: {
                src: ['app/components/**/*.html'],
                dest: 'dist/<%= grunt.branchname %>/templates.js'
            },
            dev: {
                src: ['app/components/**/*.html', 'app/shared/templates/**/*.html'],
                dest: 'app/tmp/templates.js'
            }
        },
        copy: {
            prod: {
                files: [
                    {expand: true, cwd: 'app/bower_components/font-awesome/fonts/', src: '*', dest: 'dist/fonts/', flatten: true, filter: 'isFile'},
                    {expand: true, cwd: 'app/img/', src: '**/*', dest: 'dist/img/', flatten: false},
                    {expand: true, cwd: 'app/styles/roboto/', src: '**/*', dest: 'dist/css/roboto/', flatten: false},
                    {expand: true, cwd: 'app/styles/', src: 'jquery-ui.min.css', dest: 'dist/css/', flatten: true},
                    {expand: true, cwd: 'app/styles/images/', src: '**/*', dest: 'dist/css/images/', flatten: true},
                    {expand: true, cwd: 'app/bower_components/bootstrap/dist/fonts/', src: '*', dest: 'dist/fonts/', flatten: true, filter: 'isFile'},
                    {expand: true, cwd: 'app/bower_components/jquery/dist/', src: 'jquery.min.js', dest: 'dist/bower_components/', flatten: true, filter: 'isFile'},
                    {expand: true, cwd: 'app/bower_components/angular/', src: 'angular.js', dest: 'dist/bower_components/', flatten: true, filter: 'isFile'},
                    {expand: true, cwd: 'app/bower_components/angular-ui-grid/', src: 'ui-grid.woff', dest: 'dist/css/', flatten: true, filter: 'isFile'},
                    {expand: true, cwd: 'app/bower_components/angular-ui-grid/', src: 'ui-grid.ttf', dest: 'dist/css/', flatten: true, filter: 'isFile'}
                ]
            },
            local_prod: {
                files: [
                    {expand: true, cwd: 'app/bower_components/font-awesome/fonts/', src: '*', dest: 'dist/fonts/', flatten: true, filter: 'isFile'},
                    {expand: true, cwd: 'app/img/', src: '**/*', dest: 'dist/img/', flatten: true, filter: 'isFile'},
                    {expand: true, cwd: 'app/styles/roboto/', src: '**/*', dest: 'dist/css/roboto/', flatten: false},
                    {expand: true, cwd: 'app/styles/', src: 'jquery-ui.min.css', dest: 'dist/css/', flatten: true},
                    {expand: true, cwd: 'app/styles/images/', src: '**/*', dest: 'dist/css/images/', flatten: true},
                    {expand: true, cwd: 'app/bower_components/bootstrap/dist/fonts/', src: '*', dest: 'dist/fonts/', flatten: true, filter: 'isFile'},
                    {expand: true, cwd: 'app/bower_components/jquery/dist/', src: 'jquery.min.js', dest: 'dist/bower_components/', flatten: true, filter: 'isFile'},
                    {expand: true, cwd: 'app/bower_components/angular/', src: 'angular.js', dest: 'dist/bower_components/', flatten: true, filter: 'isFile'}
                ]
            },
            for_api_docs: {
                files: [
                    {expand: true, cwd: "app/", src: "app.js", dest: "api-docs-source/"},
                    {expand: true, cwd: "app/zetalib/", src: "interceptors.js", dest: "api-docs-source/"},
                    {expand: true, cwd: "app/zetalib/", src: "form-service.js", dest: "api-docs-source/"},
                    {expand: true, cwd: "app/shared/", src: "directives.js", dest: "api-docs-source/"},
                    {expand: true, cwd: "app/components/auth/", src: "auth_controller.js", dest: "api-docs-source/"},
                    {expand: true, cwd: "app/components/auth/", src: "auth_service.js", dest: "api-docs-source/"},
                    {expand: true, cwd: "app/components/crud/", src: "crud_controller.js", dest: "api-docs-source/"}
                ]
            }
        },
        concat: {
            options: {
                separator: '\n\n'
            },
            js: {
                //TODO: name controller directives services and properly and select files by type. i.e. **/*Service.js **/*Controller.js
                src: [
                    "dist/app.js",
                    "app/app_routes.js",
                    "app/shared/directives.js",
                    "app/zetalib/**/!(*_test*).js",
                    "app/components/**/!(*_test*).js"
                ],
                nonull: true,
                dest: 'dist/app.js'
            },
            bap_js: {
                src: [
                    "app/bap/bap.js",
                    "app/bap/bap_routes.js",
                    "app/bap/controller/*.js",
                    "app/bap/directive/*.js",
                    "app/bap/service/*.js"
                ],
                nonull: true,
                dest: 'dist/bap/bap.js'
            },
            components: {
                src: [
                    "app/bower_components/angular-i18n/angular-locale_tr.js",
                    "app/bower_components/bootstrap/dist/js/bootstrap.js",
                    "app/bower_components/angular-route/angular-route.js",
                    "app/bower_components/angular-cookies/angular-cookies.js",
                    "app/bower_components/angular-resource/angular-resource.js",
                    "app/bower_components/angular-bootstrap/ui-bootstrap.js",
                    "app/bower_components/angular-bootstrap/ui-bootstrap-tpls.js",
                    "app/bower_components/showdown/dist/showdown.min.js",
                    "app/bower_components/angular-markdown-filter/markdown.js",
                    "app/bower_components/angular-sanitize/angular-sanitize.js",
                    "app/bower_components/tv4/tv4.js",
                    "app/bower_components/objectpath/lib/ObjectPath.js",
                    "app/bower_components/angular-schema-form/dist/schema-form.js",
                    "app/bower_components/angular-schema-form/dist/bootstrap-decorator.js",
                    "app/bower_components/angular-gettext/dist/angular-gettext.js",
                    "app/bower_components/json3/lib/json3.js",
                    "app/bower_components/angular-loading-bar/build/loading-bar.js",
                    "app/bower_components/metisMenu/dist/metisMenu.js",
                    "app/bower_components/Chart.js/Chart.js",
                    "app/bower_components/intro.js/intro.js",
                    "app/bower_components/moment/min/moment.min.js",
                    "app/bower_components/toastr/toastr.min.js",
                    "app/bower_components/angular-websocket/dist/angular-websocket.min.js",
                    "app/bower_components/angular-ui-select/dist/select.min.js",
                    "app/bower_components/angular-moment/angular-moment.min.js",
                    "app/bower_components/moment-range/dist/moment-range.min.js",
                    "app/bower_components/angular-ui-tree/dist/angular-ui-tree.min.js",
                    "app/bower_components/angular-gantt/dist/angular-gantt.min.js",
                    "app/bower_components/angular-gantt/dist/angular-gantt-plugins.min.js",
                    "app/bower_components/angular-ui-grid/ui-grid.min.js"
                ],
                dest: 'dist/bower_components/components.js'
            },
            bapComponents: {
                src: [
                    "app/bower_components/jquery/dist/jquery.min.js",
                    "app/bower_components/angular/angular.js",
                    "app/bower_components/angular-i18n/angular-locale_tr.js",
                    "app/bower_components/bootstrap/dist/js/bootstrap.min.js",
                    "app/bower_components/angular-route/angular-route.min.js",
                    "app/bower_components/angular-cookies/angular-cookies.min.js",
                    "app/bower_components/angular-bootstrap/ui-bootstrap-tpls.min.js",
                    "app/bower_components/showdown/dist/showdown.js",
                    "app/bower_components/angular-markdown-filter/markdown.js",
                    "app/bower_components/angular-sanitize/angular-sanitize.min.js",
                    "app/bower_components/tv4/tv4.js",
                    "app/bower_components/objectpath/lib/ObjectPath.js",
                    "app/bower_components/angular-schema-form/dist/schema-form.js",
                    "app/bower_components/moment/min/moment.min.js",
                    "app/bower_components/toastr/toastr.min.js",
                    "app/bower_components/angular-ui-select/dist/select.min.js"
                ],
                dest: 'dist/bower_components/bapComponents.js'
            },
            css: {
                files: {
                    'dist/css/app.css': [
                        "app/bower_components/angular-bootstrap/ui-bootstrap-csp.css",
                        "app/bower_components/bootstrap/dist/css/bootstrap.min.css",
                        "app/app.css",
                        "app/bower_components/metisMenu/dist/metisMenu.min.css",
                        "app/bower_components/angular-loading-bar/build/loading-bar.min.css",
                        "app/bower_components/font-awesome/css/font-awesome.min.css",
                        "app/bower_components/intro.js/intro.css",
                        "app/bower_components/intro.js/themes/introjs-nassim.css",
                        "app/bower_components/toastr/toastr.min.css",
                        "app/bower_components/angular-ui-select/dist/select.min.css",
                        "app/bower_components/angular-ui-tree/dist/angular-ui-tree.min.css",
                        "app/bower_components/angular-gantt/dist/angular-gantt.min.css",
                        "app/bower_components/angular-gantt/dist/angular-gantt-plugins.min.css",
                        "app/bower_components/angular-ui-grid/ui-grid.min.css"
                    ]
                }
            },
            bap_css: {
                files: {
                    'dist/css/bap.css': [
                        "app/bower_components/angular-bootstrap/ui-bootstrap-csp.css",
                        "app/bower_components/bootstrap/dist/css/bootstrap.min.css",
                        "app/app.css",
                        "app/bower_components/metisMenu/dist/metisMenu.min.css",
                        "app/bower_components/font-awesome/css/font-awesome.min.css",
                        "app/bower_components/intro.js/intro.css",
                        "app/bower_components/intro.js/themes/introjs-nassim.css",
                        "app/bower_components/toastr/toastr.min.css",
                        "app/bower_components/angular-ui-select/dist/select.min.css",
                        "app/bap/bap.css"
                    ]
                }
            },
            js_branch: {
                src: [
                    'app/app.js',
                    'app/app_routes.js',
                    'app/zetalib/**/*service.js',
                    'app/zetalib/general.js',
                    'app/zetalib/interceptors.js',
                    'app/shared/scripts/theme.js',
                    'app/shared/directives.js',
                    'app/components/**/*controller.js',
                    'app/components/**/*service.js',
                    "app/components/messaging/messaging-service.js",
                    "app/components/messaging/messaging.js"
                ],
                dest: 'dist/<%= grunt.branchname %>/app.js'
            },
            components_branch: {
                src: [
                    "app/bower_components/angular-i18n/angular-locale_tr.js",
                    "app/bower_components/angular-route/angular-route.min.js",
                    "app/bower_components/angular-cookies/angular-cookies.min.js",
                    "app/bower_components/angular-resource/angular-resource.min.js",
                    "app/bower_components/angular-bootstrap/ui-bootstrap.min.js",
                    "app/bower_components/angular-bootstrap/ui-bootstrap-tpls.min.js",
                    "app/bower_components/angular-sanitize/angular-sanitize.min.js",
                    "app/bower_components/tv4/tv4.js",
                    "app/bower_components/objectpath/lib/ObjectPath.js",
                    "app/bower_components/angular-schema-form/dist/schema-form.min.js",
                    "app/bower_components/angular-schema-form/dist/bootstrap-decorator.min.js",
                    "app/bower_components/angular-schema-form-datepicker/bootstrap-datepicker.min.js",
                    "app/bower_components/angular-gettext/dist/angular-gettext.min.js",
                    "app/bower_components/json3/lib/json3.min.js",
                    "app/bower_components/angular-loading-bar/build/loading-bar.min.js",
                    "app/bower_components/metisMenu/dist/metisMenu.min.js",
                    "app/bower_components/Chart.js/Chart.min.js",
                    "app/bower_components/intro.js/minified/intro.min.js",
                    "app/bower_components/moment/min/moment.min.js",
                    "app/bower_components/angular-websocket/dist/angular-websocket.min.js",
                    "app/bower_components/angular-ui-select/dist/select.min.js",
                    "app/bower_components/angular-moment/angular-moment.min.js",
                    "app/bower_components/moment-range/dist/moment-range.min.js",
                    "app/bower_components/angular-ui-tree/dist/angular-ui-tree.min.js",
                    "app/bower_components/angular-gantt/dist/angular-gantt.min.js",
                    "app/bower_components/angular-gantt/dist/angular-gantt-plugins.min.js",
                    "app/bower_components/angular-ui-grid/ui-grid.min.js"
                ],
                dest: 'dist/<%= grunt.branchname %>/bower_components/components.js'
            },
            bap_components_branch :{
                src: [
                    "app/bower_components/angular-i18n/angular-locale_tr.js",
                    "app/bower_components/angular-route/angular-route.min.js",
                    "app/bower_components/angular-cookies/angular-cookies.min.js",
                    "app/bower_components/angular-resource/angular-resource.min.js",
                    "app/bower_components/angular-bootstrap/ui-bootstrap.min.js",
                    "app/bower_components/angular-bootstrap/ui-bootstrap-tpls.min.js",
                    "app/bower_components/angular-sanitize/angular-sanitize.min.js",
                    "app/bower_components/tv4/tv4.js",
                    "app/bower_components/objectpath/lib/ObjectPath.js",
                    "app/bower_components/angular-schema-form/dist/schema-form.min.js",
                    "app/bower_components/angular-schema-form/dist/bootstrap-decorator.min.js",
                    "app/bower_components/angular-schema-form-datepicker/bootstrap-datepicker.min.js",
                    "app/bower_components/angular-gettext/dist/angular-gettext.min.js",
                    "app/bower_components/json3/lib/json3.min.js",
                    "app/bower_components/angular-loading-bar/build/loading-bar.min.js",
                    "app/bower_components/metisMenu/dist/metisMenu.min.js",
                    "app/bower_components/Chart.js/Chart.min.js",
                    "app/bower_components/intro.js/minified/intro.min.js",
                    "app/bower_components/moment/min/moment.min.js",
                    "app/bower_components/angular-websocket/dist/angular-websocket.min.js",
                    "app/bower_components/angular-ui-select/dist/select.min.js",
                    "app/bower_components/angular-moment/angular-moment.min.js",
                    "app/bower_components/moment-range/dist/moment-range.min.js",
                    "app/bower_components/angular-ui-tree/dist/angular-ui-tree.min.js",
                    "app/bower_components/angular-gantt/dist/angular-gantt.min.js",
                    "app/bower_components/angular-gantt/dist/angular-gantt-plugins.min.js",
                    "app/bower_components/angular-ui-grid/ui-grid.min.js"
                ],
                dest: 'dist/<%= grunt.branchname %>/bower_components/bapComponents.js'
            },
            css_branch: {
                src: [
                    "app/bower_components/angular-bootstrap/ui-bootstrap-csp.css",
                    "app/bower_components/bootstrap/dist/css/bootstrap.min.css",
                    "app/app.css",
                    "app/bower_components/metisMenu/dist/metisMenu.min.css",
                    "app/bower_components/angular-loading-bar/build/loading-bar.min.css",
                    "app/bower_components/font-awesome/css/font-awesome.min.css",
                    "app/bower_components/intro.js/minified/intro.min.css",
                    "app/bower_components/intro.js/themes/introjs-nassim.css"
                ],
                dest: 'dist/<%= grunt.branchname %>/css/app.css'
            },
            docs: {
                src: ['docs/templates/index_head', 'docs/html/partials/api/**/*.html', 'docs/templates/index_tail'],
                dest: 'docs/html/partials/api/index.html'
            },
            docs_list: {
                src: ['docs/html/partials/api/**/index.html'],
                dest: 'docs/html/partials/api/list.html'
            }
        },
        watch: {
            dev: {
                files: ['app/**/*.js', 'app/**/**/*.js', 'app/components/**/*.html', 'app/main.html', 'Gruntfile.js', '!app/tmp/*.js', '!app/app.js'],
                tasks: ['env:dev', 'preprocess:dev', 'html2js:dev', 'default', 'watch:dev'],
                options: {
                    atBegin: false
                }
            },
            local_prod: {
                files: ['app/**/*.js', 'app/components/**/*.html', 'app/main.html', 'Gruntfile.js', '!app/tmp/*.js', '!app/app.js'],
                tasks: ['env:prod', 'preprocess:prod', 'nggettext_compile', 'concat:js', 'concat:bap_js', 'concat:css', 'concat:bap_css', 'concat:components', 'concat:bapComponents',  'copy:local_prod', 'html2js:prod', 'html2js:prod_bap', 'uglify:dist'],
                options: {
                    atBegin: false
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
            },
            branch: {
                files: {
                    'dist/<%= grunt.branchname %>/shared/translations.js': ['po/*.po']
                }
            }
        },
        env: {
            options: {},
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
            },
            prod_server: {
                options: {
                    port: 8080,
                    base: 'dist'
                }
            }
        },
        preprocess: {
            dev: {
                files: {
                    'app/index.html': 'app/main.html',
                    'app/app.js': 'app/main.js',
                    'app/bap/index.html': 'app/bap/main.html',
                    'app/bap/bap.js': 'app/bap/main.js'
                }
            },
            prod: {
                files: {
                    'dist/index.html': 'app/main.html',
                    'dist/app.js': 'app/main.js',
                    'dist/bap/index.html': 'app/bap/main.html',
                    'dist/bap/bap.js': 'app/bap/main.js'
                },
                options: {
                    context: {
                        name: '<%= pkg.name %>',
                        version: '<%= pkg.version %>',
                        now: '<%= grunt.template.today("yyyymmddHHMM") %>',
                        ver: '<%= pkg.version %>'
                    }
                }
            },
            prod_branch: {
                files: {
                    'dist/<%= grunt.branchname %>/index.html': 'app/main.html',
                    'dist/<%= grunt.branchname %>/app.js': 'app/main.js'
                },
                options: {
                    context: {
                        name: '<%= pkg.name %>',
                        version: '<%= pkg.version %>',
                        now: '<%= grunt.template.today("yyyymmddHHMM") %>',
                        ver: '<%= pkg.version %>'
                    }
                }
            }
        },

        jsdoc: {
            dist: {
                src: [
                    "app/app.js",
                    "app/zetalib/interceptors.js",
                    "app/zetalib/form-service.js",
                    "app/shared/directives.js",
                    "app/components/auth/auth_controller.js",
                    "app/components/auth/auth_service.js",
                    "app/components/crud/crud_controller.js"
                ],
                options: {
                    destination: 'docs/html',
                    configure: 'node_modules/angular-jsdoc/common/conf.json',
                    template: 'node_modules/angular-jsdoc/angular-template',
                    //tutorial: 'tutorials',
                    readme: './docs/DOCS.md'
                }
            }
        },

        mrdoc: {
            custom: {
                src: 'api-docs-source',
                target: 'api-docs',
                options: {
                    title: 'Ulakbus UI',
                    readme: './docs/DOCS.md'
                    //theme: 'cayman'
                }
            }
        }
    });

    grunt.registerTask('dev', ['env:dev', 'preprocess:dev', 'html2js:dev', 'default']);
    grunt.registerTask('test', ['bower', 'karma:continuous']);
    grunt.registerTask('api-docs', ['copy:for_api_docs', 'mrdoc']);
    grunt.registerTask('i18n', ['nggettext_extract', 'nggettext_compile']);
    grunt.registerTask('local_prod', ['bower', 'env:prod', 'preprocess:prod', 'nggettext_compile', 'concat:js', 'concat:bap_js', 'concat:css', 'concat:bap_css', 'concat:components', 'concat:bapComponents', 'copy:local_prod', 'html2js:prod', 'html2js:prod_bap', 'uglify:dist', 'connect:prod_server', 'watch:local_prod']);
    grunt.registerTask('default', ['bower', 'env:prod', 'preprocess:prod', 'nggettext_compile', 'concat:js', 'concat:bap_js', 'concat:css', 'concat:bap_css', 'concat:components', 'concat:bapComponents', 'copy:prod', 'html2js:prod', 'html2js:prod_bap', 'uglify:dist']);
    grunt.registerTask('branch', '', function () {
        // get branch name
        var branch = require('git-branch');
        grunt.branchname = branch.sync();
        grunt.task.run([
            'bower',
            'nggettext_compile:branch',
            'concat:js_branch',
            'concat:css_branch',
            'concat:components_branch',
            'concat:bap_components_branch',
            'copy:prod',
            'env:prod',
            'preprocess:prod_branch',
            'html2js:prod_branch',
            'uglify:branch'
        ]);
    });
};
