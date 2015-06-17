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

student.controller('StudentAddCtrl', function($scope, $http, $log, $q, $timeout, Generator, $routeParams){
    Generator.get_form('add_student', $routeParams).then(function(d){
        $scope.schema = d.schema;
        $scope.form = d.form;
        $scope.form[0].$asyncValidators = {
            emailNotValid: function (value) {
                var deferred = $q.defer();
                $timeout(function () {
                    if (Generator.isValidEmail(value)) {
                        deferred.resolve();
                    } else {
                        deferred.reject();
                    }
                }, 500);
                return deferred.promise;
            }
        }
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