/**
 * Copyright (C) 2015 ZetaOps Inc.
 *
 * This file is licensed under the GNU General Public License v3
 * (GPLv3).  See LICENSE.txt for details.
 */

'use strict';

var app = angular.module(
    'ulakbus', [
        'ui.bootstrap',
        'angular-loading-bar',
        'ngRoute',
        'ngSanitize',
        'ngCookies',
        'general',
        'formService',
        'ulakbus.dashboard',
        'ulakbus.auth',
        'ulakbus.staff',
        'ulakbus.student',
        'schemaForm',
        'gettext',
        'templates-prod'
    ]).
/**
 * RESTURL is the url of rest api to talk
 * Based on the environment it changes from dev to prod
 */
    constant("RESTURL", (function () {
        return {url: "http://" + window.location.hostname + ":9001/"};
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
                        $element.addClass(clazz);
                    } else {
                        $element.removeClass(clazz);
                    }
                });
            }
        };
    }]).

/**
 * logout directive
 */
    directive('logout', function ($http, $location) {
        return {
            link: function ($scope, $element, $rootScope) {
                $element.on('click', function () {
                    $http.post('http://' + window.location.hostname + ':9001/logout', {}).then(function () {
                        $rootScope.loggedInUser = false;
                        console.log($rootScope.loggedInUser);
                        $location.path("/login");
                        $scope.$apply();
                    });
                });
            }
        }
    });

// buildbot mailnotifier change on master mail test comment (will be deleted)

/**
 * listnode add directive
 */

    //directive('addlistnode', function () {
    //    return {
    //        link: function ($scope, $modal, $element) {
    //            debugger;
                //$element.on('click', function () {
                //    var nodename = $element[0].firstElementChild.innerHTML;
                //    var newitem = angular.copy($scope.listnodeform[nodename+'_1']);
                //    console.log($scope.form);
                //    $scope.form.splice(7, 0, newitem);
                //    console.log($scope.form);
                //    $scope.$broadcast('schemaFormRedraw');
                //    $scope.$apply();
                //});
    //        }
    //    }
    //});

// test the code with strict di mode to see if it works when minified
//angular.bootstrap(document, ['ulakbus'], {
//    strictDi: true
//});
