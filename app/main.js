/**
 * Copyright (C) 2015 ZetaOps Inc.
 *
 * This file is licensed under the GNU General Public License v3
 * (GPLv3).  See LICENSE.txt for details.
 */

'use strict';

$script([
    'bower_components/angular/angular.js',
    'bower_components/angular-sanitize/angular-sanitize.min.js',
    'bower_components/angular-animate/angular-animate.min.js',
    'bower_components/moment/moment.js',
    'bower_components/tv4/tv4.js',
    'bower_components/objectpath/lib/ObjectPath.js',
    'bower_components/angular-schema-form/dist/schema-form.min.js',
    'bower_components/angular-schema-form/dist/bootstrap-decorator.min.js',

    'app.js',
    'zlib/general.js',
    'forms/form_generator.js',
    'test_view_for_generator/testfile.js',


    'login/login.js',
    'login/login_service.js',

    'dashboard/dashboard.js',
    'components/version/version.js',
    'components/version/version-directive.js',
    'components/version/interpolate-filter.js',
    'bower_components/quantumui/dist/js/quantumui-nojq.js',
], function() {
    // when all is done, execute bootstrap angular application
    angular.bootstrap(document, ['zaerp']);
});