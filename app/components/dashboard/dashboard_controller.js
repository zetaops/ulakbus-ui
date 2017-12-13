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

    .controller('DashController', function ($scope, $rootScope, $routeParams, $route, $timeout, $http, $cookies, $log, RESTURL, Generator, WSOps) {
        // first generate_dashboard broadcasted to get menu and dashboard items
        // sidebar directive listens for "generate_dashboard"
        // $rootScope.$broadcast("generate_dashboard");

        $scope.section = function (section_index) {
            $rootScope.section = section_index;
        };

        // to show search box based on authz
        $scope.$on("authz", function (event, data) {
            $rootScope.searchInputs = data;

            if ( data.widgets && data.widgets.length ) {
                angular.forEach(data.widgets, function(value, key) {
                    if ( value.type === 'searchbox' && value.view === 'personel_ara' ) {
                        $scope.personelAra = value;
                    } else if ( value.type === 'table' ) {
                        $scope.tables.push(value);
                    }

                });
            }
        });

        $scope.keyword = {student: "", staff: ""};

        $scope.students = [];
        $scope.staffs = [];
        $scope.tables = [];
        $scope.personelAra = {};

        angular.element('.manager-view-content').on('click',function () {
            var scope = angular.element('.manager-view-content').scope();
            scope.$broadcast('menu-close');
        });
        /**
         * this function is for searchin student or personel
         * uses $scope.keyword objects
         * @param where
         */
        $scope.search = function (where) {
            if ($scope.keyword.staff.length > 2 || $scope.keyword.student.length > 2) {
                $timeout(function () {
                    if (where === 'personel') {
                        // if input length greater than 2 search for the value
                        var q = {
                            q: $scope.keyword.staff,
                        };

                        angular.forEach($scope.personelAra.checkboxes, function(value, key) {
                            if ( value.checked ) {
                                var name = value.name;
                                q[name] = value.value;
                            }
                        });
                        
                        $scope.getItems(where, q).then(function (data) {
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
            return WSOps.request({view: where + '_ara', query_params: what});
        };

        $scope.userPopover = {templateUrl: '/components/dashboard/user-info.html'};

        /**
         * when student or personel search results appear,
         * user can see the sample info of student/personel before to select it
         * this function triggered onhover the item
         * @param type
         * @param key
         */
        $scope.get_info = function (type, key) {
            Generator.get_list({url: 'crud', form_params: {wf: 'crud', model: type, object_id: key, cmd: 'show'}})
                .then(function (data) {
                    $scope.userPopover.name = data.object['Ad'] + " " + data.object['Soyad'];
                    $scope.userPopover.tcno = data.object['TC Kimlik No'];
                    $scope.userPopover.image = data.object['Avatar'] || 'img/sample-profile-pic.jpg';
                })
        };

        /**
         * @description selecting  
         * @param who - who is the data of selected person in search results
         * @param type - type can be 'ogrenci' or 'personel'
         */
        $scope.select = function (who, type) {
            $rootScope.$broadcast('selectedUser', {name: who[0], tcno: who[1], key: who[2]});
            // get 'who's related transactions and manipulate sidebar menu
            $rootScope.$broadcast("menuitems", type);
            $scope.showResults = false;

        };

        /**
         * dashboard also catches notifications to use in widgets
         */
        $scope.$on("notifications", function (event, data) {
            $scope.notifications = data;
        });

        $scope.$on('selectedUser', function ($event, data) {
            $scope.selectedUser = data;
        });

        /**
         * removes selected user
         */
        $scope.deselectUser = function () {
            jQuery(".right-sidebar").css("width", "0px");
            jQuery(".manager-view-inner").css("width", "");
            delete $scope.selectedUser;
            delete $scope.selectedMenuItems;
        };

        // this function needed by tasks widget
        // if a user wants to dismiss a task it broadcasts the item to markasread
        $scope.markAsRead = function (items) {
            $rootScope.$broadcast("markasread", items);
        };

        //if ($routeParams.cmd = 'reload') {
        //    $route.reload();
        //}

    });
