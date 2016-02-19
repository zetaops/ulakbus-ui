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
    .factory('AuthService', function ($http, $rootScope, $location, $log, Generator, RESTURL) {
        var authService = {};

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
                    $rootScope.loggedInUser = true;
                })
                .error(function (data, status, headers, config) {
                    // Handle login errors here
                    data.title = "İşlem başarısız oldu. Lütfen girdiğiniz bilgileri kontrol ediniz."
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
            $log.debug("logout");
            return $http.post(RESTURL.url + 'logout', {}).success(function (data) {
                $rootScope.loggedInUser = false;
                $log.debug("loggedout");
                $location.path("/login");
            });
        };

        return authService;
    });