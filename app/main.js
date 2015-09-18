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
        //'ulakbus.staff',
        //'ulakbus.student',
        'ulakbus.crud',
        //'ulakbus.version',
        'schemaForm',
        'gettext',
        // @if NODE_ENV='PRODUCTION'
        'templates-prod',
        // @endif
        // @if NODE_ENV='DEVELOPMENT'
        //'templates-dev',
        // @endif
    ]).
/**
 * RESTURL is the url of rest api to talk
 * Based on the environment it changes from dev to prod
 */
    constant("RESTURL", (function () {
        // todo: below backendurl definition is for development purpose and will be deleted
        var backendurl = "http://api.ulakbus.net/";
        if (document.cookie.indexOf("backendurl") > -1){
            var cookiearray = document.cookie.split(';');
            angular.forEach(cookiearray, function(item){
                if(item.indexOf("backendurl")){
                    backendurl = item.split('=')[1];
                }
            });
        }
        if (location.href.indexOf("backendurl") > -1){
            var urlfromqstr = location.href.split('?')[1].split('=')[1];
            backendurl = decodeURIComponent(urlfromqstr.replace(/\+/g, " "));
            document.cookie = "backendurl="+backendurl;
        }
        return {url: backendurl};
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
