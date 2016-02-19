/**
 * @license Ulakbus-UI
 * Copyright (C) 2015 ZetaOps Inc.
 *
 * This file is licensed under the GNU General Public License v3
 * (GPLv3).  See LICENSE.txt for details.
 */

'use strict';

describe('ulakbus.auth module', function () {

    beforeEach(module('ulakbus'));
    beforeEach(module('ulakbus.auth'));

    var $controller;
    var $rootScope;

    beforeEach(inject(function (_$controller_) {
        $controller = _$controller_;
    }));

    beforeEach(inject(function ($injector) {
        $rootScope = $injector.get('$rootScope');
    }));

    beforeEach(inject(function ($injector) {
        $httpBackend = $injector.get('$httpBackend');
        var authRequestHandler = $httpBackend.when('GET', /\.[0-9a-z]+$/i)
            .respond({userId: 'userX'}, {'A-Token': 'xxx'});
    }));

    describe('login controller and service', function () {

        it('should have a login controller', inject(function () {
            expect('ulakbus.auth.LoginController').toBeDefined();
        }));

        it('should get login form', inject(
            function ($rootScope, $httpBackend, RESTURL) {
                $httpBackend.expectPOST(RESTURL.url + 'login', {cmd: ''})
                    .respond(200, {});

                var $scope = $rootScope.$new();
                $scope['url'] = 'login';
                $scope['form_params'] = {clear_wf: 1};
                var controller = $controller('LoginController', {$scope: $scope});

                expect($scope.onSubmit).toBeDefined();
            })
        );

        it('ensures user can log in', function (AuthService, $httpBackend, RESTURL) {
            // todo: after backend api ready implement this
        });

        it('should get login success',
            inject(function (AuthService, $httpBackend, $location, RESTURL) {

                // use httpBackend to imitate login api
                $httpBackend.expectPOST(RESTURL.url + 'login', {
                        email: 'test@test.com',
                        password: 'password',
                        cmd: 'do'
                    })
                    .respond(200, [{
                        'id': 1, 'user': {
                            'id': 12

                            , 'role': 'admin'
                        }, 'success': true
                    }]);

                var cred = {email: 'test@test.com', password: 'password'};
                AuthService.login('login', cred)
                    .then(function (data) {
                        expect(data).not.toBe(null);
                    });

                $httpBackend.flush();
            })
        );

        it('should logout',
            inject(function (AuthService, $httpBackend, $location, RESTURL) {

                // use httpBackend to imitate login api

                $httpBackend.expectPOST(RESTURL.url + 'logout', {})
                    .respond(200, {
                        is_login: false
                    });

                AuthService.logout().success(function (data) {
                    expect(data.is_login).toBe(false);
                });

                $httpBackend.flush();
            })
        );
    });
});