/**
 * Created by erkanderon on 18.06.2015.
 */
'use strict';


var staff = angular.module('zaerp.staff.add',['ngRoute','schemaForm', 'formService']);


/* StaffCtrl is a controller
which provide a form with form generator.
 */

staff.controller('StaffCtrl', function($scope, $http, $log, Generator, $routeParams){
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