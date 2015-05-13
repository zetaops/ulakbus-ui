'use strict';

// TODO: clean console log items
// TODO: password hash or not??
// TODO: who field can be removed??

var login = angular.module('zaerp.login', ['ngRoute', 'schemaForm']);
login.config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/login', {
            templateUrl: 'login/login.html',
            controller: 'LoginCtrl'
        });
    }]);
login.controller('LoginCtrl', function ($scope, $http, $location, $rootScope, AUTH_EVENTS, LoginService) {
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
                type: "email"
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
        $scope.onSubmit = function(form){
            $scope.$broadcast('schemaFormValidate');
            if (form.$valid){

                var credentials = {email: form.email.$modelValue, password: form.password.$modelValue};
                console.log(form);
                var loginResponse = LoginService.login(credentials);
                console.log(loginResponse);
            }
            else {
                console.log("not valid");
            }
        }
    });