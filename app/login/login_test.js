'use strict';

describe('zaerp.login module', function () {

    beforeEach(module('zaerp.login'));

    describe('login controller', function () {

        it('should have a login controller', inject(function ($controller) {
            //spec body
            var loginCtrl = $controller('LoginCtrl');
            expect(loginCtrl).toBeDefined();
        }));

        it('should have a working LoginService service', inject(['LoginService',
                function (LoginService) {
                    expect(LoginService.isValidEmail).not.to.equal(null);

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

        it('ensures user can log in', function() {
            // expect current scope to contain username
        });
        it('ensures path has changed', function() {
            // expect path to equal '/dashboard'
        });

        it('should get login success',
            inject(function(LoginService, $httpBackend) {

                $httpBackend.expect('POST', 'https://127.0.0.1:8000/login')
                    .respond(200, "[{ success : 'true', id : 123 }]");

                LoginService.login('test@test.com', 'password')
                    .then(function(data) {
                        expect(data.success).toBeTruthy();
                    });

                $httpBackend.flush();
            })
        );

    });
});