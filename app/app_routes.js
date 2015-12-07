'use strict';

app.config(['$routeProvider', function ($routeProvider, $route) {
    $routeProvider
        .when('/login', {
            templateUrl: 'components/auth/login.html',
            controller: 'LoginCtrl'
        })
        .when('/dashboard', {
            templateUrl: 'components/dashboard/dashboard.html',
            controller: 'DashCtrl'
        })
        .when('/dev/settings', {
            templateUrl: 'components/devSettings/devSettings.html',
            controller: 'DevSettingsCtrl'
        })
        .when('/debug/list', {
            templateUrl: 'components/debug/debug.html',
            controller: 'DebugCtrl'
        })

        // use crud without selected user
        // important: regex urls must be defined later than static ones
        .when('/:wf/', {
            templateUrl: 'components/crud/templates/crud.html',
            controller: 'CRUDCtrl'
        })
        .when('/:wf/do/:cmd', {
            templateUrl: 'components/crud/templates/crud.html',
            controller: 'CRUDListFormCtrl'
        })
        .when('/:wf/do/:cmd/:key', {
            templateUrl: 'components/crud/templates/crud.html',
            controller: 'CRUDListFormCtrl'
        })
        .when('/:wf/:model', {
            templateUrl: 'components/crud/templates/crud.html',
            controller: 'CRUDCtrl'
        })
        .when('/:wf/:model/do/:cmd', {
            templateUrl: 'components/crud/templates/crud.html',
            controller: 'CRUDListFormCtrl'
        })
        .when('/:wf/:model/do/:cmd/:key', {
            templateUrl: 'components/crud/templates/crud.html',
            controller: 'CRUDListFormCtrl'
        })

        .otherwise({redirectTo: '/dashboard'});
}])
    .run(function ($rootScope) {

        $rootScope.loggedInUser = true;
        $rootScope.loginAttempt = 0;
        $rootScope.$on("$routeChangeStart", function (event, next, current) {
            // will be used when needed
        });
    })
    .config(['$httpProvider', function ($httpProvider) {
        // to send cookies CORS
        $httpProvider.defaults.withCredentials = true;
    }])
    .run(function (gettextCatalog) {
        gettextCatalog.setCurrentLanguage('tr');
        gettextCatalog.debug = true;
    })
    .config(['cfpLoadingBarProvider', function (cfpLoadingBarProvider) {
        // no need bar on top of the page, set to false
        cfpLoadingBarProvider.includeBar = false;
        // loaderdiv is a placeholder tag for loader in header-sub-menu.html
        cfpLoadingBarProvider.parentSelector = "loaderdiv";
        // loader template will be used when loader initialized
        cfpLoadingBarProvider.spinnerTemplate = '<div class="loader">Loading...</div>';
    }]);