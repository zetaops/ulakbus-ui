/**
 * Copyright (C) 2015 ZetaOps Inc.
 *
 * This file is licensed under the GNU General Public License v3
 * (GPLv3).  See LICENSE.txt for details.
 */

'use strict';


var staff = angular.module('zaerp.staff',['ngRoute','schemaForm', 'formService']);


/**
 * StaffCtrl is a controller
 * which provide a form with form generator.
 */

staff.controller('StaffAddEditCtrl', function($scope, $http, $log, Generator, $routeParams){
    Generator.get_form('add_staff', $routeParams).then(function(d){
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
    });
    $scope.onSubmit = function(form){
        $scope.$broadcast('schemaFormValidate');
        if (form.$valid) {
            // todo: implement form diff here
            $log.info($scope);
        }
    }
});