/**
 * Created by erkanderon on 19.06.2015.
 */
'use strict';


var staff = angular.module('zaerp.types',['ngRoute','schemaForm', 'formService']);

staff.controller('TypeCtrl', function($scope, $http, $log, Generator, $routeParams){
    Generator.get_form('input_types', $routeParams).then(function(d){

        $scope.congressFilter = "Choice";
        $scope.schema = d.schema;
        $scope.form = d.form;
        // model is the init data of the form or in edit templates
        $scope.model = {};
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
            $log.info($scope);
        }
    }


});