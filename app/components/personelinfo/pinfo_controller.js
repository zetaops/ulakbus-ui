/**
 * Copyright (C) 2015 ZetaOps Inc.
 *
 * This file is licensed under the GNU General Public License v3
 * (GPLv3).  See LICENSE.txt for details.
 */

'use strict';

// TODO: clean console log items

angular.module('ulakbus.pinfo', ['ngRoute'])

    .controller('PCtrl', function ($scope) {
        $scope.testData = "<h1>This is main Dashboard</h1>";
    });