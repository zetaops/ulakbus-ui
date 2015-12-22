/**
 * @license Ulakbus-UI
 * Copyright (C) 2015 ZetaOps Inc.
 *
 * This file is licensed under the GNU General Public License v3
 * (GPLv3).  See LICENSE.txt for details.
 */

'use strict';

angular.module('ulakbus.dashboard', [])
    .config(function ($uibTooltipProvider) {
        $uibTooltipProvider.setTriggers({'click': 'mouseleave'});
    })

    .controller('DashCtrl', function ($scope, $rootScope, $timeout, $http, $cookies, RESTURL, Generator) {
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
            $timeout(function () {
                if (where === 'personel') {
                    // if input length greater than 2 search for the value
                    if ($scope.keyword.staff.length > 2) {
                        $scope.getItems(where, $scope.keyword.staff).success(function (data) {
                            $scope.staffs = data.results;
                        });
                    }
                }
                if (where === 'ogrenci') {
                    if ($scope.keyword.student.length > 2) {
                        $scope.getItems(where, $scope.keyword.student).success(function (data) {
                            $scope.students = data.results;
                        })
                    }
                }
            }, 500);
        };

        $scope.getItems = function (where, what) {
            $scope.showResults = true;
            return $http.get(RESTURL.url + 'ara/' + where + '/' + what);
        };

        $scope.userPopover = {templateUrl: 'components/dashboard/user-info.html'};

        $scope.get_info = function (type, key) {
            Generator.get_list({url: 'crud', form_params: {model: type, object_id: key, cmd: 'show'}})
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
        }

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
