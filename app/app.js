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
        //'ui.bootstrap',
        'angular-loading-bar',
        'ngRoute',
        'ngSanitize',
        'ngCookies',
        'ulakbus.formService',
        'ulakbus.messagingService',
        'ulakbus.dashboard',
        'ulakbus.auth',
        'ulakbus.error_pages',
        'ulakbus.crud',
        'ulakbus.debug',
        'ulakbus.devSettings',
        'ulakbus.version',
        'gettext',
        'markdown',
        'ulakbus.uitemplates'
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
    // todo: convert it to service
    .constant("RESTURL", (function () {
        // todo: below backendurl definition is for development purpose and will be deleted
        var backendurl = location.href.indexOf('nightly') > -1 ? "//nightly.api.ulakbus.net/" : "//api.ulakbus.net/";
        if (document.cookie.indexOf("backendurl") > -1) {
            var cookiearray = document.cookie.split(';');
            angular.forEach(cookiearray, function (item) {
                if (item.indexOf("backendurl") > -1) {
                    backendurl = item.split('=')[1];
                    if (backendurl.slice(-1) !== '/')  {backendurl += '/'}
                    if (backendurl.substring(0,4) !== 'http')  {backendurl = 'http://'+backendurl}
                }
            });
        }

        if (location.href.indexOf("backendurl") > -1) {
            var urlfromqstr = location.href.split('?')[1].split('=')[1];
            backendurl = decodeURIComponent(urlfromqstr.replace(/\+/g, " "));
            if (backendurl.slice(-1) !== '/')  {backendurl += '/'}
            if (backendurl.substring(0,4) !== 'http')  {backendurl = 'http://'+backendurl}
            document.cookie = "backendurl=" + backendurl;
            window.location.href = window.location.href.split('?')[0];
        }

        return {url: backendurl};
    })())
    // .service('DESIGN', function ($routeParams, $cookies, $log) {
    //     // use route param to change cookie for design
    //     // this is a config as a service added for designer can work without backend
    //     try {
    //         if (angular.isDefined($routeParams.design) || location.hash.split('?')[1].split('=')[1]) {
    //             $cookies.put('design', $routeParams.design || location.hash.split('?')[1].split('=')[1]);
    //         }
    //     } catch (e){
    //         $log.error("Error for design parameter", e);
    //     }
    //     return $cookies.get('design') === 'true' ? {switch: true} : {switch: false};
    // })
    .constant('toastr', window.toastr)
    .constant('WS', window.WebSocket)
    .config(function ($logProvider) {
        $logProvider.debugEnabled(true);
    })
    .config(function(markdownProvider) {
        //markdownProvider.config({
        //    extensions: ['table']
        //});
    });