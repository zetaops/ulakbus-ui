/**
 * Created by evren kutar on 12/05/15.
 */

"use strict";

// TODO: login url cheange with correct one

login.factory('LoginService', function ($http, Session) {
    var loginService = {};

    loginService.login = function (credentials) {
        return $http
            .get('http://127.0.0.1:8000/login', credentials)
            .then(function (res) {
                Session.create(res.data.id, res.data.user.id,
                    res.data.user.role);
                return res.data.user;
            });
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

    return loginService;
});

// TODO: initial service not working!!

login.service('Session', function () {
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