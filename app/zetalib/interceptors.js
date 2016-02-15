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
        $httpProvider.interceptors.push(function ($q, $rootScope, $location, $timeout, $log) {
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

                    return response;
                },
                'responseError': function (rejection) {
                    var errorInModal = ('error' in rejection.data);
                    var errorModal = function () {
                        if ($rootScope.loginAttempt === 0) {
                            $log.debug('not logged in, no alert message triggered');
                            return;
                        }
                        var codefield = "";
                        if (rejection.data.error) {
                            codefield = '<p><pre>' +
                                rejection.data.error +
                                '</pre></p>';
                        }

                        $('<div class="modal">' +
                            '<div class="modal-dialog" style="width:100%;" role="document">' +
                            '<div class="modal-content">' +
                            '<div class="modal-header">' +
                            '<button type="button" class="close" data-dismiss="modal" aria-label="Close"><span' +
                            ' aria-hidden="true">&times;</span></button>' +
                            '<h4 class="modal-title" id="exampleModalLabel">' +
                            "Error Status: " + rejection.status + "<br>Error Title: " + rejection.data.title +
                            '</h4>' +
                            '</div>' +
                            '<div class="modal-body">' +
                            '<div class="alert alert-danger">' +
                            '<strong>' +
                            rejection.data.description +
                            '</strong>' +
                            codefield +
                            '</div>' +
                            '</div>' +
                            '<div class="modal-footer">' +
                            '<button type="button" class="btn btn-default" data-dismiss="modal">Kapat</button>' +
                            '</div>' +
                            '</div>' +
                            '</div>' +
                            '</div>').modal();
                        try {
                            $('pre:not(.hljs)').each(function (i, block) {
                                hljs.highlightBlock(block);
                            });
                        }
                        catch (e) {
                            $log.debug('Exception: ', e.message);
                        }
                    };

                    var errorInAlertBox = function (alertContent) {
                        if (errorInModal) {
                            errorModal();
                        } else {
                            $rootScope.$broadcast('alertBox', alertContent);
                        }
                    };

                    var errorForAlertBox = {
                        title: rejection.status,
                        msg: rejection.data.description,
                        type: 'error'
                    };

                    var errorDispatch = {
                        "-1" : function () {
                            rejection.status = 'Sunucu hatası';
                            rejection.data.title = rejection.data.title || "Sunucu Hatası";
                            rejection.data.description = rejection.data.description || 'Sunucu bağlantısında bir hata oluştu. Lütfen yetkili personelle iletişime geçiniz.';
                            errorInAlertBox(errorForAlertBox);
                        },
                        "400": function () {
                            $location.reload();
                        },
                        "401": function () {
                            $location.path('/login');
                            if ($location.path() === "/login") {
                                $log.debug("show errors on login form");
                            }
                        },
                        "403": function () {
                            if (rejection.data.is_login === true) {
                                $rootScope.loggedInUser = true;
                                if ($location.path() === "/login") {
                                    $location.path("/dashboard");
                                }
                            }
                        },
                        "404": function () {
                            errorInAlertBox(errorForAlertBox);
                        },
                        "500": function () {
                            errorInAlertBox(errorForAlertBox);
                        }
                    };

                    errorDispatch[rejection.status]();

                    return $q.reject(rejection);
                }
            };
        });
    }]);