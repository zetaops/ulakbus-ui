/**
 * Copyright (C) 2015 ZetaOps Inc.
 *
 * This file is licensed under the GNU General Public License v3
 * (GPLv3).  See LICENSE.txt for details.
 */

'use strict';

var app = angular.module(
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
    config(['$ocLazyLoadProvider', function ($ocLazyLoadProvider) {
        $ocLazyLoadProvider.config({
            // todo: turn debug false on prod
            debug: false
        });
    }]).
/**
 * RESTURL is the url of rest api to talk
 * Based on the environment it changes from dev to prod
 */
    constant("RESTURL", (function () {
        return {url: "http://127.0.0.1:9001/"};
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
    }).

/**
 * Directive to highlight current menu item
 */


    // todo: not working properly, get it done!
    directive('activeLink', ['$location', function ($location) {
        return {
            restrict: 'A',
            link: function ($scope, $element, $attrs) {
                var clazz = $attrs.activeLink;
                var path = $location.path();
                path = path //hack because path does not
                // return including hashbang
                $scope.location = $location;
                $scope.$watch('location.path()', function (newPath) {
                    if (path === newPath) {
                        console.log(path, newPath);
                        $element.addClass(clazz);
                    } else {
                        console.log(path, newPath);
                        $element.removeClass(clazz);
                    }
                });
            }
        };
    }]).

/**
 * logout directive
 */
    directive('logout', function($http, $location){
        return {
            link: function($scope, $element, $rootScope){
                $element.on('click', function(){
                    $http.post('http://127.0.0.1:9001/logout', {}).then(function () {
                        $rootScope.loggedInUser = false;
                        $location.path("/login");
                    });
                });
            }
        }
    });

// test the code with strict di mode to see if it works when minified
//angular.bootstrap(document, ['zaerp'], {
//    strictDi: true
//});
