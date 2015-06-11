/**
 * Copyright (C) 2015 ZetaOps Inc.
 *
 * This file is licensed under the GNU General Public License v3
 * (GPLv3).  See LICENSE.txt for details.
 */

'use strict';

// Declare app level module which depends on views, and components
angular.module(
    'zaerp', [
        'ngRoute',
        'ngSanitize',
        'ngAnimate',
        'ngQuantum',
        'general',
        'formGenerator',
        'zaerp.dashboard',
        'zaerp.login',
        'zaerp.version',
        'zaerp.test',
        'schemaForm'
    ]).
    config(['$routeProvider', function ($routeProvider) {
        $routeProvider
            .when('/login', {
                templateUrl: 'login/login.html',
                controller: 'LoginCtrl'
            })
            .when('/dashboard', {
                templateUrl: 'dashboard/dashboard.html',
                controller: 'DashCtrl'
            })
            .otherwise({redirectTo: '/dashboard'});
    }]).
    run(function ($rootScope, $location) {
        $rootScope.$on("$routeChangeStart", function (event, next, current) {
            if ($rootScope.loggedInUser == null) {
                // no logged user, redirect to /login
                console.log("test log");
                if (next.templateUrl === "login/login.html") {
                    console.log("test log to login");
                } else {
                    console.log("test log logged");
                    $location.path("/login");
                }
            }
        });
    }).
    constant("RESTURL", (function(){
        var dev = "http://127.0.0.1:3000/api/";
        var prod = "";
        var ENV = "dev"; // change to prod in production
        return ENV =="dev" ? {url:dev} : {url:prod};
        return "http://127.0.0.1:3000/api/";
    })()).
    constant("USER_ROLES", {
        all: "*",
        admin: "admin",
        editor: "editor",
        guest: "guest"
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
