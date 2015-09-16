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
        'ulakbus.crud',
        //'ulakbus.version',
        'schemaForm',
        'gettext',
        //'templates-prod'
    ]).
/**
 * RESTURL is the url of rest api to talk
 * Based on the environment it changes from dev to prod
 */
    constant("RESTURL", (function () {
        return {url: "http://" + window.location.hostname + ":9001/"};
        //return {url: "http://api.ulakbus.net/"};
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
//angular.bootstrap(document, ['ulakbus'], {
//    strictDi: true
//});
