/**
 * Copyright (C) 2015 ZetaOps Inc.
 *
 * This file is licensed under the GNU General Public License v3
 * (GPLv3).  See LICENSE.txt for details.
 */

'use strict';

describe('staff controller module', function () {
    var $controller;
    beforeEach(inject(function (_$controller_) {
        // The injector unwraps the underscores (_) from around the parameter names when matching
        $controller = _$controller_;
    }));

    describe('staff add controller', function () {

        it('should have a scope object', inject(function () {
            expect($scope).toBeDefined();
        }));

        it('should get form', inject(function () {
            expect($scope.form).not.toBe(null);
        }));
    });
});