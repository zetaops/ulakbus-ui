angular.module('templates-prod', ['components/auth/login.html', 'components/dashboard/dashboard.html', 'components/staff/templates/add.html', 'components/staff/templates/edit.html', 'components/staff/templates/list.html', 'components/staff/templates/show.html', 'components/student/student_add_template.html', 'components/student/student_list_template.html', 'components/types/types_template.html']);

angular.module("components/auth/login.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("components/auth/login.html",
    "<div ng-app=\"ulakbus.auth\">\n" +
    "    <div class=\"col-md-6\">\n" +
    "        <h1>Ulakbüs Login Form</h1>\n" +
    "        <span class=\"label label-warning\">{{message}}</span>\n" +
    "        <form name=\"loginForm\" sf-schema=\"schema\" sf-form=\"form\" sf-model=\"model\" ng-submit=\"onSubmit(loginForm)\"></form>\n" +
    "    </div>\n" +
    "</div>");
}]);

angular.module("components/dashboard/dashboard.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("components/dashboard/dashboard.html",
    "<div ng-app=\"ulakbus.dashboard\">\n" +
    "    <div class=\"starter-template\">\n" +
    "        <h1>Main Dashboard</h1>\n" +
    "        {{ testData }}\n" +
    "    </div>\n" +
    "</div>");
}]);

angular.module("components/staff/templates/add.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("components/staff/templates/add.html",
    "<div ng-app=\"ulakbus.staff\">\n" +
    "    <ng-include src=\"'shared/templates/add.html'\"></ng-include>\n" +
    "</div>");
}]);

angular.module("components/staff/templates/edit.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("components/staff/templates/edit.html",
    "<div ng-app=\"ulakbus.staff\">\n" +
    "    <div class=\"col-md-6\">\n" +
    "        <h1>{{ schema.title }}</h1>\n" +
    "        <form name=\"formgenerated\" sf-schema=\"schema\" sf-form=\"form\" sf-model=\"model\" ng-submit=\"onSubmit(formgenerated)\"></form>\n" +
    "    </div>\n" +
    "</div>");
}]);

angular.module("components/staff/templates/list.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("components/staff/templates/list.html",
    "<table class=\"table table-bordered table-responsive\">\n" +
    "    <thead>\n" +
    "    <tr>\n" +
    "        <!--<th>{{ staffs[0].key }}</th>-->\n" +
    "        <th ng-repeat=\"(key,value) in staffs[0].data\">{{ key }}</th>\n" +
    "        <th>action</th>\n" +
    "    </tr>\n" +
    "    </thead>\n" +
    "    <tbody>\n" +
    "    <tr ng-repeat=\"staff in staffs\">\n" +
    "        <!--<td><a ng-href=\"#/staff/{{staff.id}}\">{{staff.name}}</a></td>-->\n" +
    "        <td ng-repeat=\"(key,value) in staff.data\">{{value}}</td>\n" +
    "        <td>\n" +
    "            <a ng-href=\"#/staff/edit/{{staff.key}}\">Edit</a><br>\n" +
    "            <a ng-href=\"#/staff/{{staff.key}}\">Show</a>\n" +
    "        </td>\n" +
    "    </tr>\n" +
    "    </tbody>\n" +
    "</table>");
}]);

angular.module("components/staff/templates/show.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("components/staff/templates/show.html",
    "<p ng-repeat=\"(key, value) in staff\"><span class=\"col-md-3\">{{ key }}:</span>{{\n" +
    "    value}}</p>");
}]);

angular.module("components/student/student_add_template.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("components/student/student_add_template.html",
    "<div ng-app=\"ulakbus.student\">\n" +
    "    <div class=\"col-md-6\">\n" +
    "        <h1>{{ schema.title }}</h1>\n" +
    "        <form name=\"formgenerated\" sf-schema=\"schema\" sf-form=\"form\" sf-model=\"model\" ng-submit=\"onSubmit(formgenerated)\"></form>\n" +
    "    </div>\n" +
    "</div>");
}]);

angular.module("components/student/student_list_template.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("components/student/student_list_template.html",
    "<table class=\"table table-bordered\">\n" +
    "    <thead>\n" +
    "        <tr>\n" +
    "            <th ng-repeat=\"(key,value) in students[0]\">{{ key }}</th>\n" +
    "        </tr>\n" +
    "    </thead>\n" +
    "    <tbody>\n" +
    "        <tr ng-repeat=\"student in students\">\n" +
    "            <td ng-repeat=\"(key,value) in student\">{{value}}</td>\n" +
    "            <td><a ng-href=\"#/s/edit/{{student.id}}\">Edit</a></td>\n" +
    "        </tr>\n" +
    "    </tbody>\n" +
    "</table>");
}]);

angular.module("components/types/types_template.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("components/types/types_template.html",
    "<div ng-app=\"ulakbus.types\">\n" +
    "    <div class=\"col-md-6\">\n" +
    "        <h1>{{ schema.title }}</h1>\n" +
    "        <form name=\"formgenerated\" sf-schema=\"schema\" sf-form=\"form\" sf-model=\"model\" ng-submit=\"onSubmit(formgenerated)\"></form>\n" +
    "    </div>\n" +
    "</div>");
}]);
