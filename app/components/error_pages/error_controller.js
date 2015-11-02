/**
 * Copyright (C) 2015 ZetaOps Inc.
 *
 * This file is licensed under the GNU General Public License v3
 * (GPLv3).  See LICENSE.txt for details.
 */

'use strict';

app.config(['$routeProvider', function ($routeProvider) {
    $routeProvider
        .when('/error/500', {
            templateUrl: 'components/error_pages/500.html',
            controller: '500Ctrl'
        })
        .when('/error/404', {
            templateUrl: 'components/error_pages/404.html',
            controller: '404Ctrl'
        });
}]);

angular.module('ulakbus.error_pages', ['ngRoute'])

    .controller('500Ctrl', function ($scope, $rootScope, $location) {
    })

    .controller('404Ctrl', function ($scope, $rootScope, $location) {
    });