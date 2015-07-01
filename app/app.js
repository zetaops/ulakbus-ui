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
            debug: true
        });
    }]).
/**
 * RESTURL is the url of rest api to talk
 * Based on the environment it changes from dev to prod
 */
    constant("RESTURL", (function () {
        var dev = "http://127.0.0.1:3000/api/";
        var prod = "";
        var ENV = "dev"; // change to prod in production
        return ENV == "dev" ? {url: dev} : {url: prod};
        //return "http://127.0.0.1:3000/api/";
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
//angular.bootstrap(document, ['zaerp'], {
//    strictDi: true
//});
