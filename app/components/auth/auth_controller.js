/**
 * @license Ulakbus-UI
 * Copyright (C) 2015 ZetaOps Inc.
 *
 * This file is licensed under the GNU General Public License v3
 * (GPLv3).  See LICENSE.txt for details.
 */

'use strict';

/**
 * @ngdoc module
 * @name ulakbus.auth
 * @description
 * ulakbus.auth module handles authorization process of ulakbus-ui.
 *
 * @requires ngRoute
 * @requires schemaForm
 * @requires ngCookies
 */
angular.module('ulakbus.auth', ['ngRoute', 'schemaForm', 'ngCookies'])
    /**
     * @ngdoc controller
     * @name LoginCtrl
     * @module ulakbus.auth
     * @description
     * LoginCtrl responsible to handle login process.
     * Using 'formService.get_form' function generates the login form and post it to the API with input datas.
     */
    .controller('LoginCtrl', function ($scope, $q, $timeout, $routeParams, $rootScope, $log, Generator, LoginService) {
        $scope.url = 'login';
        $scope.form_params = {};
        $scope.form_params['clear_wf'] = 1;
        Generator.get_form($scope).then(function (data) {
            $scope.form = [
                {key: "username", type: "string", title: "Kullanıcı Adı"},
                {key: "password", type: "password", title: "Şifre"},
                {type: 'submit', title: 'Giriş Yap'}
            ];
        });
        $scope.loggingIn = false;
        $scope.onSubmit = function (form) {
            $scope.$broadcast('schemaFormValidate');
            if (form.$valid) {
                $scope.loggingIn = true;
                $rootScope.loginAttempt = 1;
                LoginService.login($scope.url, $scope.model)
                    .error(function (data) {
                        $scope.message = data.title;
                    })
                    .then(function () {
                        $scope.loggingIn = false;
                    })
            }
            else {
                $log.debug("not valid");
            }
        };
        $log.debug('login attempt: ', $rootScope.loginAttempt);

    });