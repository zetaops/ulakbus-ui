/**
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
    $httpProvider.interceptors.push(function ($q, $rootScope, $location, $timeout) {
        return {
            'request': function (config) {
                // todo: delete console logs
                if (config.method === "POST") {
                    // to prevent OPTIONS preflight request
                    config.headers["Content-Type"] = "text/plain";
                }
                return config;
            },
            'response': function (response) {
                //Will only be called for HTTP up to 300

                if (response.data.is_login === false) {
                    $rootScope.loggedInUser = response.data.is_login;
                    $location.path("/login");
                }
                if (response.data.is_login === true) {
                    $rootScope.loggedInUser = true;
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
                // if unauthorized then redirect to login page

                if (rejection.status === 400) {
                    $location.reload();
                }
                if (rejection.status === 401) {
                    $location.path('/login');
                    if ($location.path() === "/login") {
                        console.log("show errors on login form");
                    }
                }
                if (rejection.status === 403) {
                    if (rejection.data.is_login === true) {
                        $rootScope.loggedInUser = true;
                        if ($location.path() === "/login") {
                            $location.path("/dashboard");
                        }
                    }
                }
                if (rejection.status === 404) {
                    console.log(404);
                    $location.path("/error/404");
                }
                // server 500 error returns with -1 on status.
                //if (rejection.status === -1 && rejection.config.data.model) {
                if (rejection.status === 500) {
                    $('<div class="modal">' +
                        '<div class="modal-dialog" style="width:1024px;" role="document">' +
                        '<div class="modal-content">' +
                        '<div class="modal-header">' +
                        '<button type="button" class="close" data-dismiss="modal" aria-label="Close"><span' +
                        ' aria-hidden="true">&times;</span></button>' +
                        '<h4 class="modal-title" id="exampleModalLabel">500 Server Error</h4>' +
                        '</div>' +
                        '<div class="modal-body">' +
                        '<p><pre>' +
                        rejection.data.error +
                        '</pre></p>' +
                        '</div>' +
                        '<div class="modal-footer">' +
                        '<button type="button" class="btn btn-default" data-dismiss="modal">Close</button>' +
                        '</div>' +
                        '</div>' +
                        '</div>' +
                        '</div>').modal();
                    $location.path("/error/500");
                }
                return $q.reject(rejection);
            }
        };
    });
}]);