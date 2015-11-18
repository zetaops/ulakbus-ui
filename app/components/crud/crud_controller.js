/**
 * Copyright (C) 2015 ZetaOps Inc.
 *
 * This file is licensed under the GNU General Public License v3
 * (GPLv3).  See LICENSE.txt for details.
 */

'use strict';

var crud = angular.module('ulakbus.crud', ['ui.bootstrap', 'schemaForm', 'formService']);

/**
 *
 */
crud.service('CrudUtility', function () {
    return {
        generateParam: function (scope, routeParams, cmd) {
            // define api request url path
            scope.url = routeParams.wf;
            angular.forEach(routeParams, function (value, key) {
                if (key.indexOf('_id') > -1 && key !== 'param_id') {
                    scope.param = key;
                    scope.param_id = value;
                }
            });
            scope.form_params = {
                cmd: cmd,
                model: routeParams.model,
                param: scope.param || routeParams.param,
                id: scope.param_id || routeParams.param_id,
                wf: routeParams.wf,
                object_id: routeParams.key
            };
            return scope;
        },
        listPageItems: function (scope, pageData) {
            angular.forEach(pageData, function (value, key) {
                scope[key] = value;
            });
        }
    }
});

/**
 *
 */
crud.controller('CRUDCtrl', function ($scope, $routeParams, Generator, CrudUtility) {
    // get required params by calling CrudUtility.generateParam function
    CrudUtility.generateParam($scope, $routeParams);
    Generator.get_wf($scope);
});

/**
 * CRUDAddEditCtrl is a controller
 * which provide a form with form generator.
 */

crud.controller('CRUDFormCtrl', function ($scope, $rootScope, $location, $http, $log, $modal, $timeout, Generator, $routeParams, CrudUtility) {
    // get form with generator
    if ($routeParams.pageData) {
        CrudUtility.generateParam($scope, Generator.getPageData(), 'form');
        Generator.generate($scope, Generator.getPageData());
    } else {
        CrudUtility.generateParam($scope, $routeParams, 'form');
        Generator.get_form($scope);
    }

    $scope.onSubmit = function (form) {
        $scope.$broadcast('schemaFormValidate');
        if (form.$valid) {
            Generator.submit($scope);
        }
    };

});

/**
 * CRUD List Controller
 */

crud.controller('CRUDListCtrl', function ($scope, $rootScope, Generator, $routeParams, CrudUtility) {
    CrudUtility.generateParam($scope, $routeParams, 'list');

    if ($routeParams.pageData) {
        var pageData = Generator.getPageData();
        CrudUtility.listPageItems($scope, pageData);
    }
    else {
        // call generator's get_list func
        Generator.get_list($scope)
            .then(function (res) {
                CrudUtility.listPageItems($scope, res.Data);
            });
    }

    $scope.do_action = function (key, action) {
        Generator.doItemAction($scope, key, action);
    }
});

/**
 * CRUD Show Controller
 */
crud.controller('CRUDShowCtrl', function ($scope, $rootScope, $location, Generator, $routeParams, CrudUtility) {
    CrudUtility.generateParam($scope, $routeParams, 'show');
    // todo: refactor createListObjects func
    var createListObjects = function () {
        angular.forEach($scope.object, function (value, key) {
            if (typeof value == 'object') {
                $scope.listobjects[key] = value;
                delete $scope.object[key];
            }
        });
    };

    $scope.listobjects = {};

    if ($routeParams.pageData) {
        var pageData = Generator.getPageData();
        $scope.object = pageData.object;
    }
    else {
        // call generator's get_single_item func
        Generator.get_single_item($scope).then(function (res) {
            $scope.object = res.data.object;
            $scope.model = $routeParams.model;
        });
    }
    createListObjects();
});