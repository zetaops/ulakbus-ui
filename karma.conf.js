/**
 * Copyright (C) 2015 ZetaOps Inc.
 *
 * This file is licensed under the GNU General Public License v3
 * (GPLv3).  See LICENSE.txt for details.
 */

module.exports = function (config) {
    config.set({

        basePath: './',

        files: [
            'app/bower_components/angular/angular.js',
            'app/bower_components/oclazyload/dist/ocLazyLoad.min.js',
            'app/bower_components/angular-cookies/angular-cookies.min.js',
            'app/bower_components/angular-route/angular-route.js',
            'app/bower_components/angular-resource/angular-resource.js',
            'app/bower_components/angular-sanitize/angular-sanitize.min.js',
            'app/bower_components/tv4/tv4.js',
            'app/bower_components/objectpath/lib/ObjectPath.js',
            'app/bower_components/angular-schema-form/dist/schema-form.js',
            'app/bower_components/angular-schema-form/dist/bootstrap-decorator.min.js',
            'app/bower_components/angular-mocks/angular-mocks.js',
            'app/app.js',
            'app/app_routes.js',
            'app/zetalib/**/*.js',
            'app/components/**/*.js'
        ],

        autoWatch: true,

        frameworks: ['jasmine'],

        browsers: ['PhantomJS', 'PhantomJS_custom'],

        customLaunchers: {
            'PhantomJS_custom': {
                base: 'PhantomJS',
                options: {
                    windowName: 'my-window',
                    settings: {
                        webSecurityEnabled: false
                    },
                },
                flags: ['--load-images=true'],
                debug: true
            }
        },

        phantomjsLauncher: {
            // Have phantomjs exit if a ResourceError is encountered (useful if karma exits without killing phantom)
            exitOnResourceError: true
        },

        plugins: [
            'karma-phantomjs-launcher',
            'karma-jasmine',
            'karma-junit-reporter',
            'karma-coverage'
        ],

        junitReporter: {
            outputFile: 'test_out/unit.xml',
            suite: 'unit'
        },

        reporters: ['progress', 'coverage'],

        preprocessors: {
            'app/app.js': ['coverage'],
            'app/components/**/*.js': ['coverage'],
            'app/zetalib/**/*.js': ['coverage']
        },

        coverageReporter: {
            type : 'html',
            dir : 'coverage/'
        }

    });
};
