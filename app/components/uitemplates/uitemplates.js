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

    .controller('FormServicePg', function ($scope, Generator, $timeout) {
        $scope.forms = [
            {
                name: 'Deneme Form 1',
                form: ['email', 'id', 'name'],
                schema: {
                    properties: {
                        email: {title: 'email', type: 'string'},
                        id: {title: 'id', type: 'number'},
                        name: {title: 'name', type: 'string'}
                    }, required: [], type: 'object', title: 'servicetest'
                },
                model: {
                    email: 'test@test.com', id: 2, name: 'travolta'
                }
            },
            {
                name: 'Confirm Form Trial',
                form: ['email', 'id', 'name', 'confirm'],
                schema: {
                    properties: {
                        email: {title: 'email', type: 'string'},
                        id: {title: 'id', type: 'number'},
                        name: {title: 'name', type: 'string'},
                        confirm: {title: 'Confirm Form', style:"btn-success", type:'confirm', confirm_message: "zaaa xDê", cmd:"list_user", readonly:"true"}
                    }, required: [], type: 'object', title: 'servicetest'
                },
                model: {
                    email: 'test@test.com', id: 3, name: 'cageman'
                }
            }
        ];
        $scope.form_params = {};
        $scope.selection = 0;

        $scope.selectform = function (index) {
            var form = $scope.forms[index];
            $scope = Generator.generate($scope, {forms: form});
            $timeout(function(){
                $scope.$apply();
            })
        };
        $scope.selectform($scope.selection);
    });