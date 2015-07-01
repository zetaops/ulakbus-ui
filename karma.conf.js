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

        //preprocessors: {
        //    'app/app.js': 'coverage',
        //    'app/components/**/*.js': 'coverage',
        //    'app/zlib/*.js': 'coverage',
        //    'app/login/*.js': 'coverage',
        //    'app/dashboard/*.js': 'coverage'
        //},
        //
        //reporters: ['coverage'],

        autoWatch: true,

        frameworks: ['jasmine'],

        browsers: ['Chrome'],

        plugins: [
            'karma-chrome-launcher',
            'karma-opera-launcher',
            'karma-firefox-launcher',
            'karma-jasmine',
            'karma-junit-reporter',
            'karma-coverage'
        ],

        junitReporter: {
            outputFile: 'test_out/unit.xml',
            suite: 'unit'
        }

    });
};
