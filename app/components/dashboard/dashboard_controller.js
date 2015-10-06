/**
 * Copyright (C) 2015 ZetaOps Inc.
 *
 * This file is licensed under the GNU General Public License v3
 * (GPLv3).  See LICENSE.txt for details.
 */

'use strict';

// TODO: clean console log items

angular.module('ulakbus.dashboard', ['ngRoute'])

    .controller('DashCtrl', function ($scope, $rootScope) {
        $scope.section = function (section_index) {
            $rootScope.section = section_index;
        };
    });