/**
 * Copyright (C) 2015 ZetaOps Inc.
 *
 * This file is licensed under the GNU General Public License v3
 * (GPLv3).  See LICENSE.txt for details.
 */

'use strict';

/**
 * student module is base module object for student operations
 */

var student = angular.module('zaerp.student.add', ['ngRoute', 'schemaForm', 'formService', 'general']);

/**
 * StudentAddCtrl
 * to add student, provide form with form generator
 */

student.controller('StudentAddEditCtrl', function($scope, $http, $log, Generator, $routeParams){
    Generator.get_form('add_student', $routeParams).then(function(d){
        $scope.schema = d.schema;
        $scope.form = d.form;
        // model is the init data of the form or in edit templates
        $scope.model = d.model;
        $scope.initialModel = angular.copy(d.model);
        // for email validation add asyncvalidator
        $scope.form[0].$asyncValidators = Generator.asyncValidators;
        // add submit button to the form todo: move this to form service
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
            // todo: implement form diff here
            $log.info($scope.initialModel, $scope.model);
        }
    }
});