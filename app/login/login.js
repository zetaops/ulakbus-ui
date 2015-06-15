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

var login = angular.module('zaerp.login', ['ngRoute', 'schemaForm']);
login.controller('LoginCtrl', function ($scope, $q, $timeout, LoginService) {
    $scope.schema =
    {
        title: "Login",
        type: "object",
        properties: {
            email: {
                type: "email",
                title: "Email"
            },
            password: {
                type: "string",
                title: "Password"
            },
            remember: {
                type: "boolean",
                title: "Remember me?"
            },
            who: {
                title: "Who are you?",
                type: "string",
                enum: ["student", "stuff", "dean"]
            }
        },
        required: ["email", "password", "who"]
    };
    $scope.model = {
        email: "user@example.com",
        remember: false
    };
    $scope.form = [
        {
            key: "email",
            type: "email",
            validationMessages: {
                'emailNotValid': 'Email is not valid!'
            },
            $asyncValidators: {
                emailNotValid: function (value) {
                    var deferred = $q.defer();
                    $timeout(function () {
                        if (LoginService.isValidEmail(value)) {
                            deferred.resolve();
                        } else {
                            deferred.reject();
                        }
                    }, 500);
                    return deferred.promise;
                }
            }
        },
        {
            key: "password",
            type: "password"
        },
        "remember",
        "who",
        {
            type: "submit",
            title: "Save"
        }
    ];
    $scope.onSubmit = function (form) {
        $scope.$broadcast('schemaFormValidate');
        if (form.$valid) {
            var credentials = {email: form.email.$modelValue, password: form.password.$modelValue};
            LoginService.login(credentials);
        }
        else {
            console.log("not valid");
        }
    }
});