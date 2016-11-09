/**
 * @license Ulakbus-UI
 * Copyright (C) 2015 ZetaOps Inc.
 *
 * This file is licensed under the GNU General Public License v3
 * (GPLv3).  See LICENSE.txt for details.
 */


describe('form service module', function () {

    beforeEach(module('ulakbus'));
    beforeEach(module('ulakbus.formService'));

    var location;
    beforeEach(inject(function ($location, $injector) {
        location = $location;
        // Set up the mock http service responses
        $httpBackend = $injector.get('$httpBackend');
        // backend definition common for all tests
        authRequestHandler = $httpBackend.when('GET', /\.[0-9a-z]+$/i)
            .respond({userId: 'userX'}, {'A-Token': 'xxx'});
    }));

    describe('form service', function () {

        it('should generate url', inject(['Generator',
            function (Generator) {
                expect(Generator.group).not.toBe(null);
                var generated_url = Generator.makeUrl({url: 'test', form_params: {}});
                expect(generated_url).toEqual("http://api.ulakbus.net/test");
            }])
        );

        it('should generate form', inject(['Generator',
            function (Generator) {
                expect(Generator.generate).not.toBe(null);

                var scope = {form_params: {object_id: '123456'}};
                var data = {
                    forms: {
                        form: ['email', 'id', 'name'],
                        schema: {
                            properties: {
                                email: {title: 'email', type: 'email'},
                                id: {title: 'id', type: 'int'},
                                name: {title: 'name', type: 'string'}
                            }, required: [], type: 'object', title: 'servicetest'
                        },
                        model: {
                            email: 'test@test.com', id: 2, name: 'travolta'
                        }
                    },
                    token: "b1d8fa68ae3d47bdb580a89f76192447"
                };

                var form_json = {
                    form_params: {object_id: '123456'},
                    form: ['email', 'id', 'name'],
                    schema: {
                        properties: {
                            email: {title: 'email', type: 'email'},
                            id: {
                                title: 'id',
                                type: 'number',
                                validationMessage: {max: "bu alan -2147483647 ve 2147483647 arasında olmalıdır."}
                            },
                            name: {title: 'name', type: 'string'}
                        }, required: [], type: 'object', title: 'servicetest'
                    },
                    model: {email: 'test@test.com', id: 2, name: 'travolta'},
                    token: "b1d8fa68ae3d47bdb580a89f76192447",
                    initialModel: {email: 'test@test.com', id: 2, name: 'travolta'},
                    object_id: '123456'
                };

                var form_generated = Generator.generate(scope, data);


                expect(angular.equals(form_generated,form_json)).toBe(true);
            }])
        );

        it('should generate function returns when no forms', inject['Generator',
            function (Generator) {
                var responseData = Generator.generate({testkey: 'testvalue'}, {form: {}});
                expect(responseData = {testkey: 'testvalue'});
            }]
        );

        it('should return scope if no scope.forms', inject['Generator',
            function (Generator) {
                var returnScope = Generator.generate({"test": "scope"}, {"data": "no forms"});
                expect(returnScope).toEqual({"test": "scope"});
            }]
        );

        it('should prepare form items', inject(
            function (Generator, $httpBackend, RESTURL) {
                expect(Generator.prepareFormItems).not.toBe(null);

                $httpBackend.expectPOST(RESTURL.url + 'test', {
                        cmd: 'list',
                        model: "personel",
                        object_id: "5821bc25a90aa1"
                    })
                    .respond(200, {
                        items: {
                            "client_cmd": "list_objects",
                            "is_login": true,
                            "objects": [
                                ["Ad\u0131", "Soyad\u0131", "TC No", "Durum"],
                                ["4MsKRH9435cdKOzKCITNPml5bhB", "firstname", "lastname", "dksoap", false]
                            ],
                            "token": "0122b2843f504c15821bc25a90aa1370"
                        }
                    });

                var scope = {
                    wf: 'test',
                    form: ['email', 'id', 'name', 'save', {"type": "select", "key": "select"}, 'date', 'date2', 'text_general', 'model', 'node', 'listnode'],
                    schema: {
                        properties: {
                            email: {title: 'email', type: 'email'},
                            id: {title: 'id', type: 'int'},
                            name: {title: 'name', type: 'string'},
                            save: {title: 'save', type: 'submit'},
                            select: {title: 'select', type: 'select'},
                            date: {title: 'date', type: 'date'},
                            date2: {title: 'date', type: 'date'},
                            text_general: {title: 'text_general', type: 'text_general'},
                            model: {title: 'model', type: 'model', model_name: 'modelfield', list_cmd: 'list'},
                            node: {title: 'Node', type: 'Node'},
                            listnode: {
                                title: 'ListNode',
                                type: 'ListNode',
                                widget: 'filter_interface',
                                schema: [{'name': 'testname'}]
                            }
                        }, required: [], type: 'object', title: 'servicetest'
                    },
                    model: {
                        email: 'test@test.com', id: 2, name: 'test',
                        save: {title: 'save', type: 'submit'},
                        select: 2,
                        date: '12.12.2012',
                        date2: 'abc',
                        text_general: 'test',
                        model: '32gy1ukf3qiryv',
                        node: '',
                        listnode: ''
                    },
                    form_params: {param: 'id', param_id: '123'}
                };

                var form_generated = Generator.prepareFormItems(scope);


                expect(form_generated.form).toBeDefined();
                expect(form_generated.form[7].type).toEqual('template')
            })
        );

        it('should format date', inject(['Generator',
            function (Generator) {
                expect(Generator.dateformatter).not.toBe(null);
                var generated_date = Generator.dateformatter('2001-01-01T01:00:00Z');
                expect(generated_date).toEqual('01.01.2001');
            }])
        );

        it('should group form', inject(['Generator',
            function (Generator) {
                expect(Generator.group).not.toBe(null);

                var scope = {
                    form: ['email', 'id', 'name', 'save'],
                    schema: {
                        properties: {
                            email: {title: 'email', type: 'email'},
                            id: {title: 'id', type: 'int'},
                            name: {title: 'name', type: 'string'},
                            save: {title: 'save', type: 'submit'}
                        }, required: [], type: 'object', title: 'servicetest'
                    },
                    grouping: [
                        {
                            "groups": [
                                {
                                    "group_title": "title-1",
                                    "items": ["email", "id"],
                                }
                            ],
                            "layout": "4",
                            "collapse": false
                        },
                        {
                            "groups": [
                                {
                                    "group_title": "title-2",
                                    "items": ["name", "save"],
                                }
                            ],
                            "layout": "2",
                            "collapse": false
                        }
                    ]
                };

                var grouped_scope = Generator.group(scope);
                expect(grouped_scope.form[0].type).toEqual('fieldset');
            }])
        );
/*
        it('should get form', inject(function (Generator, $httpBackend, RESTURL) {

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

        it('should get list',
            inject(function (Generator, $httpBackend, RESTURL) {

                $httpBackend.expectPOST(RESTURL.url + 'test', {
                        cmd: 'list',
                        model: "personel",
                        object_id: "5821bc25a90aa1"
                    })
                    .respond(200, {
                        items: {
                            "client_cmd": "list_objects",
                            "is_login": true,
                            "objects": [
                                ["Ad\u0131", "Soyad\u0131", "TC No", "Durum"],
                                ["4MsKRH9435cdKOzKCITNPml5bhB", "firstname", "lastname", "dksoap", false]
                            ],
                            "token": "0122b2843f504c15821bc25a90aa1370"
                        }
                    });

                var cred = {cmd: 'list', model: "personel", object_id: "5821bc25a90aa1"};
                Generator.get_list({url: 'test', form_params: cred})
                    .then(function (data) {
                        expect(data.data.items.token).toEqual("0122b2843f504c15821bc25a90aa1370");
                    });

                $httpBackend.flush();
            })
        );

        it('should submit form',
            inject(function (Generator, $httpBackend, RESTURL) {

                $httpBackend.expectPOST(RESTURL.url + 'student/add')
                    .respond(200, {data: {'client_cmd': 'list', msgbox: 'test message'}});

                var scope = {
                    ListNode: {key1: 'val1'},
                    Node: {key2: 'val2'},
                    model: {email: 'test@test.com'},
                    form_params: {cmd: 'add', model: 'testmodel'},
                    token: '123456',
                    url: 'student/add',
                    wf: 'test'
                };
                Generator.submit(scope, true)
                    .success(function () {

                    })
                    .then(function (res) {
                        expect(res.data).toEqual({'data': {'client_cmd': 'list', msgbox: 'test message'}});
                    });
                $httpBackend.flush();
            })
        );

        it('should validate email',
           inject(function (Generator) {
               var validEmails = [
                   'test@test.com',
                   'test@test.co.uk',
                   'test734ltylytkliytkryety9ef@jb-fe.com'
               ];

               var invalidEmails = [
                   'test@testcom',
                   'test@ test.co.uk',
                   'ghgf@fe.com.co.',
                   'tes@t@test.com',
                   ''
               ];

               for (var i in validEmails) {
                   var valid = Generator.isValidEmail(validEmails[i]);
                   expect(valid).toBeTruthy();
               }
               for (var i in invalidEmails) {
                   var valid = Generator.isValidEmail(invalidEmails[i]);
                   expect(valid).toBeFalsy();
               }
           })
        );

        it('should validate tcNo',
           inject(function (Generator) {
               var validTCNos = [
                   '12345678902',
                   '18307990654'
               ];

               var invalidTCNos = [
                   '00000000000',
                   '00000000002',
                   '12345678901',
                   '1234567892',
                   ''
               ];

               for (var i in validTCNos) {
                   var valid = Generator.isValidTCNo(validTCNos[i]);
                   expect(valid).toBeTruthy();
               }
               for (var i in invalidTCNos) {
                   var valid = Generator.isValidTCNo(invalidTCNos[i]);
                   expect(valid).toBeFalsy();
               }
           })
        );

        it('should validate date',
           inject(function (Generator) {
               var validDates = [
                   '12.12.2012'
               ];

               var invalidDates = [
                   'dsad',
                   '0.0.0',
                   '15/12/2012',
                   ''
               ];

               for (var i in validDates) {
                   var valid = Generator.isValidDate(validDates[i]);

                   expect(valid).toBeTruthy();
               }
               for (var j in invalidDates) {
                   var notValid = Generator.isValidDate(invalidDates[j]);
                   expect(notValid).toBeFalsy();
               }
           })
        );

        it('should get wf and redirect according to client_cmd',
            inject(function (Generator, $httpBackend, RESTURL) {

                $httpBackend.expectPOST(RESTURL.url + 'test?test=xyz123')
                    .respond(200, {
                        "client_cmd": "form",
                        "object": {
                            "ad": "name",
                            "soyad": "lastname",
                        },
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
                        },
                        "msgbox": "test message",
                        "token": "da73993f439549e7855fd82deafbbc99",
                        "is_login": true
                    });

                //scope.url = 'test';
                scope.form_params = {
                    param: 'test',
                    id: 'xyz123',
                    model: 'testModel',
                    object_id: 'xxx11',
                    wf: 'testModel'
                };

                scope.url = 'test';
                Generator.get_wf(scope);

                $httpBackend.flush();
                expect(location.path()).toEqual('/testModel/testModel/do/f');
            })
        );

        it('doItemAction should do given action',
            inject(function (Generator, $httpBackend, RESTURL) {
                $httpBackend.expectPOST(RESTURL.url + 'otherwf')
                    .respond(200, {
                        "client_cmd": "form",
                        "object": {"ad": "name", "soyad": "lastname",},
                        forms: {
                            schema: {
                                type: "object",
                                properties: {
                                    name: {type: "string", minLength: 2, title: "Name", description: "Name or alias"},
                                    title: {type: "string", title: "title"}
                                }
                            },
                            form: ["*"],
                            model: {}
                        },
                        "msgbox": "test message",
                        "token": "da73993f439549e7855fd82deafbbc99",
                        "is_login": true
                    });

                //scope.url = 'test';
                scope.form_params = {
                    param: 'test',
                    id: 'xyz123',
                    model: 'testModel',
                    object_id: 'xxx11',
                    wf: 'testModel'
                };

                scope.url = 'test';

                Generator.doItemAction(scope, 'testkey123', {cmd: 'list', wf: 'otherwf', object_key: '4321'}, 'normal');

                $httpBackend.flush();
                expect(location.path()).toEqual('/otherwf/do/f');

                Generator.doItemAction(scope, 'testkey123', {cmd: 'list', wf: 'otherwf', object_key: '4321'}, 'modal');
                Generator.doItemAction(scope, 'testkey123', {cmd: 'list', wf: 'otherwf', object_key: '4321'}, 'new');
            })
        );

        it('should return diff object',
            inject(function (Generator) {
                expect(Generator.get_diff).not.toBe(null);

                // test cases - testing for success
                var same_json = [
                    {email: 'test@test.com', id: 2, name: 'travolta', foo2: [1,2,3], foo: {'a':1}},
                    {email: 'test@test.com', id: 2, name: 'travolta', foo2: [1,2,3], foo: {'a':1}}
                ];

                // test cases - testing for failure
                var different_jsons = [
                    [
                        {email: 'test@test.com', id: 2, name: 'travolta'},
                        {email: 'test1@test.com', id: 2, name: 'john'}
                    ],
                    [
                        {id: 2, name: 'travolta'},
                        {email: 'test1@test.com', id: 2, name: 'john'}
                    ]
                ];

                var different_json = [
                    {},
                    {email: 'test1@test.com', id: 2, name: 'john'}
                ];

                var notEqual = [
                    {email: 'test@test.com', id: 2, name: 'Travolta', foo: {'a':1, 'b': 2}, foo2: [1,2,3]},
                    {email: 'test@test.com', id: 2, name: 'travolta', foo: {'a':1}, foo2: [1,2,3]}
                ]

                var diff = {email: 'test1@test.com', name: 'john'};
                var diff2 = {email: 'test1@test.com', id: 2, name: 'john'};
                var noequal = {name: 'travolta'};
                var nodiff = {};

                var same = Generator.get_diff(same_json[0], same_json[1]);
                expect(same).toEqual(nodiff);

                for (var json_obj in different_jsons) {
                    var different = Generator.get_diff(different_jsons[json_obj][0], different_jsons[json_obj][1]);
                    expect(different).toEqual(diff);
                }

                var different2 = Generator.get_diff(different_json[0], different_json[1]);
                expect(different2).toEqual(diff2);

                var not_equal = Generator.get_diff(notEqual[0], notEqual[1]);
                expect(not_equal).toEqual(noequal);
            });
        );
*/
        it('should return diff array',
            inject(function (Generator) {
                var diff = Generator.get_diff_array([1, 2, 3], [2]);
                expect(diff).toEqual([1, 3]);
            })
        )

    });
/*
    describe('form service', function () {
        var location, rootScope, scope, ctrl;
        beforeEach(inject(function ($location, $rootScope) {
            location = $location;
            rootScope = $rootScope;
            scope = $rootScope.$new();
            ctrl = $controller("CRUDCtrl", {$scope: scope});
        }));

    });

    var $controller;

    beforeEach(inject(function (_$controller_) {
        $controller = _$controller_;
    }));

    describe('form service modal controller', function () {

        it('should have ModalCtrl', inject(function ($controller) {
            expect($controller).toBeDefined();
        }));
    });

    here begin the directive tests
    var compile, scope, directiveElem;

    beforeEach(function () {
        inject(function ($compile, $rootScope) {
            compile = $compile;
            scope = $rootScope.$new();
        });
        // directiveElem = getCompiledElement();
    });

    function getCompiledElement() {
        var element = angular.element('<div modal-for-nodes="Personel,ListNode,add"></div>');
        var compiledElement = compile(element)(scope);
        scope.$digest();
        return compiledElement;
    }

    describe('modal for nodes directive', function () {

        it('should have div element', function () {
            var modalElement = getCompiledElement().find('div');
            expect(modalElement).toBeDefined();
            expect(modalElement.html()).not.toEqual('');
        });
    });
    */
});