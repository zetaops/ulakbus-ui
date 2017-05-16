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
        'ui.grid',
        'ui.grid.infiniteScroll',
        'ulakbus.formService',
        'ulakbus.messaging',
        'ulakbus.dashboard',
        'ulakbus.auth',
        'ulakbus.error_pages',
        'ulakbus.crud',
        'ulakbus.debug',
        'ulakbus.devSettings',
        'ulakbus.version',
        'gettext',
        'markdown',
        'ngWebSocket',
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
    .factory('IsOnline', function ($window, $document, $rootScope) {

        var isOnlineService = {};
        isOnlineService.status = true;

        var offlineMask = angular.element(
            '<div class="body-mask" style="z-index: 2010; opacity: 0.6">' +
            '<div class="alert alert-danger text-center" role="alert" style="z-index: 2011; position: relative">' +
            'İnternet bağlantınız kesilmiştir. Bağlantı sağlandığında kaldığınız yerden devam edebilirsiniz.' +
            '</div>' +
            '</div>'
        );
        var body = $document.find('body').eq(0);

        isOnlineService.set_status = function (state) {
            // status changed
            if (state != isOnlineService.status){
                // online
                if (state){
                    offlineMask.remove();
                    // is user is set, reload page to init
                    if ($rootScope.current_user === true){
                        window.location.reload();
                    }
                }
                // offline
                else {
                    body.append(offlineMask);
                }
            }
            isOnlineService.status = state;
        };

        isOnlineService.get_status = function () {
            return isOnlineService.status;
        };

        // @if NODE_ENV='PRODUCTION'
        isOnlineService.status = navigator.onLine;
        $window.addEventListener("offline", function(){
            isOnlineService.set_status(false);
        });

        $window.addEventListener("online", function(){
            isOnlineService.set_status(true);
        });
        // @endif

        return isOnlineService;
    })
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
    .config(function ($logProvider) {
        // @if NODE_ENV='PRODUCTION'
        $logProvider.debugEnabled(false);
        // @endif
        // @if NODE_ENV='DEVELOPMENT'
        $logProvider.debugEnabled(true);
        // @endif
    })
    .config(function(markdownProvider) {
        //markdownProvider.config({
        //    extensions: ['table']
        //});
    });
