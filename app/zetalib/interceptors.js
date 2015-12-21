/**
 * @license Ulakbus-UI
 * Copyright (C) 2015 ZetaOps Inc.
 *
 * This file is licensed under the GNU General Public License v3
 * (GPLv3).  See LICENSE.txt for details.
 */

app.config(['$httpProvider', function ($httpProvider) {
    /**
     * the interceptor for all requests to check response
     * 4xx - 5xx errors will be handled here
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

                // if (response.data.client_cmd) {
                //$location.path(response.data.screen);
                // }
                return response;
            },
            'responseError': function (rejection) {

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
                        rejection.status+ rejection.data.title +
                        '</h4>' +
                        '</div>' +
                        '<div class="modal-body">' +
                        '<div class="alert alert-danger">' +
                        '<strong>' +
                        rejection.data.description +
                        '</strong>' +
                        codefield +
                        '</div>'+
                        '</div>' +
                        '<div class="modal-footer">' +
                        '<button type="button" class="btn btn-default" data-dismiss="modal">Kapat</button>' +
                        '</div>' +
                        '</div>' +
                        '</div>' +
                        '</div>').modal();
                    try {
                        $('pre:not(.hljs)').each(function(i, block) {
                            hljs.highlightBlock(block);
                        });
                    }
                    catch (e) {
                        $log.debug('Exception: ', e.message);
                    }
                };

                if (rejection.status === -1) {
                    rejection.status = 'Sunucu hatası'
                    rejection.data = {title: "", description : 'Sunucu bağlantısında bir hata oluştu.' +
                    'Lütfen yetkili personelle iletişime geçiniz.'};
                    $rootScope.$broadcast('alertBox', {title: rejection.status, msg: rejection.data.description, type: 'error'});
                }

                if (rejection.status === 400) {
                    $location.reload();
                }
                if (rejection.status === 401) {
                    $location.path('/login');
                    if ($location.path() === "/login") {
                        $log.debug("show errors on login form");
                    }
                }
                if (rejection.status === 403) {
                    if (rejection.data.is_login === true) {
                        $rootScope.loggedInUser = true;
                        if ($location.path() === "/login") {
                            $location.path("/dashboard");
                        }
                    }
                    //errorModal();
                }
                $rootScope.$broadcast('show_notifications', rejection.data);

                if (rejection.status === 404) {
                    errorModal();
                }
                if (rejection.status === 500) {
                    errorModal();
                }
                return $q.reject(rejection);
            }
        };
    });
}]);