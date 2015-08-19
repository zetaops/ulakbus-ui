/**
 * Copyright (C) 2015 ZetaOps Inc.
 *
 * This file is licensed under the GNU General Public License v3
 * (GPLv3).  See LICENSE.txt for details.
 */

'use strict';

describe('staff controller module', function () {

    beforeEach(module('ulakbus'));
    beforeEach(module('ulakbus.staff'));

    var $controller;

    beforeEach(inject(function (_$controller_) {
        $controller = _$controller_;
    }));

    describe('staff add controller', function() {
        it('should get form', function() {
            var $scope = {};
            var controller = $controller('StaffAddCtrl', { $scope: $scope });
            expect($scope).not.toEqual(null);
        });
    });

    describe('staff add controller', function () {

        it('should have StaffAddEditCtrl', inject(function ($controller) {
            expect($controller).toBeDefined();
        }));
    });
});