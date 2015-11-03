/**
 * Copyright (C) 2015 ZetaOps Inc.
 *
 * This file is licensed under the GNU General Public License v3
 * (GPLv3).  See LICENSE.txt for details.
 */

'use strict';

var auth = angular.module('ulakbus.auth', ['ngRoute', 'schemaForm', 'ngCookies', 'general']);
auth.controller('LoginCtrl', function ($scope, $q, $timeout, $routeParams, Generator, LoginService) {
    $scope.url = 'login';
    $scope.form_params = {};
    $scope.form_params['clear_wf'] = 1;
    Generator.get_form($scope).then(function(data){
        $scope.form = [
            { key: "username", type: "string", title: "Kullanıcı Adı"},
            { key: "password", type: "password", title: "Şifre"},
            { type: 'submit', title: 'Giriş Yap' }
        ];
    });
    $scope.onSubmit = function (form) {
        $scope.$broadcast('schemaFormValidate');
        if (form.$valid) {
            LoginService.login($scope.url, $scope.model)
                .error(function(data){
                    $scope.message = data.title;
                })
        }
        else {
            console.log("not valid");
        }
    }
});