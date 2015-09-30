/**
 * Copyright (C) 2015 ZetaOps Inc.
 *
 * This file is licensed under the GNU General Public License v3
 * (GPLv3).  See LICENSE.txt for details.
 */

'use strict';

app.config(['$routeProvider', function ($routeProvider) {
    $routeProvider
        .when('/500', {
            templateUrl: 'components/uitemplates/500.html',
            controller: '500Ctrl'
        })
        .when('/404', {
            templateUrl: 'components/uitemplates/404.html',
            controller: '404Ctrl'
        });
}]);

angular.module('ulakbus.uitemplates', ['ngRoute'])

    .controller('500Ctrl', function ($scope, $rootScope, $location) {
    })

    .controller('400Ctrl', function ($scope, $rootScope, $location) {
    });