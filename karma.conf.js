module.exports = function (config) {
    config.set({

        basePath: './',

        files: [
            'app/bower_components/angular/angular.js',
            'app/bower_components/angular-route/angular-route.js',
            'app/bower_components/angular-resource/angular-resource.js',
            'app/bower_components/angular-sanitize/angular-sanitize.min.js',
            'app/bower_components/tv4/tv4.js',
            'app/bower_components/objectpath/lib/ObjectPath.js',
            'app/bower_components/angular-schema-form/dist/schema-form.js',
            'app/bower_components/angular-schema-form/dist/bootstrap-decorator.min.js',
            'app/bower_components/angular-mocks/angular-mocks.js',
            'app/app.js',
            'app/components/**/*.js',
            'app/login/*.js',
            'app/dashboard/*.js'
        ],

        preprocessors: {
            //'app/app.js': 'coverage',
            'app/components/**/*.js': 'coverage',
            'app/login/*.js': 'coverage',
            'app/dashboard/*.js': 'coverage'
        },

        reporters: ['coverage'],

        autoWatch: true,

        frameworks: ['jasmine'],

        browsers: ['ChromeCanary'],

        plugins: [
            'karma-chrome-launcher',
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
