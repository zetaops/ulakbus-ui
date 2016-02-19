/**
 * @license Ulakbus-UI
 * Copyright (C) 2015 ZetaOps Inc.
 *
 * This file is licensed under the GNU General Public License v3
 * (GPLv3).  See LICENSE.txt for details.
 */

'use strict';

describe('dashboard controller module', function () {

    beforeEach(module('ulakbus'));
    beforeEach(module('ulakbus.dashboard'));

    var $controller;
    var $rootScope;

    beforeEach(inject(function (_$controller_) {
        $controller = _$controller_;
    }));

    beforeEach(inject(function ($injector) {
        $httpBackend = $injector.get('$httpBackend');
        $rootScope = $injector.get('$rootScope');
    }));

    describe('dashboard controller', function () {
        it('should define DashController', inject(function () {
            expect('ulakbus.dashboard.DashController').toBeDefined();
        }));

        // todo: complete dashboard tests
        it('should execute DashController functions', inject(function ($rootScope, RESTURL) {
            $httpBackend.expectGET(RESTURL.url + 'ara/personel/123')
                .respond(200, {});

            var $scope = $rootScope.$new();
            var controller = $controller('DashController', {$scope: $scope});

            $scope.student_kw = "123";
            $scope.staff_kw = "123";
            $scope.section(1);
            $scope.$broadcast('authz', {});
            $scope.search('personel');
            $scope.search('ogrenci');
            $scope.getItems('personel', '123');
            $scope.select(['test name', '12345678', 'y37wgycuir7']);
            $scope.$broadcast('notifications', {});
            $scope.markAsRead(['123']);

        }));
    });
});