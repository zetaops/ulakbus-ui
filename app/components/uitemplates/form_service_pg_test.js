/**
 * @license Ulakbus-UI
 * Copyright (C) 2015 ZetaOps Inc.
 *
 * This file is licensed under the GNU General Public License v3
 * (GPLv3).  See LICENSE.txt for details.
 */

describe("FormServicePg", function(){

    beforeEach(module('ulakbus'));
    beforeEach(module('ulakbus.uitemplates'));
    beforeEach(module('ulakbus.formService'));

    var $controller;

    beforeEach(inject(function(_$compile_, _$controller_){
        // The injector unwraps the underscores (_) from around the parameter names when matching
        $compile = _$compile_;
        $controller = _$controller_;
    }));

    describe("Controller is loaded", function(){
        expect("FormServicePG").toBeDefined();
    })

    describe('RESTURL', function(){
        it('is Loaded',
            inject(function(RESTURL){
                expect(RESTURL).toBeDefined();
            })
        );
    })

    describe('Generator', function(){
        it('is Loaded',
            inject(function(Generator){
                expect(Generator).toBeDefined();
            })
        );
    })

    describe("$scope.selectform", function() {
        it("Generates schemaForm structures if $scope.forms parameters implemented properly.",
            inject(function (Generator) {
                var $scope = {};
                var controller = $controller('FormServicePg', {$scope: $scope, Generator: Generator});
                $scope.forms = [
                    {
                        name: 'Deneme Form 1',
                        form: ['email', 'id', 'name'],
                        schema: {
                            properties: {
                                email: {title: 'email', type: 'string'},
                                id: {title: 'id', type: 'int'},
                                name: {title: 'name', type: 'string'}
                            }, required: [], type: 'object', title: 'servicetest'
                        },
                        model: {
                            email: 'test@test.com', id: 2, name: 'travolta'
                        }
                    },
                    {
                        name: 'Deneme Form 2',
                        form: ['email', 'id', 'name'],
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
                $scope.selectform($scope.selection);
                expect($scope.schema.properties.id.type).toEqual('number');
            })
        )}
    )
})
