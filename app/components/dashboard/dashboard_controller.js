/**
 * @license Ulakbus-UI
 * Copyright (C) 2015 ZetaOps Inc.
 *
 * This file is licensed under the GNU General Public License v3
 * (GPLv3).  See LICENSE.txt for details.
 */

'use strict';

/**
 * @ngdoc module
 * @name ulakbus.dashboard
 * @module ulakbus.dashboard
 * @description ulakbus.dashboard module is holding dashboard's controller, directives and other components.
 *
 * @type {ng.$compileProvider|*}
 */
angular.module('ulakbus.dashboard', [])
    .config(function ($uibTooltipProvider) {
        $uibTooltipProvider.setTriggers({'click': 'mouseleave'});
    })

    .controller('DashController', function ($scope, $rootScope, $routeParams, $route, $timeout, $http, $cookies, RESTURL, Generator, WSOps) {
        // first generate_dashboard broadcasted to get menu and dashboard items
        // sidebar directive listens for "generate_dashboard"
        $rootScope.$broadcast("generate_dashboard");

        $scope.section = function (section_index) {
            $rootScope.section = section_index;
        };

        // to show search box based on authz
        $scope.$on("authz", function (event, data) {
            $rootScope.searchInputs = data;
        });

        $scope.keyword = {student: "", staff: ""};

        $scope.students = [];
        $scope.staffs = [];

        $scope.search = function (where) {
            if ($scope.keyword.staff.length > 2 || $scope.keyword.student.length > 2) {
                $timeout(function () {
                    if (where === 'personel') {
                        // if input length greater than 2 search for the value

                        $scope.getItems(where, $scope.keyword.staff).then(function (data) {
                            $scope.staffs = data.results;
                        });
                    }
                    if (where === 'ogrenci') {
                        $scope.getItems(where, $scope.keyword.student).then(function (data) {
                            $scope.students = data.results;
                        })
                    }
                }, 500);
            }
        };

        $scope.getItems = function (where, what) {
            $scope.showResults = true;
            return WSOps.request({view: where + '_ara', query: what});
        };

        $scope.userPopover = {templateUrl: 'components/dashboard/user-info.html'};

        $scope.get_info = function (type, key) {
            Generator.get_list({url: 'crud', form_params: {wf: 'crud', model: type, object_id: key, cmd: 'show'}})
                .then(function (data) {
                    $scope.userPopover.name = data.data.object.unicode;
                    $scope.userPopover.tcno = data.data.object.tckn;

                    //debugger;
                })
        };

        $scope.select = function (who, type) {
            $rootScope.$broadcast('selectedUser', {name: who[0], tcno: who[1], key: who[2]});
            // get 'who's related transactions and manipulate sidebar menu
            $rootScope.$broadcast("menuitems", type);
            $scope.showResults = false;

        };

        $scope.$on("notifications", function (event, data) {
            $scope.notifications = data;
        });

        $scope.$on('selectedUser', function ($event, data) {
            $scope.selectedUser = data;
        });

        $scope.deselectUser = function () {
            delete $scope.selectedUser;
            delete $scope.selectedMenuItems;
        };

        $scope.markAsRead = function (items) {
            $rootScope.$broadcast("markasread", items);
        };

        //if ($routeParams.cmd = 'reload') {
        //    $route.reload();
        //}

    })
    .directive('sidebarNotifications', function () {

        return {
            templateUrl: 'shared/templates/directives/sidebar-notification.html',
            restrict: 'E',
            replace: true,
            link: function ($scope) {
                // sidebar notifications from rootScope broadcast

                //$scope.$on("notifications", function (event, data) {
                //    $scope.notifications = data;
                //});
            }
        }
    });
