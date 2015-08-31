/**
 * Copyright (C) 2015 ZetaOps Inc.
 *
 * This file is licensed under the GNU General Public License v3
 * (GPLv3).  See LICENSE.txt for details.
 */

'use strict';

describe('crud controller module', function () {

    beforeEach(module('ulakbus'));
    beforeEach(module('ulakbus.crud'));

    var $controller;

    beforeEach(inject(function (_$controller_) {
        $controller = _$controller_;
    }));

    describe('crud add controller', function() {
        it('should get form', function() {
            var $scope = {};
            var controller = $controller('CRUDAddEditCtrl', { $scope: $scope });
            expect($scope).not.toEqual(null);
        });
    });

    describe('crud add controller', function () {

        it('should have CRUDAddEditCtrl', inject(function ($controller) {
            expect($controller).toBeDefined();
        }));
    });
});