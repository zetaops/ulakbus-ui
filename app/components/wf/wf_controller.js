/**
 * Copyright (C) 2015 ZetaOps Inc.
 *
 * This file is licensed under the GNU General Public License v3
 * (GPLv3).  See LICENSE.txt for details.
 */

'use strict';


var wf = angular.module('ulakbus.wf', ['ui.bootstrap', 'schemaForm', 'formService']);


/**
 * CRUDAddEditCtrl is a controller
 * which provide a form with form generator.
 */

wf.controller('WFAddEditCtrl', function ($scope, $rootScope, $location, $http, $log, $modal, $timeout, Generator, $routeParams) {
    $scope.url = ""; debugger;
    $scope.form_params = {'model': $routeParams.model};
    //if ($routeParams.id) {
    //    $scope.form_params['object_id'] = $routeParams.id;
    //    $scope.form_params['cmd'] = 'edit';
    //}
    //else {
    //    $scope.form_params['cmd'] = 'add';
    //}

    // get form with generator
    if ($routeParams.model) {
        Generator.get_form($scope);
    }

    $scope.onSubmit = function (form) {
        $scope.$broadcast('schemaFormValidate');

        if (form.$valid) {
            Generator.submit($scope)
                .success(function(data){

                })
                .error(function(data){
                    //$scope.message = data.title;
                });
        }
    };

});

/**
 * WorkFlow List Controller
 */

wf.controller('WFListCtrl', function ($scope, $rootScope, Generator, $routeParams) {
    $scope.url = "";
    $scope.form_params = $routeParams;

    if ($routeParams.nobjects){
        $scope.nobjects = $routeParams.nobjects;
        $scope.model = $routeParams.model;
    } else {
        // call generator's get_list func
        Generator.get_list($scope)
            .then(function (res) {
                $scope.nobjects = res.data.nobjects;
                $scope.model = $routeParams.model;
            });
    }
});

/**
 * WorkFlow Show Controller
 */
wf.controller('WFShowCtrl', function ($scope, $rootScope, Generator, $routeParams) {
    $scope.url = "";
    $scope.form_params = {"object_id": $routeParams.id, "cmd": "show", "model": $routeParams.model};
    // call generator's get_single_itemfunc
    Generator.get_single_item($scope).then(function (res) {
        $scope.listobjects = {};
        $scope.object = res.data.object;

        angular.forEach($scope.object, function (value, key) {
            if(typeof value == 'object'){
                $scope.listobjects[key] = value;
                delete $scope.object[key];
            }
        });

        $scope.model = $routeParams.model;
    })
});