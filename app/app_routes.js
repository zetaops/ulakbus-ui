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
        .when('/student/add', {
            templateUrl: 'components/student/student_add_template.html',
            controller: 'StudentAddEditCtrl'
        })
        .when('/student/edit/:id', {
            templateUrl: 'components/student/student_add_template.html',
            controller: 'StudentAddEditCtrl'
        })
        .when('/students', {
            templateUrl: 'components/student/student_list_template.html',
            controller: 'StudentListCtrl'
        })
        .when('/student/:id', {
            templateUrl: 'components/student/student_list_template.html',
            controller: 'StudentShowCtrl'
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
}]).run(function ($rootScope, $location, $cookies) {
    /**
     * todo: below session id is temporary session_id
     * the login logic will be finished when backend complete
     *
     */

    $rootScope.loggedInUser ? $rootScope.loggedInUser : false;
    $rootScope.$on("$routeChangeStart", function (event, next, current) {
        if ($rootScope.loggedInUser == null) {
            // no logged user, redirect to /login
            if (next.templateUrl === "login/login.html") {

            } else {
                $location.path("/login");
            }
        }
    });
}).config(['$httpProvider', function($httpProvider) {
    // to send cookies CORS
    $httpProvider.defaults.withCredentials = true;
}]).run(function (gettextCatalog) {
    gettextCatalog.setCurrentLanguage('tr');
    gettextCatalog.debug = true;
});