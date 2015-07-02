/**
 * Copyright (C) 2015 ZetaOps Inc.
 *
 * This file is licensed under the GNU General Public License v3
 * (GPLv3).  See LICENSE.txt for details.
 */

'use strict';


var staff = angular.module('zaerp.staff', ['ngRoute', 'schemaForm', 'formService']);


/**
 * StaffCtrl is a controller
 * which provide a form with form generator.
 */

staff.controller('StaffAddCtrl', function ($scope, $http, $log, Generator, $routeParams) {
    Generator.get_form('add_staff', '').then(function (d) {
        $scope.schema = d.schema;
        $scope.form = d.form;
        $scope.model = d.model ? d.model : {};
        $scope.form[0].$asyncValidators = Generator.asyncValidators;
        $scope.form.push(
            {
                type: "submit",
                title: "Save"
            }
        );
        return $scope;
    });
    $scope.onSubmit = function (form) {
        $scope.$broadcast('schemaFormValidate');
        if (form.$valid) {
            // todo: implement form diff here
            $log.info($scope);
        }
    }
});

staff.controller('StaffEditCtrl', function ($scope, $http, $log, Generator, $routeParams) {
    Generator.get_form('edit_staff', {id: $routeParams.id}).then(function (d) {
        $scope.schema = d.schema;
        $scope.form = d.form;
        $scope.model = d.model ? d.model : {};
        $scope.form[0].$asyncValidators = Generator.asyncValidators;
        $scope.form.push(
            {
                type: "submit",
                title: "Save"
            }
        );
        return $scope;
    });
    $scope.onSubmit = function (form) {
        $scope.$broadcast('schemaFormValidate');
        if (form.$valid) {
            // todo: implement form diff here
            $log.info($scope);
        }
    }
});

/**
 * Staff List Controller
 */

staff.controller('StaffListCtrl', function($scope, $http){
    $http.get('http://127.0.0.1:3000/api/list_staff').then(function(res){
        $scope.staffs = res.data;
    })
});

/**
 * Staff Show Controller
 */
staff.controller('StaffShowCtrl', function($scope, $http, $routeParams){
    $http.get('http://127.0.0.1:3000/api/list_staff/').then(function(res){
        $scope.staff = res.data[0];
    })
});