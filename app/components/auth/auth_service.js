/**
 * Copyright (C) 2015 ZetaOps Inc.
 *
 * This file is licensed under the GNU General Public License v3
 * (GPLv3).  See LICENSE.txt for details.
 */

"use strict";

// TODO: login url change with correct one

auth.factory('LoginService', function ($http, $rootScope, $location, $log, $cookies, $window, Session, RESTURL) {
    var loginService = {};

    loginService.login = function (url, credentials) {
        credentials = {login_crd: credentials, cmd: "do"};
        return $http
            .post(RESTURL.url + url, credentials)
            .success(function (data, status, headers, config) {
                $window.sessionStorage.token = data.token;
                $rootScope.loggedInUser = true;
                $location.path("/dashboard");
            })
            .error(function (data, status, headers, config) {
                // Erase the token if the user fails to log in
                delete $window.sessionStorage.token;

                // Handle login errors here
                $scope.message = 'Error: Invalid user or password';
            });
            //.then(function (res) {
            //    $log.info(res.data[0]);
            //    res.data = res.data[0];
            //    if (res.data.success) {
            //        $rootScope.loggedInUser = true;
            //        $location.path("/dashboard");
            //        var session = Session.create(res.data.id, res.data.user.id,
            //            res.data.user.role);
            //        $log.info(session);
            //        $cookies.put('sessionId', 123456);
            //        console.log($cookies.getAll());
            //        return res.data.user;
            //    }
            //});
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