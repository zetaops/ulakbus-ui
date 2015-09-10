/**
 * Copyright (C) 2015 ZetaOps Inc.
 *
 * This file is licensed under the GNU General Public License v3
 * (GPLv3).  See LICENSE.txt for details.
 */

'use strict';

// TODO: fill up the test cases correctly

describe('ulakbus.auth module', function () {

    // load dependencies of modules e.g REST_URL
    beforeEach(module('ulakbus'));
    beforeEach(module('ulakbus.auth'));

    describe('login controller and service', function () {

        it('should have a login controller', inject(function () {
            expect('ulakbus.auth.LoginCtrl').toBeDefined();
        }));

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

        it('ensures user can log in', function () {
            // todo: after backend api ready implement this
        });

        it('should get login success',
            inject(function (LoginService, $httpBackend, $location, RESTURL) {

                // use httpBackend to imitate login api

                $httpBackend.expectPOST(RESTURL.url + 'login', {email: 'test@test.com', password: 'password', cmd: 'do'})
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

        // todo: test in case of 401 reload

        //it('unauthorized 401 should redirect to login',
        //    inject(function ($httpBackend, $http, $location, $window) {
        //
        //        $httpBackend.whenGET('http://127.0.0.1:8000/#/dashboard').respond(401, '');
        //
        //        $http.get('http://127.0.0.1:8000/#/dashboard');
        //        expect($window.location == '/#/login');
        //
        //        $httpBackend.flush();
        //    })
        //);

    });
});