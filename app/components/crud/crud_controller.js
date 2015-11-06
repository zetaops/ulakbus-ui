/**
 * Copyright (C) 2015 ZetaOps Inc.
 *
 * This file is licensed under the GNU General Public License v3
 * (GPLv3).  See LICENSE.txt for details.
 */

'use strict';

var crud = angular.module('ulakbus.crud', ['ui.bootstrap', 'schemaForm', 'formService']);

/**
 * CRUDAddEditCtrl is a controller
 * which provide a form with form generator.
 */

crud.controller('CRUDAddEditCtrl', function ($scope, $rootScope, $location, $http, $log, $modal, $timeout, Generator, $routeParams) {
    $scope.url = 'crud/';

    angular.forEach($routeParams, function (value, key) {
        if (key.indexOf('_id') > -1) {
            $scope.param = key;
            $scope.param_id = value;
        }
    });
    $scope.form_params = {'model': $routeParams.model, param: $scope.param, id: $scope.param_id};
    if ($routeParams.key) {
        $scope.form_params['object_id'] = $routeParams.key;
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
                .success(function (data) {
                    $location.path('/crud/' + $scope.form_params.model + '/' + $scope.form_params.param + '/' + $scope.form_params.id).search(data);

                })
                .error(function (data) {
                    $scope.message = data.title;
                });
        }

    };

});

/**
 * CRUD List Controller
 */

crud.controller('CRUDListCtrl', function ($scope, $rootScope, Generator, $routeParams) {
    $scope.url = 'crud/';
    angular.forEach($routeParams, function (value, key) {
        if (key.indexOf('_id') > -1) {
            $scope.param = key;
            $scope.param_id = value;
        }
    });
    //$scope.form_params = $routeParams;
    $scope.form_params = {'model': $routeParams.model, param: $scope.param, id: $scope.param_id};

    if ($routeParams.nobjects) {
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
 * CRUD Show Controller
 */
crud.controller('CRUDShowCtrl', function ($scope, $rootScope, $location, Generator, $routeParams) {
    $scope.url = 'crud/';

    angular.forEach($routeParams, function (value, key) {
        if (key.indexOf('_id') > -1) {
            $scope.param = key;
            $scope.param_id = value;
        }
    });

    $scope.form_params = {
        "id": $scope.param_id,
        "object_id": $routeParams.key,
        "cmd": "show",
        param: $scope.param,
        "model": $routeParams.model
    };
    // call generator's get_single_item func
    Generator.get_single_item($scope).then(function (res) {
        $scope.listobjects = {};
        $scope.object = res.data.object;

        angular.forEach($scope.object, function (value, key) {
            if (typeof value == 'object') {
                $scope.listobjects[key] = value;
                delete $scope.object[key];
            }
        });

        $scope.model = $routeParams.model;
    });
});