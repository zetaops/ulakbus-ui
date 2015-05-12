'use strict';

// Declare app level module which depends on views, and components
angular.module('zaerp', ['ngRoute', 'zaerp.login', 'zaerp.view2', 'zaerp.version', 'schemaForm']).
    config(['$routeProvider', function ($routeProvider) {
        console.log("redirect to login");
        $routeProvider.otherwise({redirectTo: '/view2'});
    }]).
    run(function ($rootScope, $location) {
        $rootScope.$on("$routeChangeStart", function (event, next, current) {
            if ($rootScope.loggedInUser == null) {
                // no logged user, redirect to /login
                console.log("test log");
                if (next.templateUrl === "login/login.html") {
                    console.log("test log to login");
                } else {
                    console.log("test log logged");
                    $location.path("/login");
                }
            }
        });
    });
