/**
 * @license Ulakbus-UI
 * Copyright (C) 2015 ZetaOps Inc.
 *
 * This file is licensed under the GNU General Public License v3
 * (GPLv3).  See LICENSE.txt for details.
 */

'use strict';

angular.module('ulakbus.devSettings', ['ngRoute'])

    .controller('DevSettingsController', function ($scope, $cookies, $rootScope, RESTURL) {
        $scope.backendurl = $cookies.get("backendurl");
        $scope.notificate = $cookies.get("notificate") || "on";
        //$scope.querydebug = $cookies.get("querydebug") || "on";

        $scope.changeSettings = function (what, set) {
            document.cookie = what+"="+set;
            $scope[what] = set;
            $rootScope.$broadcast(what, set);
        };

        $scope.switchOnOff = function (pinn) {
            return pinn=="on" ? "off" : "on"
        };

        $scope.setbackendurl = function () {
            $scope.changeSettings("backendurl", $scope.backendurl);
            RESTURL.url = $scope.backendurl;
        };

        $scope.setnotification = function () {
            $scope.changeSettings("notificate", $scope.switchOnOff($scope.notificate));
        };

        //$scope.setquerydebug = function () {
        //    $scope.changeSettings("querydebug", $scope.switchOnOff($scope.querydebug));
        //};

    });