/**
 * Copyright (C) 2015 ZetaOps Inc.
 *
 * This file is licensed under the GNU General Public License v3
 * (GPLv3).  See LICENSE.txt for details.
 */

'use strict';

describe('form service module', function () {

    beforeEach(module('zaerp'));
    beforeEach(module('formService'));

    describe('form service', function () {

        it('should generate form', inject(['Generator',
                function (Generator) {
                    expect(Generator.generate).not.toBe(null);

                    var form_json = {email: 'test@test.com', id: 2, name: 'travolta'};

                    var form_generated = Generator.generate(form_json);
                    expect(form_generated).toEqual(form_json);
                }])
        );

        it('should group form', inject(['Generator',
                function(Generator){
                    expect(Generator.group).not.toBe(null);

                    var group_json = {group_objects : {1:['email', 'name'], 2:['password']}};
                    var grouped_form = Generator.group(group_json);
                    expect(grouped_form).toEqual(group_json);
                }])
        );

        it('should get form',
            inject(function(Generator, $httpBackend) {

                $httpBackend.expectGET('http://127.0.0.1:3000/api/student/add?email=test@test.com&')
                    .respond(204, {'id': 1, 'user': {'id': 12, 'role': 'admin'}});

                var cred = {email: 'test@test.com'};
                Generator.get_form('student/add', cred)
                    .then(function(data) {
                        expect(data).not.toBe(null);
                    });

                $httpBackend.flush();
            })
        );

    });
});