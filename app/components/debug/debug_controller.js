/**
 * @license Ulakbus-UI
 * Copyright (C) 2015 ZetaOps Inc.
 *
 * This file is licensed under the GNU General Public License v3
 * (GPLv3).  See LICENSE.txt for details.
 */

'use strict';

angular.module('ulakbus.debug', ['ngRoute'])
    .controller('DebugController', function ($scope, $rootScope, $location) {

        $scope.debug_queries = $rootScope.debug_queries;

    });