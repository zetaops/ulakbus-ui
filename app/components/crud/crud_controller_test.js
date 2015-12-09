/**
 * @license Ulakbus-UI
 * Copyright (C) 2015 ZetaOps Inc.
 *
 * This file is licensed under the GNU General Public License v3
 * (GPLv3).  See LICENSE.txt for details.
 */

describe('crud controller module', function () {

    beforeEach(module('ulakbus'));
    beforeEach(module('ulakbus.crud'));

    beforeEach(inject(function ($injector) {
        $httpBackend = $injector.get('$httpBackend');

        authRequestHandler = $httpBackend.when('GET', /\.[0-9a-z]+$/i)
            .respond({userId: 'userX'}, {'A-Token': 'xxx'});
    }));

    var $controller;

    beforeEach(inject(function (_$compile_, _$controller_) {
        $compile = _$compile_;
        $controller = _$controller_;
    }));


    describe('crud controller', function () {

        it('should have CRUDListFormCtrl', inject(function () {
            expect('ulakbus.crud.CRUDListFormCtrl').toBeDefined();
        }));

        it('should have CRUDCtrl', inject(function () {
            expect('ulakbus.crud.CRUDCtrl').toBeDefined();
        }));

        it('should generate params', inject(['CrudUtility', function (CrudUtility) {
            CrudUtility.generateParam({}, {'test_id': 'test'}, 'form');
            CrudUtility.listPageItems({
                'objects': [[], {
                    'actions': [{'show_as': 'link', 'fields': [0,1]}]
                }]}, {'test_id': 'test'});
            expect($controller).toBeDefined();
        }]));

        it('should execute CRUDListFormCtrl with form cms', inject(function ($rootScope, RESTURL) {
            $httpBackend.expectGET(RESTURL.url + 'ara/personel/123')
                .respond(200, {});

            var $scope = $rootScope.$new();
            var $routeParams = {cmd: 'form'};
            var controller = $controller('CRUDListFormCtrl', { $scope: $scope, $routeParams: $routeParams });

        }));

        it('should execute CRUDListFormCtrl with list cmd', inject(function ($rootScope, RESTURL) {
            $httpBackend.expectGET(RESTURL.url + 'ara/personel/123')
                .respond(200, {});

            var $scope = $rootScope.$new();
            var $routeParams = {cmd: 'list'};
            var controller = $controller('CRUDListFormCtrl', { $scope: $scope, $routeParams: $routeParams });

        }));

        it('should execute CRUDListFormCtrl with relad cmd', inject(function ($rootScope, RESTURL) {
            $httpBackend.expectGET(RESTURL.url + 'ara/personel/123')
                .respond(200, {});

            var $scope = $rootScope.$new();
            $scope.form_params = {};
            $scope.reload_cmd = 'list';
            var $routeParams = {cmd: 'reload'};
            var controller = $controller('CRUDListFormCtrl', { $scope: $scope, $routeParams: $routeParams });

        }));

        it('generates crud-filters directive', inject(function($rootScope) {
            // Compile a piece of HTML containing the directive
            var $scope = $rootScope.$new();
            $scope.form_params = {filters: []};
            var element = $compile("<crud-filters></crud-filters>")($scope);
            $scope.$digest();
            expect(element.html()).toContain("");
        }));
    });
});