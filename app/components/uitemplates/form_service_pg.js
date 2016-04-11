/**
 * @license Ulakbus-UI
 * Copyright (C) 2015 ZetaOps Inc.
 *
 * This file is licensed under the GNU General Public License v3
 * (GPLv3).  See LICENSE.txt for details.
 */

angular.module('ulakbus.uitemplates', ['ngRoute', 'ui.bootstrap', 'schemaForm'])
    .controller('formServicePg', function ($scope) {
        $scope.forms = [
            {
                name: "Deneme Form",
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
            {
                name: "Deneme Form 2",
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
            }
        ];
        $scope.selection = $scope.forms[0];
    });