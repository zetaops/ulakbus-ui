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
    .directive('leftMenu', function ($route) {
        return {
            templateUrl: '../../components/bapComponents/left-menu.html',
            restrict: 'E',
            replace: true,
            scope: {
                menuItems:'='
            },
            controller: function ($scope) {
                $scope.selectedMenu = 0;
                //since the menuItems comes from the API call it is undefined when page load
                $scope.$watch('menuItems', function (newVal, oldVal) {
                    if(angular.isDefined(newVal)){
                        var pathParam =  $route.current.pathParams.wf;
                        for(var i=0; i<newVal.items.length; i++){
                            if(newVal.items[i].wf === pathParam){
                                $scope.selectedMenu = i;
                                break;
                            }
                        }
                    }
                });

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
