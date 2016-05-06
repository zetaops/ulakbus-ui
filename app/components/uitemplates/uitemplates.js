/**
 * @license Ulakbus-UI
 * Copyright (C) 2015 ZetaOps Inc.
 *
 * This file is licensed under the GNU General Public License v3
 * (GPLv3).  See LICENSE.txt for details.
 */

angular.module('ulakbus.uitemplates', ['ngRoute', 'ulakbus.formService'])
    
    
    .controller('NewDesignsCtrl', function ($scope) {
        $scope.items = ['student', 'staff', 'academician'];
        $scope.selection = $scope.items[0];
    })
    
    .controller('FormServicePg', function ($scope, Generator) {

    /*
    This controller is for testing new SchemaForm components. In addition, forms need to have the attribute:
    "name" for defining the name shown in dropdown box. Paste the JSON of form as a member of $scope.forms.
     */
        $scope.forms = [
            {
                name: 'Deneme Form 1',
                form: ['email', 'id', 'name', 'novalid'],
                schema: {
                    properties: {
                        email: {title: 'email', type: 'string'},
                        id: {title: 'id', type: 'number'},
                        name: {title: 'name', type: 'string'},
                        novalid: { type: "button", cmd:"list_user2", title: "submit without validation", form_validate: false }

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
                            confirm_message: "kelmangeeeeeeee kakooooo kakoooo şugarkeeeeee mageee kakoooo yandan geeeelll mage kakooooo kakoooo candan geeelll magee kakoooo mo kak kamiloooo biya westeee mo kak kamiloooo biya westeee me türbayyy dicaaa vilesgeee me haraaayy dicaaaa vilesgeeee voşdikeeelll mage kakoooo kakooo yandan geeeelll mage kakooo şugarkeeeee mageeee kakooo kakooooo candan geeell magee kakoooo gel mageeeee kakooo kakoooo şugarkeeee maneee kakooo yandan geeell mageee kakooo kakoooo candan geellll mane kakoooo mo kak kamiloooo biya westeee mo kak kamiloooo biya westeee me türbayyy dicaaa vilesgeee me haraaayy dicaaaa vilesgeeee voşdikeeelll mage kakoooo kakooo yandan geeeelll mage kakooo şugarkeeeee mageeee kakooo kakooooo candan geeell magee kakoooo﻿.",
                            buttons: [
                                {   text: "button 1", style: "btn-warning", dismiss: true },
                                {   text: "button 2", cmd:"cmd1", style: "btn-success"},
                            ],
                            readonly:"true"}
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
        };
        $scope.selectform($scope.selection);
    });