'use strict';

angular.module('ulakbus')
    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider
            .when('/login', {
                templateUrl: '/components/auth/login.html',
                controller: 'LoginController'
            })
            .when('/logout', {
                controller: function (AuthService) {
                    AuthService.logout();
                }
            })
            .when('/dashboard', {
                templateUrl: '/components/dashboard/dashboard.html',
                controller: 'DashController'
            })
            .when('/dev/settings', {
                templateUrl: '/components/devSettings/devSettings.html',
                controller: 'DevSettingsController'
            })
            .when('/debug/list', {
                templateUrl: '/components/debug/debug.html',
                controller: 'DebugController'
            })
            .when('/admin/bpmnmanager', {
                templateUrl: '/components/admin/bpmn_manager.html',
                controller: 'BpmnManagerController'
            })
            .when('/newdesigns', {
                templateUrl: '/components/uitemplates/base.html',
                controller: 'NewDesignsCtrl'
            })
            .when('/formservicepg', {
                templateUrl: '/components/uitemplates/form_service_pg.html',
                controller: 'FormServicePg'
            })
            .when('/gridreport', {
                templateUrl: '/components/gridTable/gridreport.html'
            })
            // use crud without selected user
            // important: regex urls must be defined later than static ones
            .when('/:wf/', {
                templateUrl: '/components/crud/templates/crud-preload.html',
                controller: 'CRUDController'
            })
            //for public pages
            .when('/pub/:wf/', {
                templateUrl: '/components/crud/templates/crud-preload.html',
                controller: 'CRUDController',
                isPublic: true
            })
            .when('/cwf/:wf/:token', {
                templateUrl: '/components/crud/templates/crud.html',
                controller: 'CRUDController'
            })
            .when('/:wf/do/:cmd', {
                templateUrl: '/components/crud/templates/crud.html',
                controller: 'CRUDListFormController'
            })
            //for public pages
            .when('/pub/:wf/do/:cmd', {
                templateUrl: 'components/crud/templates/crud.html',
                controller: 'CRUDListFormController',
                isPublic: true
            })

            .when('/:wf/do/:cmd/:key', {
                templateUrl: '/components/crud/templates/crud.html',
                controller: 'CRUDListFormController'
            })
            .when('/:wf/:model', {
                templateUrl: '/components/crud/templates/crud-preload.html',
                controller: 'CRUDController'
            })
            .when('/:wf/:model/do/:cmd', {
                templateUrl: '/components/crud/templates/crud.html',
                controller: 'CRUDListFormController'
            })
            .when('/:wf/:model/do/:cmd/:key', {
                templateUrl: '/components/crud/templates/crud.html',
                controller: 'CRUDListFormController'
            })
            .otherwise({redirectTo: '/login'});
    }])

    .run(function ($rootScope, AuthService, $location, $window) {
        $rootScope.loggedInUser = false;
        $rootScope.loginAttempt = 0;
        $rootScope.current_user = true;
        //check if page is not a public page
        if(location.hash.indexOf('/pub/') === -1 && $window.sessionStorage.userID === undefined){
            return $location.path('/login');
            //AuthService.check_auth();
        }
        //reset the value of user interaction on form when page refreshes
        $rootScope.isUserClicked = false;

        $rootScope.$on("$routeChangeStart", function (angularEvent, next, current) {
            if ($window.sessionStorage.userID === undefined) {
                return $location.path('/login');
            }
        });
    })
    .config(function ($httpProvider) {
        $httpProvider.interceptors.push(function (){
            return {
                'request': function (config) {
                    if (config.method === "POST") {
                        config.data.callbackID = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
                                    var r = Math.random() * 16 | 0, v = c === 'x' ? r : r & 0x3 | 0x8;
                                    return v.toString(16)
                                });
                    }
                    return config;
                },
                'response': function (response) {
                    return response;
                }
            };
        });

        // to send cookies CORS
        $httpProvider.defaults.withCredentials = true;
    })
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
