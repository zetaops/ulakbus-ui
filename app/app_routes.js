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
            templateUrl: 'components/crud/templates/form.html',
            controller: 'CRUDCtrl'
        })
        .when('/:wf/list', {
            templateUrl: 'components/crud/templates/list.html',
            controller: 'CRUDListCtrl'
        })
        .when('/:wf/form', {
            templateUrl: 'components/crud/templates/form.html',
            controller: 'CRUDFormCtrl'
        })
        .when('/:wf/form/:key', {
            templateUrl: 'components/crud/templates/form.html',
            controller: 'CRUDFormCtrl'
        })
        .when('/:wf/show/:key', {
            templateUrl: 'components/crud/templates/show.html',
            controller: 'CRUDShowCtrl'
        })
        .when('/:wf/:model', {
            templateUrl: 'components/crud/templates/form.html',
            controller: 'CRUDCtrl'
        })
        .when('/:wf/:model/list', {
            templateUrl: 'components/crud/templates/list.html',
            controller: 'CRUDListCtrl'
        })
        .when('/:wf/:model/form', {
            templateUrl: 'components/crud/templates/form.html',
            controller: 'CRUDFormCtrl'
        })
        .when('/:wf/:model/form/:key', {
            templateUrl: 'components/crud/templates/form.html',
            controller: 'CRUDFormCtrl'
        })
        .when('/:wf/:model/show/:key', {
            templateUrl: 'components/crud/templates/show.html',
            controller: 'CRUDShowCtrl'
        })
        .otherwise({redirectTo: '/dashboard'});
}])
    .run(function ($rootScope) {

        $rootScope.loggedInUser = true;
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