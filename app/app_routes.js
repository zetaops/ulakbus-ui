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
            .when('/formservicepg', {
                templateUrl: 'components/uitemplates/form_service_pg.html',
                controller: 'FormServicePg'
            })
            // use crud without selected user
            // important: regex urls must be defined later than static ones
            .when('/:wf/', {
                templateUrl: 'components/crud/templates/crud-preload.html',
                controller: 'CRUDController'
            })
            .when('/cwf/:wf/:token', {
                templateUrl: 'components/crud/templates/crud.html',
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
    .factory('IsOnline', function () {
        var isOnlineService = {};
        isOnlineService.status = navigator.onLine;
        isOnlineService.set_status = function (state) {
            isOnlineService.status = state;
        };
        isOnlineService.get_status = function () {
            return isOnlineService.status;
        };
        return isOnlineService;
    })
    .run(function ($window, $rootScope, $document, $route, IsOnline) {
        // in this run configuration we detect internet connection and append a mask to body
        // when reconnect the mask will be removed
        var offlineMask = angular.element('<div class="body-mask">' +
            '</div>');
        offlineMask.css({zIndex: '2010', opacity: '0.6'});
        var offlineAlert = angular.element(
            '<div class="alert alert-danger text-center" role="alert">' +
            'İnternet bağlantınız kesilmiştir. Bağlantı sağlandığında kaldığınız yerden devam edebilirsiniz.' +
            '</div>'
        ).css({zIndex: '2011', position: 'relative'});
        var body = $document.find('body').eq(0);
        // detect internet connection
        var is_online = navigator.onLine;
        if (!is_online){body.append(offlineMask).append(offlineAlert);}
        $window.addEventListener("offline", function () {
            is_online = false;
            IsOnline.set_status(false);
            body.append(offlineMask).append(offlineAlert);
        }, false);

        $window.addEventListener("online", function () {
            is_online = true;
            IsOnline.set_status(true);
            offlineMask.remove();
            offlineAlert.remove();
            if ($rootScope.current_user === true){window.location.reload();}
            // $route.reload();
        }, false);
    })
    .run(function ($rootScope, AuthService) {

        AuthService.check_auth();

        $rootScope.loggedInUser = false;
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