'use strict';

app.config(['$routeProvider', function ($routeProvider) {
    $routeProvider
        .when('/login', {
            templateUrl: 'components/auth/login.html',
            controller: 'LoginCtrl'
        })
        .when('/dashboard', {
            templateUrl: 'components/dashboard/dashboard.html',
            controller: 'DashCtrl'
        })
        .when('/:model/add', {
            templateUrl: 'components/crud/templates/add.html',
            controller: 'CRUDAddEditCtrl'
        })
        .when('/:model/edit/:id', {
            templateUrl: 'components/crud/templates/add.html',
            controller: 'CRUDAddEditCtrl'
        })
        .when('/:model', {
            templateUrl: 'components/crud/templates/list.html',
            controller: 'CRUDListCtrl'
        })
        .when('/:model/:id', {
            templateUrl: 'components/crud/templates/show.html',
            controller: 'CRUDShowCtrl'
        })
        .when('/staff/add', {
            templateUrl: 'components/staff/templates/add.html',
            controller: 'StaffAddEditCtrl'
        })
        .when('/staff/edit/:id', {
            templateUrl: 'components/staff/templates/edit.html',
            controller: 'StaffAddEditCtrl'
        })
        .when('/staffs', {
            templateUrl: 'components/staff/templates/list.html',
            controller: 'StaffListCtrl'
        })
        .when('/staff/:id', {
            templateUrl: 'components/staff/templates/show.html',
            controller: 'StaffShowCtrl'
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