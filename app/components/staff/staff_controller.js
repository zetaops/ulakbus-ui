/**
 * Copyright (C) 2015 ZetaOps Inc.
 *
 * This file is licensed under the GNU General Public License v3
 * (GPLv3).  See LICENSE.txt for details.
 */

'use strict';


var staff = angular.module('zaerp.staff', ['ngRoute', 'schemaForm', 'formService', 'ui.bootstrap']);


/**
 * StaffAddEditCtrl is a controller
 * which provide a form with form generator.
 */

staff.controller('StaffAddEditCtrl', function ($scope, $rootScope, $location, $http, $log, $modal, Generator, $routeParams) {
    $scope.url = 'personel_duzenle_basitlestirilmis';
    $scope.form_params = {};
    if ($routeParams.id) {
        $scope.form_params['object_id'] = $routeParams.id;
        $scope.form_params['cmd'] = 'edit_object';
    }
    else {
        $scope.form_params['cmd'] = 'add_object';
    }
    // to start in certain part of the workflow use clear_wf=1
    $scope.form_params['clear_wf'] = 1;

    // get form with generator
    Generator.get_form($scope);

    $scope.onSubmit = function (form) {
        $scope.$broadcast('schemaFormValidate');
        if (form.$valid) {
            Generator.submit($scope)
                .success(function(data){
                    $location.path("/staffs");
                })
                .error(function(data){
                    $scope.message = data.title;
                });
        }
    };
});

// todo: for single point of failure code a "get item" service and use it to
// retrieve list and single item

/**
 * Staff List Controller
 */

staff.controller('StaffListCtrl', function ($scope, $rootScope, Generator) {
    $scope.url = 'personel_duzenle_basitlestirilmis';
    $scope.form_params = {"clear_wf": 1};
    // call generator's get_list func
    Generator.get_list($scope)
        .then(function (res) {
            var data =  res.data.employees;
            for (var item in data){
                delete data[item].data['deleted'];
                delete data[item].data['timestamp'];
            }
            $scope.staffs = data;
        });
});

/**
 * Staff Show Controller
 */
staff.controller('StaffShowCtrl', function ($scope, $rootScope, Generator, $routeParams) {
    $scope.url = 'personel_duzenle_basitlestirilmis';
    $scope.form_params = {"object_id": $routeParams.id, "clear_wf": 1};
    // call generator's get_single_itemfunc
    Generator.get_single_item($scope).then(function (res) {
        $scope.staff = res.data.employees[0].data;
    })
});