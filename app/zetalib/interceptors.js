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
    $httpProvider.interceptors.push(function ($q) {
        return {
            'response': function (response) {
                //Will only be called for HTTP up to 300
                return response;
            },
            'responseError': function (rejection) {
                // if unauthorized then redirect to login page
                if(rejection.status === 400) {
                    location.reload();
                }
                if(rejection.status === 401) {
                    location.path('#/login');
                }
                return $q.reject(rejection);
            }
        };
    });
}]);