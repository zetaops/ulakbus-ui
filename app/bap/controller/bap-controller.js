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
     * @ngdoc controller
     * @name DashboardController
     * @description DashboardController controller is the main controller for BAP main page
     * This controller play important role in sending data to its child directives
     *
     * @returns {object}
     */
    .controller('DashboardController', function ($scope, $location, Generator, $http, toastr) {
        $scope.user_ready = false;
        //this will be API call in controller load
        $scope.dashboardData = {};
        var dashboardEndpoint = 'bap_anasayfa';
        $http.post(Generator.makeUrl(dashboardEndpoint), {})
            .success(function (response, status) {
                if(status===200){
                    $scope.dashboardData = response;
                }else{
                    toastr.error('Tekrar dene');
                }
                $scope.user_ready = true;
            });

        $scope.clickAnnouncement = function (announcement) {
            $location.path("/" + announcement.wf);
        };

        $scope.clickMore = function (workFlow) {
            $location.path("/" + workFlow);
        };
    })


