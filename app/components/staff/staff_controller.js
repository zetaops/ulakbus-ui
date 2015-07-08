/**
 * Copyright (C) 2015 ZetaOps Inc.
 *
 * This file is licensed under the GNU General Public License v3
 * (GPLv3).  See LICENSE.txt for details.
 */

'use strict';


var staff = angular.module('zaerp.staff', ['ngRoute', 'schemaForm', 'formService']);


/**
 * StaffAddEditCtrl is a controller
 * which provide a form with form generator.
 */

//staff.controller('StaffAddCtrl', function ($scope, $http, $log, Generator) {
//    Generator.get_form('add_staff', '').then(function (d) {
//        $scope.schema = d.schema;
//        $scope.form = d.form;
//        $scope.model = d.model ? d.model : {};
//        $scope.initialModel = angular.copy(d.model);
//        $scope.form[0].$asyncValidators = Generator.asyncValidators;
//        $scope.form.push(
//            {
//                type: "submit",
//                title: "Save"
//            }
//        );
//        return $scope;
//    });
//    $scope.onSubmit = function (form) {
//        $scope.$broadcast('schemaFormValidate');
//        if (form.$valid) {
//            Generator.submit('add_staff', $scope);
//        }
//    }
//});

staff.controller('StaffAddEditCtrl', function ($scope, $http, $log, Generator, $routeParams) {
    $scope.url = 'personel_duzenle_basitlestirilmis';
    var form_params = {};
    if ($routeParams.id) {
        form_params['id'] = $routeParams.id;
        form_params['cmd'] = 'edit_object';
    }
    else {
        form_params['cmd'] = 'add_object';
    }
    form_params['clear_wf'] = 1;
    Generator.get_form($scope.url, form_params).then(function (data) {
        var d = data.data.forms;
        console.log(d);
        $scope.schema = d.schema;
        $scope.form = d.form;
        delete $scope.form[0];
        //$scope.form.push({"key": "birth_date", "format": "yyyy-mm-dd"});
        $scope.model = d.model ? d.model : {};
        $scope.initialModel = angular.copy(d.model);
        //$scope.form.push($asyncValidators: Generator.asyncValidators);
        $scope.form.push(
            {
                type: "submit",
                title: "Save"
            }
        );
    });
    $scope.onSubmit = function (form) {
        $scope.$broadcast('schemaFormValidate');
        if (form.$valid) {
            Generator.submit($scope);
        }
    }
});

// todo: for single point of failure code a "get item" service and use it to
// retrieve list and single item

/**
 * Staff List Controller
 */

staff.controller('StaffListCtrl', function ($scope, $http, RESTURL) {
    $http.post(RESTURL.url + 'personel_duzenle_basitlestirilmis').then(function (res) {
        $scope.staffs = res.data;
    })
});

/**
 * Staff Show Controller
 */
staff.controller('StaffShowCtrl', function ($scope, $http, RESTURL, $routeParams) {
    $http.post(RESTURL.url + 'personel_duzenle_basitlestirilmis').then(function (res) {
        $scope.staff = res.data[0];
    })
});