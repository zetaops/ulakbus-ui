/**
 * Copyright (C) 2015 ZetaOps Inc.
 *
 * This file is licensed under the GNU General Public License v3
 * (GPLv3).  See LICENSE.txt for details.
 */

'use strict';

var studentAdd = angular.module('zaerp.student.add', ['ngRoute', 'schemaForm', 'formService']);


studentAdd.controller('StudentAddCtrl', function($scope, $http, $timeout, $log, Generator, RESTURL){
    $scope.form = Generator.generate('add_student', '');
    $log.info($scope.form);
    $http.get(RESTURL.url + 'add_student').then(function(res){
        $log.info(res.data);
    });
});