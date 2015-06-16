/**
 * Copyright (C) 2015 ZetaOps Inc.
 *
 * This file is licensed under the GNU General Public License v3
 * (GPLv3).  See LICENSE.txt for details.
 */

'use strict';

angular.module(
    'zaerp', [
        'oc.lazyLoad',
        'ngRoute',
        'ngSanitize',
        'ngCookies',
        //'ngAnimate',
        //'ngQuantum',
        //'general',
        //'formGenerator',
        //'zaerp.dashboard',
        //'zaerp.login',
        //'zaerp.version',
        //'zaerp.test',
        //'schemaForm'
    ]).
/**
 *  lazyload modules with oclazyload
 *  the lines below are config of oclazyload
 *  turn debug false when production
 */
    config(['$ocLazyLoadProvider', function($ocLazyLoadProvider) {
        $ocLazyLoadProvider.config({
            // todo: turn debug false on prod
            debug: true
        });
    }]).
    config(['$routeProvider', function ($routeProvider) {
        $routeProvider
            .when('/login', {
                templateUrl: 'login/login.html',
                controller: 'LoginCtrl',
                resolve: {
                    loadMyCtrl: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load('login/login.js');
                    }],
                    loadMyService: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load('login/login_service.js');
                    }]
                }
            })
            .when('/dashboard', {
                templateUrl: 'dashboard/dashboard.html',
                controller: 'DashCtrl',
                resolve: {
                    loadMyCtrl: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load('dashboard/dashboard.js');
                    }]
                }
            })
            .when('/student_add', {
                templateUrl: 'student/student_add_template.html',
                controller: 'StudentAddCtrl',
                resolve: {
                    loadMyCtrl: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load('student/student_add.js');
                    }]
                }
            })
            .otherwise({redirectTo: '/dashboard'});
    }]).
    run(function ($rootScope, $location, $cookies) {
        /**
         * todo: below session id is temporary session_id
         * the login logic will be finished when backend complete
         *
          */

        var sessionId = $cookies.get('session');
        $rootScope.loggedInUser = sessionId ? true : false;
        $rootScope.$on("$routeChangeStart", function (event, next, current) {
            if ($rootScope.loggedInUser == null) {
                // no logged user, redirect to /login
                if (next.templateUrl === "login/login.html") {
                    console.log("test log to login");
                } else {
                    console.log("test log logged");
                    $location.path("/login");
                }
            }
        });
    }).
/**
 * RESTURL is the url of rest api to talk
 * Based on the environment it changes from dev to prod
 */
    constant("RESTURL", (function(){
        var dev = "http://127.0.0.1:3000/api/";
        var prod = "";
        var ENV = "dev"; // change to prod in production
        return ENV =="dev" ? {url:dev} : {url:prod};
        //return "http://127.0.0.1:3000/api/";
    })()).
/**
 * USER_ROLES and AUTH_EVENTS are constant for auth functions
 */
    constant("USER_ROLES", {
        all: "*",
        admin: "admin",
        student: "student",
        staff: "staff",
        dean: "dean"
    }).
    constant('AUTH_EVENTS', {
        loginSuccess: 'auth-login-success',
        loginFailed: 'auth-login-failed',
        logoutSuccess: 'auth-logout-success',
        sessionTimeout: 'auth-session-timeout',
        notAuthenticated: 'auth-not-authenticated',
        notAuthorized: 'auth-not-authorized'
    });

// test the code with strict di mode to see if it works when minified
//angular.bootstrap(document, ['zaerp'], {
//    strictDi: true
//});
