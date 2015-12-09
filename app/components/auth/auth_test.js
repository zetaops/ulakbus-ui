/**
 * @license Ulakbus-UI
 * Copyright (C) 2015 ZetaOps Inc.
 *
 * This file is licensed under the GNU General Public License v3
 * (GPLv3).  See LICENSE.txt for details.
 */

'use strict';

describe('ulakbus.auth module', function () {

    // load dependencies of modules e.g REST_URL
    beforeEach(module('ulakbus'));
    beforeEach(module('ulakbus.auth'));

    describe('login controller and service', function () {

        it('should have a login controller', inject(function () {
            expect('ulakbus.auth.LoginCtrl').toBeDefined();
        }));

        var $controller;
        var $rootScope;

        beforeEach(inject(function (_$controller_) {
            $controller = _$controller_;
        }));

        beforeEach(inject(function ($injector) {
            $httpBackend = $injector.get('$httpBackend');
            $rootScope = $injector.get('$rootScope');
        }));

        it('should get login form', inject(
            function ($rootScope, $httpBackend, RESTURL) {
                $httpBackend.expectPOST(RESTURL.url + 'login', {cmd: ''})
                    .respond(200, {});

                var $scope = $rootScope.$new();
                $scope['url'] = 'login';
                $scope['form_params'] = {clear_wf: 1};
                var controller = $controller('LoginCtrl', {$scope: $scope});

                expect($scope.onSubmit).toBeDefined();
                //expect($scope.loginForm).toBeDefined();
                //
                //$scope.onSubmit($scope.loginForm);
            })
        );

        it('should validate email', inject(['LoginService',
            function (LoginService) {
                expect(LoginService.isValidEmail).not.toBe(null);

                // test cases - testing for success
                var validEmails = [
                    'test@test.com',
                    'test@test.co.uk',
                    'test734ltylytkliytkryety9ef@jb-fe.com'
                ];

                // test cases - testing for failure
                var invalidEmails = [
                    'test@testcom',
                    'test@ test.co.uk',
                    'ghgf@fe.com.co.',
                    'tes@t@test.com',
                    ''
                ];

                // you can loop through arrays of test cases like this
                for (var i in validEmails) {
                    var valid = LoginService.isValidEmail(validEmails[i]);
                    expect(valid).toBeTruthy();
                }
                for (var i in invalidEmails) {
                    var valid = LoginService.isValidEmail(invalidEmails[i]);
                    expect(valid).toBeFalsy();
                }

            }])
        );

        it('should submit form', inject(function ($httpBackend, RESTURL) {


        }));

        it('ensures user can log in', function (LoginService, $httpBackend, RESTURL) {
            // todo: after backend api ready implement this
        });

        it('should get login success',
            inject(function (LoginService, $httpBackend, $location, RESTURL) {

                // use httpBackend to imitate login api

                $httpBackend.expectPOST(RESTURL.url + 'login', {
                        email: 'test@test.com',
                        password: 'password',
                        cmd: 'do'
                    })
                    // todo: with real api change response data from list to obj
                    .respond(200, [{
                        'id': 1, 'user': {
                            'id': 12

                            , 'role': 'admin'
                        }, 'success': true
                    }]);

                var cred = {email: 'test@test.com', password: 'password'};
                LoginService.login('login', cred)
                    .then(function (data) {
                        expect(data).not.toBe(null);
                        // after login path need to be change dashboard
                        //expect($location.path()).toBe('');
                    });

                $httpBackend.flush();
            })
        );

        it('should logout',
            inject(function (LoginService, $httpBackend, $location, RESTURL) {

                // use httpBackend to imitate login api

                $httpBackend.expectPOST(RESTURL.url + 'logout', {})
                    .respond(200, {
                        is_login: false
                    });

                LoginService.logout().success(function (data) {
                    expect(data.is_login).toBe(false);
                });

                $httpBackend.flush();
            })
        );
    });
});