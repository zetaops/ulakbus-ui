/**
 * Copyright (C) 2015 ZetaOps Inc.
 *
 * This file is licensed under the GNU General Public License v3
 * (GPLv3).  See LICENSE.txt for details.
 */

'use strict';

$script([
    "bower_components/angular/angular.js",
    "bower_components/oclazyload/dist/ocLazyLoad.js",
    "bower_components/angular-route/angular-route.js",
    "bower_components/angular-cookies/angular-cookies.js",
    "bower_components/angular-resource/angular-resource.js",
    "bower_components/angular-sanitize/angular-sanitize.js",
    "bower_components/tv4/tv4.js",
    "bower_components/objectpath/lib/ObjectPath.js",
    "bower_components/angular-schema-form/dist/schema-form.js",
    "bower_components/angular-schema-form/dist/bootstrap-decorator.js",
    "bower_components/angular-schema-form-datepicker/bootstrap-datepicker.js",
    "app.js",
    "app_routes.js",
    "zetalib/interceptors.js",
    "zetalib/general.js",
    "zetalib/forms/form_service.js",
    "components/auth/auth_controller.js",
    "components/auth/auth_service.js",
    "components/dashboard/dashboard.js",
    "components/staff/staff_controller.js",
    "components/student/student_controller.js",
    "components/dashboard/dashboard.js"
], function() {
    // when all is done, execute bootstrap angular application
    angular.bootstrap(document, ['zaerp']);
});