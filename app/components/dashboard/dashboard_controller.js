/**
 * Copyright (C) 2015 ZetaOps Inc.
 *
 * This file is licensed under the GNU General Public License v3
 * (GPLv3).  See LICENSE.txt for details.
 */

'use strict';

// TODO: clean console log items

angular.module('ulakbus.dashboard', ['ngRoute'])

    .controller('DashCtrl', function ($scope, $rootScope, $location) {
        if(!$rootScope.loggedInUser){$location.path("/login");}
        $scope.testData = "<h1>This is main Dashboard</h1>";
    });