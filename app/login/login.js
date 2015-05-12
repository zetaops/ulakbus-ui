'use strict';

angular.module('zaerp.login', ['ngRoute'])

    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/login', {
            templateUrl: 'login/login.html',
            controller: 'LoginCtrl'
        });
    }])
    .controller('LoginCtrl', [function () {
        $scope.schema =
        {
            title: "Login",
            type: "object",
            properties: {
                email: {
                    type: "string",
                    title: "Email",
                    pattern: "^[A-Z]"
                },
                pass: {
                    type: "string",
                    title: "Password",
                    pattern: "^[A-Z]"
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
            required: ["email", "pass", "who"]
        };
        $scope.fields = ["email", "pass", "who", "remember"];
        $scope.model = {
            email: "user@example.com",
            remember: false
        };
        //$scope.form = [
        //    "*",
        //    {
        //        type: "submit",
        //        title: "Save"
        //    }
        //];
    }]);

//
//angular.module('loginApp', [])
//    .controller('FormController', [function ($scope) {
//        $scope.schema =
//        {
//            title: "Login",
//            type: "object",
//            properties: {
//                email: {
//                    type: "string",
//                    title: "Email",
//                    pattern: "^[A-Z]"
//                },
//                pass: {
//                    type: "string",
//                    title: "Password",
//                    pattern: "^[A-Z]"
//                },
//                remember: {
//                    type: "boolean",
//                    title: "Remember me?"
//                },
//                who: {
//                    title: "Who are you?",
//                    type: "string",
//                    enum: ["student", "stuff", "dean"]
//                }
//            },
//            required: ["email", "pass", "who"]
//        };
//        $scope.fields = ["email", "pass", "who", "remember"];
//        $scope.model = {
//            email: "user@example.com",
//            remember: false
//        };
//        $scope.form = [
//            "*",
//            {
//                type: "submit",
//                title: "Save"
//            }
//        ];
//    }]);