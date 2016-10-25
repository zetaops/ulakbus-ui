exports.config = {
    allScriptsTimeout: 11000,

    specs: [
        '*.js'
    ],

    capabilities: {
        'browserName': 'chrome',
        'chromeOptions': {
            'args': ['show-fps-counter=true']
        }
    },


    baseUrl: 'http://localhost:8080/',

    framework: 'jasmine',

    jasmineNodeOpts: {
        defaultTimeoutInterval: 30000
    }

};
