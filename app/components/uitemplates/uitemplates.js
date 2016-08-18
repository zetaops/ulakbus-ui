/**
 * @license Ulakbus-UI
 * Copyright (C) 2015 ZetaOps Inc.
 *
 * This file is licensed under the GNU General Public License v3
 * (GPLv3).  See LICENSE.txt for details.
 */

angular.module('ulakbus.uitemplates', ['ngRoute', 'ulakbus.crud'])
    
    
    .controller('NewDesignsCtrl', function ($scope) {
        $scope.items = ['student', 'staff', 'academician'];
        $scope.selection = $scope.items[0];
    })
    
    .controller('FormServicePg', function ($scope, Generator, CrudUtility) {

    /*
    This controller is for testing new SchemaForm components. In addition, forms need to have the attribute:
    "name" for defining the name shown in dropdown box. Paste the JSON of form as a member of $scope.forms.
     */
        $scope.trialList = [
            {
                name: 'Deneme Form 1',
                form: ['email', 'id', 'name', 'valid'],
                schema: {
                    properties: {
                        email: {title: 'email', type: 'string'},
                        id: {title: 'id', type: 'number'},
                        name: {title: 'name', type: 'string'},
                        valid: { type: 'submit', cmd:"list_user2", title: "submit with validation" }

                    }, required: ["email", "id", "name"], type: 'object', title: 'servicetest'
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
                        confirm: {
                            title: 'Confirm Form',
                            style:"btn-success",
                            type:'confirm',
                            confirm_message:"Lorem Ipsum Dolor Sit Amet",
                            buttons: [
                                {   text: "button 1", cmd:"cmd1", style: "btn-warning"},
                                {   text: "button 2", cmd:"cmd2", style: "btn-success"}
                            ],
                            readonly:"true",
                            form_validate: false}
                    }, required: [], type: 'object', title: 'servicetest'
                },
                model: {
                    email: 'test@test.com', id: 3, name: 'cageman'
                }
            }
        ];
        $scope.form_params = {};
        $scope.selection = 0;
        $scope.meta = {};

        $scope.selectform = function (index) {
            var data = { forms: $scope.trialList[index] };
            CrudUtility.listPageItems($scope, data);
            Generator.generate($scope, data);
            Generator.setPageData({pageData: false});
        };
        $scope.selectform($scope.selection);
    });