/**
 * @license Ulakbus-UI
 * Copyright (C) 2015 ZetaOps Inc.
 *
 * This file is licensed under the GNU General Public License v3
 * (GPLv3).  See LICENSE.txt for details.
 */

angular.module('ulakbus')
    .config(['$httpProvider', function ($httpProvider) {
        /**
         * @memberof ulakbus.formService
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
        $httpProvider.interceptors.push(function (ErrorService, $q, $rootScope, $location, $timeout, $log, toastr) {
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

                    if(response.data.cmd === "error"){
                        ErrorService.handle(response.data, 'http');
                        return ;
                    }

                    if (response.data._debug_queries) {
                        if (response.data._debug_queries.length > 0) {
                            $rootScope.debug_queries = $rootScope.debug_queries || [];
                            $rootScope.debug_queries.push({
                                "url": response.config.url,
                                "queries": response.data._debug_queries
                            });
                        }
                    }

                    if (response.data.is_login === false) {
                        $rootScope.loggedInUser = response.data.is_login;
                        $location.path("/login");
                    }
                    if (response.data.is_login === true) {
                        $rootScope.loggedInUser = true;
                        $rootScope.loginAttempt = 1; // this needs for popup errors
                        if ($location.path() === "/login") {
                            $location.path("/dashboard");
                        }
                    }

                    // handle toast notifications here

                    if (response.data.notify) {toastr.info(response.data.notify)}

                    return response;
                },
                'responseError': function (rejection) {
                    ErrorService.handle(rejection, 'http');

                    return $q.reject(rejection);
                }
            };
        });
    }]);