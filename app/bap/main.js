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
 * @name ulakbusBap
 * @module ulakbusBap
 * @description ulakbusBap module is the public module of ulakbus-ui.
 *
 */
angular.module(
    'ulakbusBap', [
        //'ui.bootstrap',
        'ngRoute',
        'ngSanitize',
        'ulakbus.formService',
        'ulakbus.crud',
        'ngCookies',
        'ui.select',
        'markdown',
        'ui.bootstrap',
        // @if NODE_ENV='PRODUCTION'
        'templates-prod',
        'templates-prod_bap'
        // @endif
        // @if NODE_ENV='DEVELOPMENT'
        // @endif
    ])
/**
 * @memberof ulakbusBap
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

        // add proto definition if not set
        if (backendurl.indexOf("http") != 0){
            var proto = window.location.href.split("/")[0];
            backendurl = proto + backendurl;
        }

        return {
            url: backendurl,
            ws : backendurl.replace('http', 'ws')+"ws"
        };
    })())

    .constant('toastr', window.toastr);
