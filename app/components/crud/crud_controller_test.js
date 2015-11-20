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


    describe('crud controller', function () {

        it('should have CRUDListFormCtrl', inject(function ($controller) {
            expect($controller).toBeDefined();
        }));
    });
});