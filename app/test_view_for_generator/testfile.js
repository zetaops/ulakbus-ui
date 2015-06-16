'use strict';

var testform = angular.module('zaerp.', ['ngRoute', 'schemaForm', 'formGenerator']);


testform.controller('RecordCtrl', function($scope, $http, $timeout, $log, Generator, RESTURL){
    $scope.form = Generator.generate('add_student', '');
    $log.info($scope.form);
    $http.get(RESTURL.url + 'add_student').then(function(res){
        $log.info(res.data);
    });
});