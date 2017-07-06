/**
 * @license Ulakbus-UI
 * Copyright (C) 2015 ZetaOps Inc.
 *
 * This file is licensed under the GNU General Public License v3
 * (GPLv3).  See LICENSE.txt for details.
 */

'use strict';
angular.module('ulakbusBap')

/**
 * @memberof ulakbusBap
 * @ngdoc directive
 * @name leftMenu
 * @description Creates a left sidebar menu for the dashboard
 */
    .directive('leftMenu', function ($http) {
        return {
            templateUrl: '../../components/bapComponents/left-menu.html',
            restrict: 'E',
            replace: true,
            scope: {
                menuItems:'='
            },
            controller: function ($scope) {
                $scope.setActive = function (index) {
                    $scope.selectedMenu = index;
                };

            }
        };
    })
    /**
     * @memberof ulakbusBap
     * @ngdoc directive
     * @name leftMenu
     * @description Creates a left sidebar menu for the dashboard
     */
    .directive('topActionButtons', function () {
        return {
            templateUrl: '../../components/bapComponents/top-action-buttons.html',
            restrict: 'E',
            replace: true,
            scope: {
                buttonList:'='
            },
            controller: function ($scope, $location) {
                $scope.setActive = function (index, button) {
                    $scope.selectedButton  = index;
                    $location.path("/"+button.wf);
                };

            }
        };
    });