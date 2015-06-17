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

var student = angular.module('zaerp.student.add', ['ngRoute', 'schemaForm', 'formService']);

/**
 * StudentAddCtrl
 * to add student, provide form with form generator
 */

student.controller('StudentAddCtrl', function($scope, $http, $log, Generator, $routeParams){
    Generator.get_form('add_student', $routeParams).then(function(d){
        $scope.schema = d.schema;
        $scope.form = d.form;
        $scope.form[0].$asyncValidators = Generator.asyncValidators;
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
            $log.info(form);
        }
        else {
            $log.info("not valid");
        }
    }
});