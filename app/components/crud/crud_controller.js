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
            // why do this??
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
            scope.model = scope.form_params.model;
            scope.wf = scope.form_params.wf;
            scope.param = scope.form_params.param;
            scope.param_id = scope.form_params.id;
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
 *
 */
crud.controller('CRUDListFormCtrl', function ($scope, $rootScope, $location, $http, $log, $modal, $timeout, Generator, $routeParams, CrudUtility) {
    if ($routeParams.cmd==='show') {
        CrudUtility.generateParam($scope, $routeParams, $routeParams.cmd);
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

        var pageData = Generator.getPageData();
        if (pageData.pageData === true) {
            $scope.object = pageData.object;
            Generator.setPageData({pageData: false});
        }
        else {
            // call generator's get_single_item func
            Generator.get_single_item($scope).then(function (res) {
                $scope.object = res.data.object;
                $scope.model = $routeParams.model;
            });
        }
        createListObjects();
    }

    if ($routeParams.cmd==='form' || $routeParams.cmd==='list') {
        // function to set scope objects
        var setpageobjects = function (data) {
            CrudUtility.listPageItems($scope, data);
            Generator.generate($scope, data);
            Generator.setPageData({pageData: false});
        };

        // get pageData from service
        var pageData = Generator.getPageData();

        // if pageData exists do not call get_wf function and manipulate page with pageData
        if (pageData.pageData === true) {
            $log.debug('pagedata', pageData.pageData);
            CrudUtility.generateParam($scope, pageData, $routeParams.cmd);
            setpageobjects(pageData, pageData);
        }
        // if pageData didn't defined or is {pageData: false} go get data from api with get_wf function
        if (pageData.pageData === undefined || pageData.pageData === false) {
            CrudUtility.generateParam($scope, $routeParams, $routeParams.cmd);
            Generator.get_wf($scope);
        }

        // we use form generator for generic forms. this makes form's scope to confuse on the path to generate form
        // object by its name. to manage to locate the form to controllers scope we use a directive called form locator
        // a bit dirty way to find form working on but solves our problem
        $scope.$on('formLocator', function(event) {
            $scope.formgenerated = event.targetScope.formgenerated;
        });

        $scope.onSubmit = function (form) {
            $scope.$broadcast('schemaFormValidate');
            if (form.$valid) {
                Generator.submit($scope);
            }
        };

        $scope.do_action = function (key, action) {
            Generator.doItemAction($scope, key, action);
        };
    }

});

crud.directive('crudListDirective', function () {
    return {
        templateUrl: 'components/crud/templates/list.html',
        restrict: 'E',
        replace: true
    };
});

crud.directive('crudFormDirective', function () {
    return {
        templateUrl: 'components/crud/templates/form.html',
        restrict: 'E',
        replace: true
    };
});

crud.directive('crudShowDirective', function () {
    return {
        templateUrl: 'components/crud/templates/show.html',
        restrict: 'E',
        replace: true
    };
});

crud.directive('formLocator', function() {
    return {
        link: function(scope) {
            scope.$emit('formLocator');
        }
    }
});