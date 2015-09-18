/**
 * Copyright (C) 2015 ZetaOps Inc.
 *
 * This file is licensed under the GNU General Public License v3
 * (GPLv3).  See LICENSE.txt for details.
 */

'use strict';


var crud = angular.module('ulakbus.crud', ['ngRoute', 'schemaForm', 'formService', 'ui.bootstrap']);


/**
 * CRUDAddEditCtrl is a controller
 * which provide a form with form generator.
 */

crud.controller('CRUDAddEditCtrl', function ($scope, $rootScope, $location, $http, $log, $modal, $timeout, Generator, $routeParams) {
    $scope.url = 'crud';
    $scope.form_params = {'model': $routeParams.model};
    if ($routeParams.id) {
        $scope.form_params['object_id'] = $routeParams.id;
        $scope.form_params['cmd'] = 'edit';
    }
    else {
        $scope.form_params['cmd'] = 'add';
    }

    // get form with generator
    if ($routeParams.model) {
        Generator.get_form($scope);
    }

    $scope.onSubmit = function (form) {
        $scope.$broadcast('schemaFormValidate');

        if (form.$valid) {
            Generator.submit($scope)
                .success(function(data){
                    $location.path("/crud");
                })
                .error(function(data){
                    $scope.message = data.title;
                });
        }
    };

});

/**
 * CRUD List Controller
 */

crud.controller('CRUDListCtrl', function ($scope, $rootScope, Generator, $routeParams) {
    $scope.url = 'crud';
    $scope.form_params = {"model": $routeParams.model};
    // call generator's get_list func
    Generator.get_list($scope)
        .then(function (res) {
            $scope.nobjects = res.data.nobjects;
            $scope.model = $routeParams.model;
        });
});

/**
 * CRUD Show Controller
 */
crud.controller('CRUDShowCtrl', function ($scope, $rootScope, Generator, $routeParams) {
    $scope.url = 'crud';
    $scope.form_params = {"object_id": $routeParams.id, "cmd": "show", "model": $routeParams.model};
    // call generator's get_single_itemfunc
    Generator.get_single_item($scope).then(function (res) {
        $scope.object = res.data.object;
        $scope.model = $routeParams.model;
    })
});