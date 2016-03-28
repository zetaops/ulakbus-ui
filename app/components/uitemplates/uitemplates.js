/**
 * @license Ulakbus-UI
 * Copyright (C) 2015 ZetaOps Inc.
 *
 * This file is licensed under the GNU General Public License v3
 * (GPLv3).  See LICENSE.txt for details.
 */

angular.module('ulakbus.uitemplates', ['ngRoute'])

    .controller('NewDesignsCtrl', function ($scope) {
        $scope.items = ['student', 'staff', 'academician'];
        $scope.selection = $scope.items[0];
    });