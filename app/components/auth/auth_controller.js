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
 * @module ulakbus.auth
 * @description ulakbus.auth module handles authorization process of ulakbus-ui.
 *
 * @requires ngRoute
 * @requires ngCookies
 */
angular.module('ulakbus.auth', ['ngRoute', 'ngCookies'])
    /**
     * @memberof ulakbus.auth
     * @ngdoc controller
     * @name LoginCtrl
     * @description LoginCtrl responsible to handle login process.<br>
     * Using 'ulakbus.formService.get_form' function generates the login form and post it to the API with input datas.
     */
    .controller('LoginController', function ($scope, $q, $timeout, $location, $routeParams, $rootScope, $log, WSOps, Generator, AuthService) {
        $scope.showLogo = false;
        $scope.url = 'login';
        $scope.form_params = {};
        $scope.form_params['clear_wf'] = 1;
        // if websocket status is open ---> ws close
        AuthService.get_form($scope).then(function (data) {
            if (data.login) { $location.path('/'); }
            $scope.form = [
                {key: "username", type: "string", title: "Kullanıcı Adı"},
                {key: "password", type: "password", title: "Şifre"},
                {
                    type: "section",
                    htmlClass: "form-inline",
                    items: [
                        {
                            type: 'submit',
                            title: 'Giriş Yap'
                        },
                        {
                            type: 'button',
                            title: 'Şifremi Unuttum'
                        }
                    ]
                }
            ];
            $scope.showForm = true;
        });
        $scope.loggingIn = false;
        $scope.onSubmit = function (form) {
            $scope.$broadcast('schemaFormValidate');
            if (form.$valid) {
                $scope.loggingIn = true;
                $rootScope.loginAttempt = 1;
                Generator.button_switch(false);
                AuthService.login($scope.url, $scope.model)
                    .success(function (data) {
                        $scope.message = data.title;
                        $scope.loggingIn = false;
                    })
                    .error(function (data) {
                        $scope.message = data.title;
                        $scope.loggingIn = false;
                    })
                    .then(function () {
                        $scope.loggingIn = false;
                        Generator.button_switch(true);
                    })
            }
            else {
                $log.debug("not valid");
            }
        };
        $log.debug('login attempt: ', $rootScope.loginAttempt);

    });
