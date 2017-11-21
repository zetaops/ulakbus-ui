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
    .factory('AuthService', function ($http, $rootScope, $location, $log, $route, Generator, RESTURL, WSOps, $window,$cookies) {
        var authService = {};

        authService.get_form = function (scope) {
            return $http
                .post(Generator.makeUrl(scope), scope.form_params)
                .success(function (data, status, headers, config) {
                    // if response data.cmd is 'upgrade'
                    if (data.cmd === 'upgrade') {
                        $rootScope.loggedInUser = true;
                        $rootScope.$broadcast("ws_turn_on");
                        $rootScope.$broadcast("setPublicWf", false);
                        return $location.path('/dashboard');
                    }
                    if (data.cmd === 'retry') {
                        $location.path('/login');
                    } else{
                        if (angular.isDefined(data.forms) && $location.path() !== '/login'){
                            $location.path('/login');
                        }
                        return Generator.generate(scope, data);
                    }
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
            return $http
                .post(RESTURL.url + url, credentials)
                .success(function (data, status, headers, config) {
                    //$window.sessionStorage.token = data.token;
                    Generator.button_switch(true);
                    if (data.cmd === 'upgrade') {
                        $rootScope.loggedInUser = true;
                        // $rootScope.$broadcast("regenerate_menu");
                        // to display main view without flickering
                        $rootScope.$broadcast("ws_turn_on");
                        $location.path('/dashboard');
                    }
                    if (data.status_code === 403) {
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
            WSOps.request({wf: 'logout'}).then(function (data) { //TODO not working callback
                $rootScope.loggedInUser = false;
                $rootScope.current_user = true;
                $rootScope.$broadcast("user_logged_out");
                $log.debug("loggedout");
                WSOps.close('loggedout');
                $location.path("/login");
                window.location.reload();
            });
        };

        authService.check_auth = function () {
            var post_data = {url: 'login', form_params:{}};
            return authService.get_form(post_data);
        };

        return authService;
    });
