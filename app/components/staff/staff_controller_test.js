/**
 * Copyright (C) 2015 ZetaOps Inc.
 *
 * This file is licensed under the GNU General Public License v3
 * (GPLv3).  See LICENSE.txt for details.
 */

'use strict';

describe('staff controller module', function () {
    beforeEach(module('zaerp.staff'));

    var $controller;

    beforeEach(inject(function(_$controller_){
        $controller = _$controller_;
    }));

    //describe('$scope.grade', function() {
    //    it('', function() {
    //        var $scope = {};
    //        var controller = $controller('StaffAddEditCtrl', { $scope: $scope });
    //        expect($scope).not.toBe(null);
    //    });
    //});
    //
    //describe('staff add controller', function () {
    //
    //    it('should have StaffAddEditCtrl', inject(function (ctrl) {
    //        expect(ctrl).toBeDefined();
    //    }));
    //
    //    it('should get form', inject(function () {
    //        expect($scope.form).not.toBe(null);
    //    }));
    //});
});