/**
 * Copyright (C) 2015 ZetaOps Inc.
 *
 * This file is licensed under the GNU General Public License v3
 * (GPLv3).  See LICENSE.txt for details.
 */

'use strict';

// TODO: clean console log items
// TODO: password hash or not??
// TODO: who field can be removed??
// todo: use zetalib/forms/form_service functions for email validation

var auth = angular.module('zaerp.auth', ['ngRoute', 'schemaForm', 'ngCookies', 'general']);
auth.controller('LoginCtrl', function ($scope, $q, $timeout, $routeParams, Generator, LoginService) {
    $scope.url = 'simple_login';

    // todo: change simple login when api ready
    Generator.get_form($scope.url, $routeParams).then(function(d){
        $scope.schema = d.schema;
        $scope.form = d.form;
        // model is the init data of the form or in edit templates
        $scope.model = d.model ? d.model : {};
        $scope.initialModel = angular.copy(d.model);
        // for email validation add asyncvalidator
        //$scope.form[0].$asyncValidators = Generator.asyncValidators;
        // add submit button to the form todo: move this to form service
        $scope.form.push(
            {
                type: "submit",
                title: "Save"
            }
        );
    });
    //$scope.schema =
    //{
    //    title: "Login",
    //    type: "object",
    //    properties: {
    //        email: {
    //            type: "email",
    //            title: "Email"
    //        },
    //        password: {
    //            type: "string",
    //            title: "Password"
    //        },
    //        remember: {
    //            type: "boolean",
    //            title: "Remember me?"
    //        },
    //        who: {
    //            title: "Who are you?",
    //            type: "string",
    //            enum: ["student", "stuff", "dean"]
    //        }
    //    },
    //    required: ["email", "password", "who"]
    //};
    //$scope.model = {
    //    email: "user@example.com",
    //    remember: false
    //};
    //$scope.form = [
    //    {
    //        key: "email",
    //        type: "email",
    //        validationMessages: {
    //            'emailNotValid': 'Email is not valid!'
    //        },
    //        $asyncValidators: {
    //            emailNotValid: function (value) {
    //                var deferred = $q.defer();
    //                $timeout(function () {
    //                    if (LoginService.isValidEmail(value)) {
    //                        deferred.resolve();
    //                    } else {
    //                        deferred.reject();
    //                    }
    //                }, 500);
    //                return deferred.promise;
    //            }
    //        }
    //    },
    //    {
    //        key: "password",
    //        type: "password"
    //    },
    //    "remember",
    //    "who",
    //    {
    //        type: "submit",
    //        title: "Save"
    //    }
    //];
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