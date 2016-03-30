'use strict';

angular.module('ulakbus')
    .config(['$routeProvider', function ($routeProvider, $route) {
        $routeProvider
            .when('/login', {
                templateUrl: 'components/auth/login.html',
                controller: 'LoginController'
            })
            .when('/dashboard', {
                templateUrl: 'components/dashboard/dashboard.html',
                controller: 'DashController'
            })
            .when('/dev/settings', {
                templateUrl: 'components/devSettings/devSettings.html',
                controller: 'DevSettingsController'
            })
            .when('/debug/list', {
                templateUrl: 'components/debug/debug.html',
                controller: 'DebugController'
            })
            .when('/admin/bpmnmanager', {
                templateUrl: 'components/admin/bpmn_manager.html',
                controller: 'BpmnManagerController'
            })
            .when('/newdesigns', {
                templateUrl: 'components/uitemplates/base.html',
                controller: 'NewDesignsCtrl'
            })

            // use crud without selected user
            // important: regex urls must be defined later than static ones
            .when('/:wf/', {
                templateUrl: 'components/crud/templates/crud-preload.html',
                controller: 'CRUDController'
            })
            .when('/:wf/do/:cmd', {
                templateUrl: 'components/crud/templates/crud.html',
                controller: 'CRUDListFormController'
            })
            .when('/:wf/do/:cmd/:key', {
                templateUrl: 'components/crud/templates/crud.html',
                controller: 'CRUDListFormController'
            })
            .when('/:wf/:model', {
                templateUrl: 'components/crud/templates/crud-preload.html',
                controller: 'CRUDController'
            })
            .when('/:wf/:model/do/:cmd', {
                templateUrl: 'components/crud/templates/crud.html',
                controller: 'CRUDListFormController'
            })
            .when('/:wf/:model/do/:cmd/:key', {
                templateUrl: 'components/crud/templates/crud.html',
                controller: 'CRUDListFormController'
            })

            .otherwise({redirectTo: '/dashboard'});
    }])
    .run(function ($rootScope) {

        $rootScope.loggedInUser = true;
        $rootScope.loginAttempt = 0;
        $rootScope.websocketIsOpen = false;
        $rootScope.current_user = true;
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