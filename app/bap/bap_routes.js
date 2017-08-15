/**
 * @license Ulakbus-UI
 * Copyright (C) 2015 ZetaOps Inc.
 *
 * This file is licensed under the GNU General Public License v3
 * (GPLv3).  See LICENSE.txt for details.
 */
'use strict';

angular.module('ulakbusBap')
    .config(['$routeProvider', function ($routeProvider, $route) {
        $routeProvider
            .when('/bap_anasayfa', {
                templateUrl: '/components/bapComponents/dashboard.html'
            })
            .when('/:wf/', {
                templateUrl: '/components/crud/templates/crud-preload.html',
                controller: 'BapCRUDController'
            })
            .when('/:wf/do/:cmd', {
                templateUrl: '/components/crud/templates/crud.html',
                controller: 'BapCRUDListFormController'
            })
            .otherwise({redirectTo: '/bap_anasayfa'});
    }])

    .config(['$httpProvider', function ($httpProvider) {
        /**
         * @memberof ulakbusBap
         * @ngdoc interceptor
         * @name http_interceptor
         * @description The http interceptor for all requests and responses to check and config payload and response
         * objects.
         * - To prevent OPTIONS preflight request change header Content-Type to `text/plain`.
         * - 4xx - 5xx errors are handled in response objects.
         * - `_debug_queries` is helper object for development purposes to see how long the queries lasts.
         *   They are shown in /debug/list' page.
         * - API returns `is_login` key to check if current user is authenticated. Interceptor checks and if not logged
         *   in redirects to login page.
         */
        $httpProvider.interceptors.push(function ($rootScope , toastr) {
            return {
                'request': function (config) {
                    if (config.method === "POST") {
                        // to prevent OPTIONS preflight request
                        config.headers["Content-Type"] = "text/plain";
                    }
                    return config;
                },
                'response': function (response) {
                    //Will only be called for HTTP up to 300

                    if (response.data._debug_queries) {
                        if (response.data._debug_queries.length > 0) {
                            $rootScope.debug_queries = $rootScope.debug_queries || [];
                            $rootScope.debug_queries.push({
                                "url": response.config.url,
                                "queries": response.data._debug_queries
                            });
                        }
                    }
                    // handle toast notifications here
                    if (response.data.notify) {toastr.info(response.data.notify)}

                    return response;
                }
            };
        });
    }]);