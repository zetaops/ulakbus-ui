'use strict';

var testform = angular.module('zaerp.test', ['ngRoute', 'schemaForm']);
testform.config(['$routeProvider', function ($routeProvider) {
    $routeProvider.when('/test', {
        templateUrl: 'test_view_for_generator/test_template.html',
        controller: 'TestCtrl'
    });
}]);

testform.controller('TestCtrl', function($scope, $q, $timeout, Generator){
    $scope.form = Generator.generate('add_student', '');
});