/**
 * @license Ulakbus-UI
 * Copyright (C) 2015 ZetaOps Inc.
 *
 * This file is licensed under the GNU General Public License v3
 * (GPLv3).  See LICENSE.txt for details.
 */

"use strict";

angular.module('ulakbus.auth')
    /**
     * @memberof ulakbus.auth
     * @ngdoc service
     * @name AuthService
     * @description  provides generic functions for authorization process.
     */
    .factory('AuthService', function ($http, $rootScope, $location, $log, $route, Generator, RESTURL, $window) {
        var authService = {};

        authService.get_form = function (scope) {
            return $http.post(RESTURL.url, scope.form_params)
                .success(function (data, status, headers, config) {
                    if($window.sessionStorage.userID !== undefined){
                        authService.logout();
                    } else {
                        if (data.user_id !== undefined) {
                            $window.sessionStorage.userID = data.user_id;
                            $rootScope.loggedInUser = true;
                            //$rootScope.$broadcast("ws_turn_on");
                            $rootScope.$broadcast("setPublicWf", false);
                            $location.path('/dashboard');

                        }else {
                            if (angular.isDefined(data.forms) && $location.path() !== '/login'){
                                $location.path('/login');
                            }
                            return Generator.generate(scope, data);
                        }
                    }
                })
                .error(function (data) {
                    console.log(data);
                    return data;
                });
        };

        /**
         * @memberof ulakbus.auth
         * @ngdoc function
         * @function login
         * @description login function post credentials to API and handles login.
         * If login req returns success then interceptor will redirects to related path.
         *
         * @param url
         * @param credentials
         * @returns {*}
         */
        authService.login = function (url, credentials) {
            credentials['cmd'] = "do";
            credentials['wf'] = url;
            if($window.sessionStorage.userID !== undefined){
                authService.logout();
            }
            return $http.post(RESTURL.url, credentials)
                .success(function (data, status, headers, config) {
                    Generator.button_switch(true);
                    if(data.status_code !== undefined)
                        status = data.status_code;
                    if (status === 200) {
                        $window.sessionStorage.userID = data.user_id;
                        $rootScope.loggedInUser = true;
                        // $rootScope.$broadcast("regenerate_menu");
                        // to display main view without flickering
                        // $rootScope.$broadcast("ws_turn_on");
                        $location.path('/dashboard');
                    }
                    if (status !== 200) {
                        data.title = "İşlem başarısız oldu. Lütfen girdiğiniz bilgileri kontrol ediniz.";
                    }
                    return data;
                })
                .error(function (data, status, headers, config) {
                    // Handle login errors here
                    data.title = "İşlem başarısız oldu. Lütfen girdiğiniz bilgileri kontrol ediniz.";
                    return data;
                });
        };

        /**
         * @memberof ulakbus.auth
         * @ngdoc controller
         * @function logout
         * @description logout function posts logout request to API and redirects to login path
         *
         * @returns {*}
         */
        authService.logout = function () {
            $rootScope.$broadcast("show_main_loader");
            $rootScope.loginAttempt = 0;
            $http.post(RESTURL.url, {wf: 'logout'})
                .then(function (data) { //TODO not working callback
                    $window.sessionStorage.clear();
                    $rootScope.loggedInUser = false;
                    $rootScope.current_user = true;
                    $rootScope.$broadcast("user_logged_out");
                    $log.debug("loggedout");
                    //WSOps.close('loggedout');
                    $location.path("/login");
                    window.location.reload();
                })
        };

        /*authService.check_auth = function () {
            var post_data = { form_params:{ wf: 'login' } };
            return authService.get_form(post_data);
        };*/

        return authService;
    });
