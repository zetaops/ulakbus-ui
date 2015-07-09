/**
 * Copyright (C) 2015 ZetaOps Inc.
 *
 * This file is licensed under the GNU General Public License v3
 * (GPLv3).  See LICENSE.txt for details.
 */

'use strict';

var auth = angular.module('zaerp.auth', ['ngRoute', 'schemaForm', 'ngCookies', 'general']);
auth.controller('LoginCtrl', function ($scope, $q, $timeout, $routeParams, Generator, LoginService) {
    $scope.url = 'simple_login';
    var form_params = {};
    form_params['clear_wf'] = 1;
    // todo: change simple login when api ready
    Generator.get_form($scope.url, form_params).then(function(data){
        var d = data.data.forms;
        for (var key in d)
            $scope[key] = d[key];
        // for email validation add asyncvalidator
        //$scope.form[0].$asyncValidators = Generator.asyncValidators;
        // add submit button to the form todo: move this to form service
        //$scope.form.push(
        //    {
        //        type: "submit",
        //        title: "Save"
        //    }
        //);
        $scope.form = [
            "*",
            { key: "password", type: "password"},
            { type: 'submit', title: 'Save' }
        ];
    });
    $scope.onSubmit = function (form) {
        $scope.$broadcast('schemaFormValidate');
        if (form.$valid) {
            LoginService.login($scope.url, $scope.model);
        }
        else {
            console.log("not valid");
        }
    }
});