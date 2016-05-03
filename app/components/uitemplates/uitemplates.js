/**
 * @license Ulakbus-UI
 * Copyright (C) 2015 ZetaOps Inc.
 *
 * This file is licensed under the GNU General Public License v3
 * (GPLv3).  See LICENSE.txt for details.
 */

angular.module('ulakbus.uitemplates', ['ngRoute', 'schemaForm', 'ulakbus.formService'])

    .controller('NewDesignsCtrl', function ($scope) {
        $scope.items = ['student', 'staff', 'academician'];
        $scope.selection = $scope.items[0];
    })

    /*
    This controller is for testing new SchemaForm components. In addition, forms need to have the attribute:
    "name" for defining the name shown in dropdown box. Paste the JSON of form as a member of $scope.forms.
     */

    .controller('FormServicePg', function ($scope, Generator) {
        $scope.forms = [
            {
                name: 'Deneme Form 1',
                form: ['email', 'id', 'name',
                    { type: "button", cmd:"list_user", title: "submit without validation", validation: false },
                    { type: "button", cmd:"list_user", title: "confirm with validation"}],
                schema: {
                    properties: {
                        email: {title: 'email', type: 'string'},
                        id: {title: 'id', type: 'number'},
                        name: {title: 'name', type: 'string'}
                    }, required: ["email", "id", "name"], type: 'object', title: 'servicetest'
                },
                model: {
                    email: 'test@test.com', id: 2, name: 'travolta'
                }
            },
            {
                name: 'Deneme Form 2',
                form: ['email', 'id', 'name',
                        { type:'button', title:'DickButt1DickButt1DickButt1' },
                        { type:'button', title:'DickButt2DickButt2DickButt2' },
                        { type:'button', title:'DickButt3DickButt3DickButt3' },

                ],
                schema: {
                    properties: {
                        email: {title: 'email', type: 'string'},
                        id: {title: 'id', type: 'number'},
                        name: {title: 'name', type: 'string'}
                    }, required: [], type: 'object', title: 'servicetest'
                },
                model: {
                    email: 'test@test.com', id: 2, name: 'cageman'
                }
            }
        ];
        $scope.form_params = {};
        $scope.selection = 0;

        $scope.selectform = function (index) {
            var form = $scope.forms[index];
            $scope = Generator.generate($scope, {forms: form});
        };
        $scope.selectform($scope.selection);
    });