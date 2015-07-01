/**
 * Copyright (C) 2015 ZetaOps Inc.
 *
 * This file is licensed under the GNU General Public License v3
 * (GPLv3).  See LICENSE.txt for details.
 */

'use strict';

describe('general module', function () {

    beforeEach(module('general'));

    describe('form diff factory', function () {

        it('should return diff object', inject(['FormDiff',
                function (FormDiff) {
                    expect(FormDiff.get_diff).not.toBe(null);

                    // test cases - testing for success
                    var same_json = [
                        {email: 'test@test.com', id: 2, name: 'travolta'},
                        {email: 'test@test.com', id: 2, name: 'travolta'}
                    ];

                    // test cases - testing for failure
                    var different_json = [
                        {email: 'test@test.com', id: 2, name: 'travolta'},
                        {email: 'test1@test.com', id: 2, name: 'john'}
                    ];

                    var diff = {email: 'test1@test.com', name: 'john'};
                    var nodiff = {};

                    var same = FormDiff.get_diff(same_json[0], same_json[1]);
                    expect(same).toEqual(nodiff);

                    var different = FormDiff.get_diff(different_json[0], different_json[1]);
                    expect(different).toEqual(diff);
                }])
        );

    });
});