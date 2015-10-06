/**
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

    beforeEach(inject(function (_$controller_) {
        $controller = _$controller_;
    }));

    var $rootScope;
	beforeEach(inject(function(_$rootScope_) {
		$rootScope = _$rootScope_;
	}));

    describe('dashboard controller', function () {

        it('should define DashCtrl', inject(function ($controller) {
            expect($controller).toBeDefined();
        }));

        it('should define section', function() {
            var $scope = {};
            var controller = $controller('DashCtrl', { $scope: $scope });
            $scope.section('test_section');
            expect($rootScope.section).toBe('test_section');
        });
    });
});