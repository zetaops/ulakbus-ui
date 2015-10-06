/**
 * Copyright (C) 2015 ZetaOps Inc.
 *
 * This file is licensed under the GNU General Public License v3
 * (GPLv3).  See LICENSE.txt for details.
 */

"use strict";

// TODO: login url change with correct one

auth.factory('LoginService', function ($http, $rootScope, $location, $log, Session, RESTURL) {
    var loginService = {};

    loginService.login = function (url, credentials) {
        credentials['cmd'] = "do";
        return $http
            .post(RESTURL.url + url, credentials)
            .success(function (data, status, headers, config) {
                //$window.sessionStorage.token = data.token;

                $rootScope.loggedInUser = true;
            })
            .error(function (data, status, headers, config) {
                // Handle login errors here
                return data;
            });
    };

    loginService.logout = function () {
        $log.info("logout");
        return $http.post(RESTURL.url + 'logout', {}).success(function (data) {
            $rootScope.loggedInUser = false;
            $location.path("/login");
        });
        $log.info("loggedout");

    };

    loginService.isAuthenticated = function () {
        return !!Session.userId;
    };

    loginService.isAuthorized = function (authorizedRoles) {
        if (!angular.isArray(authorizedRoles)) {
            authorizedRoles = [authorizedRoles];
        }
        return (loginService.isAuthenticated() &&
        loginService.indexOf(Session.userRole) !== -1);
    };

    loginService.isValidEmail = function (email) {
        var re = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;
        return re.test(email);
    };

    return loginService;
});

// TODO: initial service not working!!

auth.service('Session', function () {
    this.create = function (sessionId, userId, userRole) {
        this.id = sessionId;
        this.userId = userId;
        this.userRole = userRole;
    };
    this.destroy = function () {
        this.id = null;
        this.userId = null;
        this.userRole = null;
    };
});