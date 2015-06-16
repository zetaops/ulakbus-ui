/**
 * Copyright (C) 2015 ZetaOps Inc.
 *
 * This file is licensed under the GNU General Public License v3
 * (GPLv3).  See LICENSE.txt for details.
 */

'use strict';

describe('form service module', function () {

    beforeEach(module('formService'));

    describe('form service', function () {

        it('should generate form', inject(['Generator',
                function (Generator) {
                    expect(Generator.generate).not.toBe(null);

                    var form_json = [
                        {email:'test@test.com', id:2, name:'travolta'},
                        {email:'test@test.com', id:2, name:'travolta'}
                    ];

                    var form_generated = Generator.generate(form_json);
                    expect(form_generated).toEqual();
                }])
        );

    });
});