/**
 * @license Ulakbus-UI
 * Copyright (C) 2015 ZetaOps Inc.
 *
 * This file is licensed under the GNU General Public License v3
 * (GPLv3).  See LICENSE.txt for details.
 */

'use strict';

/**
 * @ngdoc module
 * @name ulakbus
 * @module ulakbus
 * @description Ulakbus module is the main module of ulakbus-ui.
 * All application-wide configurations and definings of constants handled in this module.
 *
 * There are two scripts on `app/` root; `main.js` and `app.js`. And `main.html`, `index.html`.
 * `main.*` files are contains both production and development requirements or configurations/necessities for relative environment.
 * Tagged with `NODE_ENV='PRODUCTION'` in commented line and configured in Gruntfile.js with package `preprocess` and `env`, related grunt command generates index.* for given file.
 *
 */
angular.module(
    'ulakbus', [
        'ui.bootstrap',
        'angular-loading-bar',
        'ngRoute',
        'ngSanitize',
        'ngCookies',
        'ulakbus.formService',
        'ulakbus.dashboard',
        'ulakbus.auth',
        'ulakbus.error_pages',
        'ulakbus.crud',
        'ulakbus.debug',
        'ulakbus.devSettings',
        'ulakbus.version',
        //'schemaForm',
        'gettext',
        // @if NODE_ENV='PRODUCTION'
        'templates-prod',
        // @endif
        // @if NODE_ENV='DEVELOPMENT'
        'ulakbus.uitemplates'
        // @endif
    ])
    /**
     * @memberof ulakbus
     * @ngdoc constant
     * @name RESTURL
     * @description RESTURL is the url of rest api to talk.
     * Based on the environment it changes from dev to prod.
     *
     * For development needs backendurl can be switched from both dev/settings page and querystring `?backendurl=http://example.com`
     */
    .constant("RESTURL", (function () {
        // todo: below backendurl definition is for development purpose and will be deleted
        var backendurl = location.href.indexOf('nightly') > -1 ? "//nightly.api.ulakbus.net/" : "//api.ulakbus.net/";
        if (document.cookie.indexOf("backendurl") > -1) {
            var cookiearray = document.cookie.split(';');
            angular.forEach(cookiearray, function (item) {
                if (item.indexOf("backendurl") > -1) {
                    backendurl = item.split('=')[1];
                }
            });
        }

        if (location.href.indexOf("backendurl") > -1) {
            var urlfromqstr = location.href.split('?')[1].split('=')[1];
            backendurl = decodeURIComponent(urlfromqstr.replace(/\+/g, " "));
            document.cookie = "backendurl=" + backendurl;
            window.location.href = window.location.href.split('?')[0];
        }

        return {url: backendurl};
    })())
    .config(function ($logProvider) {
        // @if NODE_ENV='PRODUCTION'
        $logProvider.debugEnabled(false);
        // @endif
        // @if NODE_ENV='DEVELOPMENT'
        $logProvider.debugEnabled(true);
        // @endif
    });