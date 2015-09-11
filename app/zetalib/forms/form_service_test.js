/**
 * Copyright (C) 2015 ZetaOps Inc.
 *
 * This file is licensed under the GNU General Public License v3
 * (GPLv3).  See LICENSE.txt for details.
 */

'use strict';

describe('form service module', function () {

    beforeEach(module('ulakbus'));
    beforeEach(module('formService'));

    describe('form service', function () {

        it('should generate form', inject(['Generator',
                function (Generator) {
                    expect(Generator.generate).not.toBe(null);

                    var form_json = {
                        email: 'test@test.com',
                        id: 2,
                        name: 'travolta'
                    };

                    var form_generated = Generator.generate(form_json);
                    expect(form_generated).toEqual(form_json);
                }])
        );

        it('should group form', inject(['Generator',
                function (Generator) {
                    expect(Generator.group).not.toBe(null);

                    var group_json = {
                        group_objects: {
                            1: ['email', 'name'],
                            2: ['password']
                        }
                    };
                    var grouped_form = Generator.group(group_json);
                    expect(grouped_form).toEqual(group_json);
                }])
        );

        it('should get form',
            inject(function (Generator, $httpBackend, RESTURL) {

                $httpBackend.expectPOST(RESTURL.url + 'add_student', {cmd: 'add'})
                    .respond(200, {
                        forms: {
                            schema: {
                                type: "object",
                                properties: {
                                    name: {type: "string", minLength: 2, title: "Name", description: "Name or alias"},
                                    title: {
                                        type: "string",
                                        enum: ['dr', 'jr', 'sir', 'mrs', 'mr', 'NaN', 'dj']
                                    }
                                }
                            },

                            form: [
                                "*",
                                {
                                    type: "submit",
                                    title: "Save"
                                }
                            ],
                            model: {}
                        }
                    });

                var cred = {cmd: 'add'};
                Generator.get_form({url: 'add_student', form_params: cred})
                    .then(function (data) {
                        expect(data.form).toEqual(["*", {type: "submit", title: "Save"}]);
                    });

                $httpBackend.flush();
            })
        );

        it('should post form',
            inject(function (Generator, $httpBackend, RESTURL) {

                $httpBackend.expectPOST(RESTURL.url + 'student/add')
                    .respond(200, {data: 'OK'});

                var cred = {email: 'test@test.com'};
                Generator.submit({url: 'student/add', form_params: cred})
                    .then(function (data) {
                        expect(data.data).toEqual({data: 'OK'});
                    });
                $httpBackend.flush();
            })
        );

    });
});