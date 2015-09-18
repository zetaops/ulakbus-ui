angular.module('templates-prod', ['components/auth/login.html', 'components/crud/templates/add.html', 'components/crud/templates/edit.html', 'components/crud/templates/list.html', 'components/crud/templates/show.html', 'components/dashboard/dashboard.html', 'components/personelinfo/personelinfo.html', 'components/staff/templates/add.html', 'components/staff/templates/edit.html', 'components/staff/templates/list.html', 'components/staff/templates/show.html', 'components/student/student_add_template.html', 'components/student/student_list_template.html', 'components/types/types_template.html', 'shared/templates/add.html', 'shared/templates/datefield.html', 'shared/templates/directives/chat.html', 'shared/templates/directives/header-breadcrumb.html', 'shared/templates/directives/header-notification.html', 'shared/templates/directives/header-sub-menu.html', 'shared/templates/directives/notifications.html', 'shared/templates/directives/sidebar-search.html', 'shared/templates/directives/sidebar.html', 'shared/templates/directives/stats.html', 'shared/templates/directives/timeline.html', 'shared/templates/fieldset.html', 'shared/templates/foreignKey.html', 'shared/templates/linkedModelModalContent.html', 'shared/templates/listnodeModalContent.html', 'shared/templates/modalContent.html', 'shared/templates/nodeTable.html']);

angular.module("components/auth/login.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("components/auth/login.html",
    "<div ng-app=\"ulakbus.auth\" class=\"container\">\n" +
    "    <div class=\"row\">\n" +
    "        <div class=\"col-md-4 col-md-offset-4\">\n" +
    "            <div class=\"login-panel panel panel-default\">\n" +
    "                <div class=\"panel-heading\">\n" +
    "                    <h3 class=\"panel-title\">Sign In</h3>\n" +
    "                </div>\n" +
    "                <div class=\"panel-body\">\n" +
    "                    <span class=\"label label-warning\">{{message}}</span>\n" +
    "                    <form name=\"loginForm\" sf-schema=\"schema\" sf-form=\"form\" sf-model=\"model\" ng-submit=\"onSubmit(loginForm)\"></form>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "</div>");
}]);

angular.module("components/crud/templates/add.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("components/crud/templates/add.html",
    "<div>\n" +
    "    <ng-include src=\"'shared/templates/add.html'\"></ng-include>\n" +
    "</div>");
}]);

angular.module("components/crud/templates/edit.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("components/crud/templates/edit.html",
    "<div ng-app=\"ulakbus.crud\">\n" +
    "    <div class=\"col-md-6\">\n" +
    "        <h1>{{ schema.title }}</h1>\n" +
    "        <form name=\"formgenerated\" sf-schema=\"schema\" sf-form=\"form\" sf-model=\"model\" ng-submit=\"onSubmit(formgenerated)\"></form>\n" +
    "    </div>\n" +
    "</div>");
}]);

angular.module("components/crud/templates/list.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("components/crud/templates/list.html",
    "<div class=\"starter-template\">\n" +
    "    <h1>{{model}}</h1>\n" +
    "    <div class=\"tablescroll\">\n" +
    "        <table class=\"table table-bordered\" style=\"background-color:#fff;\">\n" +
    "            <thead>\n" +
    "            <tr>\n" +
    "                <th colspan=\"2\">\n" +
    "                    <label>\n" +
    "                        <input type=\"checkbox\" style=\"zoom:1.5; margin:5px 0 0 8px;\">\n" +
    "                        Hepsini Seç\n" +
    "                    </label>\n" +
    "                </th>\n" +
    "                <th ng-repeat=\"(key,value) in objects[0].data\">{{ key }}</th>\n" +
    "                <th>action</th>\n" +
    "            </tr>\n" +
    "            </thead>\n" +
    "            <tbody>\n" +
    "            <tr ng-repeat=\"object in objects\">\n" +
    "                <td width=\"60\">\n" +
    "                    <label>\n" +
    "                        <input type=\"checkbox\" style=\"zoom:1.5; margin:5px 0 0 8px;\">\n" +
    "                    </label>\n" +
    "                </td>\n" +
    "                <th scope=\"row\" style=\"text-align:center\">{{$index + 1}}</th>\n" +
    "                <td ng-repeat=\"(key,value) in object.data\">{{value}}</td>\n" +
    "                <td>\n" +
    "                    <a ng-href=\"#/{{model}}/edit/{{object.key}}\">Edit</a><br>\n" +
    "                    <a ng-href=\"#/{{model}}/{{object.key}}\">Show</a>\n" +
    "                </td>\n" +
    "            </tr>\n" +
    "            </tbody>\n" +
    "        </table>\n" +
    "    </div>\n" +
    "\n" +
    "    <div class=\"btn-group\">\n" +
    "        <button type=\"button\" class=\"btn btn-default dropdown-toggle\" data-toggle=\"dropdown\" aria-haspopup=\"true\"\n" +
    "                aria-expanded=\"false\">\n" +
    "            İşlemler <span class=\"caret\"></span>\n" +
    "        </button>\n" +
    "        <ul class=\"dropdown-menu\">\n" +
    "            <li><a href=\"\">İşlem 1</a></li>\n" +
    "            <li><a href=\"\">İşlem 2</a></li>\n" +
    "            <li><a href=\"\">İşlem 3</a></li>\n" +
    "            <li role=\"separator\" class=\"divider\"></li>\n" +
    "            <li><a href=\"\">İşlem 4</a></li>\n" +
    "        </ul>\n" +
    "    </div>\n" +
    "\n" +
    "    <hr>\n" +
    "\n" +
    "</div>");
}]);

angular.module("components/crud/templates/show.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("components/crud/templates/show.html",
    "<div class=\"starter-template\">\n" +
    "    <h1>{{model}}</h1>\n" +
    "\n" +
    "    <p ng-repeat=\"(key, value) in object\"><span class=\"col-md-3\">{{ key }}:</span>{{value}}</p>\n" +
    "</div>");
}]);

angular.module("components/dashboard/dashboard.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("components/dashboard/dashboard.html",
    "<div ng-app=\"ulakbus.dashboard\">\n" +
    "    <div class=\"starter-template\">\n" +
    "\n" +
    "        <!-- table view -->\n" +
    "        <!--<table class=\"table table-bordered\" style=\"background-color:#fff;\">-->\n" +
    "            <!--<thead>-->\n" +
    "            <!--<tr>-->\n" +
    "                <!--<th colspan=\"2\">-->\n" +
    "                    <!--<label>-->\n" +
    "                        <!--<input type=\"checkbox\" style=\"zoom:1.5; margin:5px 0 0 8px;\">-->\n" +
    "                        <!--Hepsini Seç-->\n" +
    "                    <!--</label>-->\n" +
    "                <!--</th>-->\n" +
    "                <!--<th>First Name</th>-->\n" +
    "                <!--<th>Last Name</th>-->\n" +
    "                <!--<th>Username</th>-->\n" +
    "            <!--</tr>-->\n" +
    "            <!--</thead>-->\n" +
    "            <!--<tbody>-->\n" +
    "            <!--<tr>-->\n" +
    "                <!--<td width=\"60\">-->\n" +
    "                    <!--<label>-->\n" +
    "                        <!--<input type=\"checkbox\" style=\"zoom:1.5; margin:5px 0 0 8px;\">-->\n" +
    "                    <!--</label>-->\n" +
    "                <!--</td>-->\n" +
    "                <!--<th scope=\"row\" style=\"text-align:center\">1</th>-->\n" +
    "                <!--<td>Mark</td>-->\n" +
    "                <!--<td>Otto</td>-->\n" +
    "                <!--<td>@mdo</td>-->\n" +
    "            <!--</tr>-->\n" +
    "            <!--<tr>-->\n" +
    "                <!--<td>-->\n" +
    "                    <!--<label>-->\n" +
    "                        <!--<input type=\"checkbox\" style=\"zoom:1.5; margin:5px 0 0 8px;\">-->\n" +
    "                    <!--</label>-->\n" +
    "                <!--</td>-->\n" +
    "                <!--<th scope=\"row\" style=\"text-align:center\">2</th>-->\n" +
    "                <!--<td>Jacob</td>-->\n" +
    "                <!--<td>Thornton</td>-->\n" +
    "                <!--<td>@fat</td>-->\n" +
    "            <!--</tr>-->\n" +
    "            <!--<tr>-->\n" +
    "                <!--<td>-->\n" +
    "                    <!--<label>-->\n" +
    "                        <!--<input type=\"checkbox\" style=\"zoom:1.5; margin:5px 0 0 8px;\">-->\n" +
    "                    <!--</label>-->\n" +
    "                <!--</td>-->\n" +
    "                <!--<th scope=\"row\" style=\"text-align:center\">3</th>-->\n" +
    "                <!--<td>Larry</td>-->\n" +
    "                <!--<td>the Bird</td>-->\n" +
    "                <!--<td>@twitter</td>-->\n" +
    "            <!--</tr>-->\n" +
    "            <!--<tr>-->\n" +
    "                <!--<td width=\"60\">-->\n" +
    "                    <!--<label>-->\n" +
    "                        <!--<input type=\"checkbox\" style=\"zoom:1.5; margin:5px 0 0 8px;\">-->\n" +
    "                    <!--</label>-->\n" +
    "                <!--</td>-->\n" +
    "                <!--<th scope=\"row\" style=\"text-align:center\">4</th>-->\n" +
    "                <!--<td>Mark</td>-->\n" +
    "                <!--<td>Otto</td>-->\n" +
    "                <!--<td>@mdo</td>-->\n" +
    "            <!--</tr>-->\n" +
    "            <!--<tr>-->\n" +
    "                <!--<td>-->\n" +
    "                    <!--<label>-->\n" +
    "                        <!--<input type=\"checkbox\" style=\"zoom:1.5; margin:5px 0 0 8px;\">-->\n" +
    "                    <!--</label>-->\n" +
    "                <!--</td>-->\n" +
    "                <!--<th scope=\"row\" style=\"text-align:center\">5</th>-->\n" +
    "                <!--<td>Jacob</td>-->\n" +
    "                <!--<td>Thornton</td>-->\n" +
    "                <!--<td>@fat</td>-->\n" +
    "            <!--</tr>-->\n" +
    "            <!--<tr>-->\n" +
    "                <!--<td>-->\n" +
    "                    <!--<label>-->\n" +
    "                        <!--<input type=\"checkbox\" style=\"zoom:1.5; margin:5px 0 0 8px;\">-->\n" +
    "                    <!--</label>-->\n" +
    "                <!--</td>-->\n" +
    "                <!--<th scope=\"row\" style=\"text-align:center\">6</th>-->\n" +
    "                <!--<td>Larry</td>-->\n" +
    "                <!--<td>the Bird</td>-->\n" +
    "                <!--<td>@twitter</td>-->\n" +
    "            <!--</tr>-->\n" +
    "            <!--</tbody>-->\n" +
    "        <!--</table>-->\n" +
    "        <!--&lt;!&ndash; end of table view &ndash;&gt;-->\n" +
    "\n" +
    "        <!--<div class=\"btn-group\">-->\n" +
    "            <!--<button type=\"button\" class=\"btn btn-default dropdown-toggle\" data-toggle=\"dropdown\" aria-haspopup=\"true\"-->\n" +
    "                    <!--aria-expanded=\"false\">-->\n" +
    "                <!--İşlemler <span class=\"caret\"></span>-->\n" +
    "            <!--</button>-->\n" +
    "            <!--<ul class=\"dropdown-menu\">-->\n" +
    "                <!--<li><a href=\"\">İşlem 1</a></li>-->\n" +
    "                <!--<li><a href=\"\">İşlem 2</a></li>-->\n" +
    "                <!--<li><a href=\"\">İşlem 3</a></li>-->\n" +
    "                <!--<li role=\"separator\" class=\"divider\"></li>-->\n" +
    "                <!--<li><a href=\"\">İşlem 4</a></li>-->\n" +
    "            <!--</ul>-->\n" +
    "        <!--</div>-->\n" +
    "\n" +
    "\n" +
    "        <!--<hr>-->\n" +
    "\n" +
    "    </div>\n" +
    "</div>");
}]);

angular.module("components/personelinfo/personelinfo.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("components/personelinfo/personelinfo.html",
    "<div ng-app=\"ulakbus.personelinfo\">\n" +
    "    <div class=\"starter-template\">\n" +
    "        \n" +
    "        <div class=\"personnel-info-container\">\n" +
    "        	<div class=\"personnel-info-left\">\n" +
    "            	<div class=\"generic-profile-picture\">\n" +
    "                	<img src=\"../../img/sample-profile-pic.jpg\" />\n" +
    "                </div>\n" +
    "                <ul>\n" +
    "                	<li>Gökhan Boranalp</li>\n" +
    "                    <li>Pozisyon</li>\n" +
    "                	<li><i class=\"fa fa-phone\"></i> (+90) 123 456 7890</li>\n" +
    "                    <li><i class=\"fa fa-envelope\"></i> samplemail@mail.com</li>\n" +
    "                    <li><i class=\"fa fa-map-marker\"></i> Gülbahçe Mah. İzmir Teknoloji Geliştirme Bölgesi A9 Blok 215/A IYTE Campus, URLA/IZMIR</li></li>\n" +
    "                </ul>\n" +
    "            </div>\n" +
    "            <!-- end of personnel-info-left -->\n" +
    "        	<div class=\"personnel-info-right\">\n" +
    "                <div class=\"info-block\">\n" +
    "                	<div class=\"info-block-header\">\n" +
    "                    	<h2>Kişisel Bilgiler</h2>\n" +
    "                    </div>\n" +
    "                    <!-- end of info-block-header -->\n" +
    "                    <div class=\"info-block-body\">\n" +
    "                    	<dl class=\"dl-horizontal\">\n" +
    "                            <dt>Ad Soyad</dt>\n" +
    "                            <dd>Gökhan Boranalp</dd>\n" +
    "                        </dl>\n" +
    "                        <dl class=\"dl-horizontal\">\n" +
    "                            <dt>Cinsiyet</dt>\n" +
    "                            <dd>Erkek</dd>\n" +
    "                        </dl>\n" +
    "                        <dl class=\"dl-horizontal\">\n" +
    "                            <dt>Doğum Tarihi</dt>\n" +
    "                            <dd>23/06/1970</dd>\n" +
    "                        </dl>\n" +
    "                        <dl class=\"dl-horizontal\">\n" +
    "                            <dt>İkamet Adresi</dt>\n" +
    "                            <dd>Gülbahçe Mah. İzmir Teknoloji Geliştirme Bölgesi A9 Blok 215/A IYTE Campus, URLA/IZMIR</dd>\n" +
    "                        </dl>\n" +
    "                    </div>\n" +
    "                    <!-- end of info-block-body -->\n" +
    "                </div>\n" +
    "                <!-- end of info block -->\n" +
    "                \n" +
    "                <div class=\"info-block\">\n" +
    "                	<div class=\"info-block-header\">\n" +
    "                    	<h2>İletişim Bilgileri</h2>\n" +
    "                    </div>\n" +
    "                    <!-- end of info-block-header -->\n" +
    "                    <div class=\"info-block-body\">\n" +
    "                    	<dl class=\"dl-horizontal\">\n" +
    "                            <dt>Ev Telefonu</dt>\n" +
    "                            <dd>-</dd>\n" +
    "                        </dl>\n" +
    "                        <dl class=\"dl-horizontal\">\n" +
    "                            <dt>Cep Telefonu</dt>\n" +
    "                            <dd>(+90) 123 456 7890</dd>\n" +
    "                        </dl>\n" +
    "                        <dl class=\"dl-horizontal\">\n" +
    "                            <dt>Mail Adresi</dt>\n" +
    "                            <dd>gokhan@zetaops.io</dd>\n" +
    "                        </dl>\n" +
    "                        <dl class=\"dl-horizontal\">\n" +
    "                            <dt>Diğer Mail Adresi</dt>\n" +
    "                            <dd>-</dd>\n" +
    "                        </dl>\n" +
    "                    </div>\n" +
    "                    <!-- end of info-block-body -->\n" +
    "                </div>\n" +
    "                <!-- end of info block -->\n" +
    "            </div>\n" +
    "            <!-- personnel-info-left -->\n" +
    "        </div>\n" +
    "        <!-- end of personnel-info-container -->\n" +
    "        \n" +
    "        <div class=\"personnel-info-container personnel-info-edit\">\n" +
    "        	<div class=\"personnel-info-left\">\n" +
    "            	<div class=\"generic-profile-picture\">\n" +
    "                	<img src=\"../../img/sample-profile-pic.jpg\" />\n" +
    "                </div>\n" +
    "                <div style=\"margin-top:10px; text-align:center;\">\n" +
    "                <button type=\"button\" class=\"btn btn-primary\">Değiştir</button>\n" +
    "                <button type=\"button\" class=\"btn btn-danger\">Sil</button>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "            <!-- end of personnel-info-left -->\n" +
    "        	<div class=\"personnel-info-right\">\n" +
    "                <div class=\"info-block\">\n" +
    "                	<div class=\"info-block-header\">\n" +
    "                    	<h2>Kişisel Bilgiler</h2>\n" +
    "                    </div>\n" +
    "                    <!-- end of info-block-header -->\n" +
    "                    <div class=\"info-block-body\">\n" +
    "                    	<dl class=\"dl-horizontal\">\n" +
    "                            <dt>Ad Soyad</dt>\n" +
    "                            <dd><input type=\"text\" class=\"form-control\" placeholder=\"Gökhan Boranalp\"></dd>\n" +
    "                        </dl>\n" +
    "                        <dl class=\"dl-horizontal\">\n" +
    "                            <dt>Pozisyon</dt>\n" +
    "                            <dd><input type=\"text\" class=\"form-control\" placeholder=\"Pozisyon\"></dd>\n" +
    "                        </dl>\n" +
    "                        <dl class=\"dl-horizontal\">\n" +
    "                            <dt>Cinsiyet</dt>\n" +
    "                            <dd>\n" +
    "                            	<select class=\"form-control\">\n" +
    "                                  <option value=\"male\">Erkek</option>\n" +
    "                                  <option value=\"female\">Kadın</option>\n" +
    "                                </select>\n" +
    "                            </dd>\n" +
    "                        </dl>\n" +
    "                        <dl class=\"dl-horizontal\">\n" +
    "                            <dt>Doğum Tarihi</dt>\n" +
    "                            <dd>\n" +
    "                            <input type=\"text\" class=\"form-control\" placeholder=\"Angular JS - Bootstrap Date Picker Eklenecek\">\n" +
    "                            </dd>\n" +
    "                        </dl>\n" +
    "                        <dl class=\"dl-horizontal\">\n" +
    "                            <dt>İkamet Adresi</dt>\n" +
    "                            <dd><input type=\"text\" class=\"form-control\" placeholder=\"Gülbahçe Mah. İzmir Teknoloji Geliştirme Bölgesi A9 Blok 215/A IYTE Campus, URLA/IZMIR\"></dd>\n" +
    "                        </dl>\n" +
    "                    </div>\n" +
    "                    <!-- end of info-block-body -->\n" +
    "                </div>\n" +
    "                <!-- end of info block -->\n" +
    "                \n" +
    "                <div class=\"info-block\">\n" +
    "                	<div class=\"info-block-header\">\n" +
    "                    	<h2>İletişim Bilgileri</h2>\n" +
    "                    </div>\n" +
    "                    <!-- end of info-block-header -->\n" +
    "                    <div class=\"info-block-body\">\n" +
    "                    	<dl class=\"dl-horizontal\">\n" +
    "                            <dt>Ev Telefonu</dt>\n" +
    "                            <dd><input type=\"text\" class=\"form-control\" placeholder=\"\"></dd>\n" +
    "                        </dl>\n" +
    "                        <dl class=\"dl-horizontal\">\n" +
    "                            <dt>Cep Telefonu</dt>\n" +
    "                            <dd><input type=\"text\" class=\"form-control\" placeholder=\"(+90) 123 456 7890 (Phone number mask uygulanacak)\"></dd>\n" +
    "                        </dl>\n" +
    "                        <dl class=\"dl-horizontal\">\n" +
    "                            <dt>Mail Adresi</dt>\n" +
    "                            <dd><input type=\"text\" class=\"form-control\" placeholder=\"gokhan@zetaops.io\"></dd>\n" +
    "                        </dl>\n" +
    "                        <dl class=\"dl-horizontal\">\n" +
    "                            <dt>Diğer Mail Adresi</dt>\n" +
    "                            <dd><input type=\"text\" class=\"form-control\" placeholder=\"\"></dd>\n" +
    "                        </dl>\n" +
    "                    </div>\n" +
    "                    <!-- end of info-block-body -->\n" +
    "                </div>\n" +
    "                <!-- end of info block -->\n" +
    "            </div>\n" +
    "            <!-- personnel-info-left -->\n" +
    "        </div>\n" +
    "        <!-- end of personnel-info-container -->\n" +
    "\n" +
    "\n" +
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

angular.module("shared/templates/add.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("shared/templates/add.html",
    "<h1>{{ schema.title }}</h1>\n" +
    "<form id=\"formgenerated\" name=\"formgenerated\" sf-schema=\"schema\" sf-form=\"form\" sf-model=\"model\"></form>\n" +
    "<div ng-repeat=\"node in Node\">\n" +
    "    <h3>{{ node.title }}\n" +
    "        <span ng-if=\"node.lengthModels < 1\">\n" +
    "            <a href=\"javascript:void(0);\" modal-for-nodes=\"{{node.title}},Node\">\n" +
    "                <i class=\"fa fa-plus-circle fa-fw\"></i>\n" +
    "            </a>\n" +
    "        </span>\n" +
    "    </h3>\n" +
    "    <ng-include src=\"'shared/templates/nodeTable.html'\"></ng-include>\n" +
    "    <hr>\n" +
    "</div>\n" +
    "<div ng-repeat=\"node in ListNode\">\n" +
    "    <h3>{{ node.title }}\n" +
    "        <span>\n" +
    "            <a href=\"javascript:void(0);\" modal-for-nodes=\"{{node.title}},ListNode\">\n" +
    "                <i class=\"fa fa-plus-circle fa-fw\"></i>\n" +
    "            </a>\n" +
    "        </span>\n" +
    "    </h3>\n" +
    "    <ng-include src=\"'shared/templates/nodeTable.html'\"></ng-include>\n" +
    "    <hr>\n" +
    "</div>\n" +
    "\n" +
    "<button id=\"submitbutton\" type=\"button\" class=\"btn btn-primary\" ng-click=\"onSubmit(formgenerated)\">Kaydet</button>\n" +
    "<!-- <button type=\"button\" class=\"btn btn-warning\">Düzenle</button>  todo: make it conditional -->\n" +
    "<!-- <button type=\"button\" class=\"btn btn-danger\">İptal</button> todo: turn back to previous page -->");
}]);

angular.module("shared/templates/datefield.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("shared/templates/datefield.html",
    "<div class=\"form-group schema-form-{{form.type}} {{form.htmlClass}}\"\n" +
    "     ng-class=\"{'has-error': form.disableErrorState !== true && hasError(), 'has-success': form.disableSuccessState !== true && hasSuccess(), 'has-feedback': form.feedback !== false }\">\n" +
    "    <label class=\"control-label {{form.labelHtmlClass}}\" ng-class=\"{'sr-only': !showTitle()}\"\n" +
    "           for=\"{{form.key.slice(-1)[0]}}\">{{form.title}}</label>\n" +
    "\n" +
    "    <p class=\"input-group\">\n" +
    "        <input ng-if=\"!form.fieldAddonLeft && !form.fieldAddonRight\"\n" +
    "               ng-show=\"form.key\"\n" +
    "               step=\"any\"\n" +
    "               sf-changed=\"form\"\n" +
    "               placeholder=\"{{form.placeholder}}\"\n" +
    "               class=\"form-control {{form.fieldHtmlClass}} datepickerfield\"\n" +
    "               id=\"{{form.key.slice(-1)[0]}}\"\n" +
    "               ng-model-options=\"form.ngModelOptions\"\n" +
    "               ng-model=\"dt\"\n" +
    "               ng-disabled=\"form.readonly\"\n" +
    "               schema-validate=\"form\"\n" +
    "               name=\"{{form.key.slice(-1)[0]}}\"\n" +
    "               aria-describedby=\"{{form.key.slice(-1)[0] + 'Status'}}\"\n" +
    "\n" +
    "               type=\"date\"\n" +
    "               datepicker-popup\n" +
    "               is-open=\"status.opened\"\n" +
    "               date-disabled=\"disabled(date, mode)\"\n" +
    "               close-text=\"Close\"/>\n" +
    "        <span class=\"input-group-btn\">\n" +
    "            <button type=\"button\" class=\"btn btn-default\" ng-click=\"open($event)\">\n" +
    "                <i class=\"glyphicon glyphicon-calendar\"></i>\n" +
    "            </button>\n" +
    "        </span>\n" +
    "    </p>\n" +
    "\n" +
    "    <!--<input ng-if=\"!form.fieldAddonLeft && !form.fieldAddonRight\"-->\n" +
    "    <!--ng-show=\"form.key\"-->\n" +
    "    <!--type=\"{{form.type}}\"-->\n" +
    "    <!--step=\"any\"-->\n" +
    "    <!--sf-changed=\"form\"-->\n" +
    "    <!--placeholder=\"{{form.placeholder}}\"-->\n" +
    "    <!--class=\"form-control {{form.fieldHtmlClass}}\"-->\n" +
    "    <!--id=\"{{form.key.slice(-1)[0]}}\"-->\n" +
    "    <!--ng-model-options=\"form.ngModelOptions\"-->\n" +
    "    <!--ng-model=\"$$value$$\"-->\n" +
    "    <!--ng-disabled=\"form.readonly\"-->\n" +
    "    <!--schema-validate=\"form\"-->\n" +
    "    <!--name=\"{{form.key.slice(-1)[0]}}\"-->\n" +
    "    <!--aria-describedby=\"{{form.key.slice(-1)[0] + 'Status'}}\">-->\n" +
    "\n" +
    "    <div ng-if=\"form.fieldAddonLeft || form.fieldAddonRight\"\n" +
    "         ng-class=\"{'input-group': (form.fieldAddonLeft || form.fieldAddonRight)}\">\n" +
    "    <span ng-if=\"form.fieldAddonLeft\"\n" +
    "          class=\"input-group-addon\"\n" +
    "          ng-bind-html=\"form.fieldAddonLeft\"></span>\n" +
    "        <input ng-show=\"form.key\"\n" +
    "               type=\"{{form.type}}\"\n" +
    "               step=\"any\"\n" +
    "               sf-changed=\"form\"\n" +
    "               placeholder=\"{{form.placeholder}}\"\n" +
    "               class=\"form-control {{form.fieldHtmlClass}}\"\n" +
    "               id=\"{{form.key.slice(-1)[0]}}\"\n" +
    "               ng-model-options=\"form.ngModelOptions\"\n" +
    "               ng-model=\"$$value$$\"\n" +
    "               ng-disabled=\"form.readonly\"\n" +
    "               schema-validate=\"form\"\n" +
    "               name=\"{{form.key.slice(-1)[0]}}\"\n" +
    "               aria-describedby=\"{{form.key.slice(-1)[0] + 'Status'}}\">\n" +
    "\n" +
    "    <span ng-if=\"form.fieldAddonRight\"\n" +
    "          class=\"input-group-addon\"\n" +
    "          ng-bind-html=\"form.fieldAddonRight\"></span>\n" +
    "    </div>\n" +
    "\n" +
    "  <span ng-if=\"form.feedback !== false\"\n" +
    "        class=\"form-control-feedback\"\n" +
    "        ng-class=\"evalInScope(form.feedback) || {'glyphicon': true, 'glyphicon-ok': hasSuccess(), 'glyphicon-remove': hasError() }\"\n" +
    "        aria-hidden=\"true\"></span>\n" +
    "\n" +
    "  <span ng-if=\"hasError() || hasSuccess()\"\n" +
    "        id=\"{{form.key.slice(-1)[0] + 'Status'}}\"\n" +
    "        class=\"sr-only\">{{ hasSuccess() ? '(success)' : '(error)' }}</span>\n" +
    "\n" +
    "    <div class=\"help-block\" sf-message=\"form.description\"></div>\n" +
    "</div>\n" +
    "");
}]);

angular.module("shared/templates/directives/chat.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("shared/templates/directives/chat.html",
    "<div class=\"chat-panel panel panel-default\">\n" +
    "    <div class=\"panel-heading\">\n" +
    "        <i class=\"fa fa-comments fa-fw\"></i>\n" +
    "        Chat\n" +
    "        <div class=\"btn-group pull-right\">\n" +
    "            <button type=\"button\" class=\"btn btn-default btn-xs dropdown-toggle\" data-toggle=\"dropdown\">\n" +
    "                <i class=\"fa fa-chevron-down\"></i>\n" +
    "            </button>\n" +
    "            <ul class=\"dropdown-menu slidedown\">\n" +
    "                <li>\n" +
    "                    <a href=\"#\">\n" +
    "                        <i class=\"fa fa-refresh fa-fw\"></i> Refresh\n" +
    "                    </a>\n" +
    "                </li>\n" +
    "                <li>\n" +
    "                    <a href=\"#\">\n" +
    "                        <i class=\"fa fa-check-circle fa-fw\"></i> Available\n" +
    "                    </a>\n" +
    "                </li>\n" +
    "                <li>\n" +
    "                    <a href=\"#\">\n" +
    "                        <i class=\"fa fa-times fa-fw\"></i> Busy\n" +
    "                    </a>\n" +
    "                </li>\n" +
    "                <li>\n" +
    "                    <a href=\"#\">\n" +
    "                        <i class=\"fa fa-clock-o fa-fw\"></i> Away\n" +
    "                    </a>\n" +
    "                </li>\n" +
    "                <li class=\"divider\"></li>\n" +
    "                <li>\n" +
    "                    <a href=\"#\">\n" +
    "                        <i class=\"fa fa-sign-out fa-fw\"></i> Sign Out\n" +
    "                    </a>\n" +
    "                </li>\n" +
    "            </ul>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "    <!-- /.panel-heading -->\n" +
    "    <div class=\"panel-body\">\n" +
    "        <ul class=\"chat\">\n" +
    "            <li class=\"left clearfix\">\n" +
    "                <span class=\"chat-img pull-left\">\n" +
    "                    <img src=\"http://placehold.it/50/55C1E7/fff\" alt=\"User Avatar\" class=\"img-circle\">\n" +
    "                </span>\n" +
    "                <div class=\"chat-body clearfix\">\n" +
    "                    <div class=\"header\">\n" +
    "                        <strong class=\"primary-font\">Jack Sparrow</strong>\n" +
    "                        <small class=\"pull-right text-muted\">\n" +
    "                            <i class=\"fa fa-clock-o fa-fw\"></i> 12 mins ago\n" +
    "                        </small>\n" +
    "                    </div>\n" +
    "                    <p>\n" +
    "                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur bibendum ornare dolor, quis ullamcorper ligula sodales.\n" +
    "                    </p>\n" +
    "                </div>\n" +
    "            </li>\n" +
    "            <li class=\"right clearfix\">\n" +
    "                <span class=\"chat-img pull-right\">\n" +
    "                    <img src=\"http://placehold.it/50/FA6F57/fff\" alt=\"User Avatar\" class=\"img-circle\">\n" +
    "                </span>\n" +
    "                <div class=\"chat-body clearfix\">\n" +
    "                    <div class=\"header\">\n" +
    "                        <small class=\" text-muted\">\n" +
    "                            <i class=\"fa fa-clock-o fa-fw\"></i> 13 mins ago</small>\n" +
    "                            <strong class=\"pull-right primary-font\">Bhaumik Patel</strong>\n" +
    "                    </div>\n" +
    "                    <p>\n" +
    "                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur bibendum ornare dolor, quis ullamcorper ligula sodales.\n" +
    "                    </p>\n" +
    "                </div>\n" +
    "            </li>\n" +
    "            <li class=\"left clearfix\">\n" +
    "                <span class=\"chat-img pull-left\">\n" +
    "                    <img src=\"http://placehold.it/50/55C1E7/fff\" alt=\"User Avatar\" class=\"img-circle\">\n" +
    "                </span>\n" +
    "                <div class=\"chat-body clearfix\">\n" +
    "                    <div class=\"header\">\n" +
    "                        <strong class=\"primary-font\">Jack Sparrow</strong>\n" +
    "                        <small class=\"pull-right text-muted\">\n" +
    "                            <i class=\"fa fa-clock-o fa-fw\"></i> 14 mins ago</small>\n" +
    "                        </div>\n" +
    "                        <p>\n" +
    "                            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur bibendum ornare dolor, quis ullamcorper ligula sodales.\n" +
    "                        </p>\n" +
    "                </div>\n" +
    "            </li>\n" +
    "            <li class=\"right clearfix\">\n" +
    "                <span class=\"chat-img pull-right\">\n" +
    "                    <img src=\"http://placehold.it/50/FA6F57/fff\" alt=\"User Avatar\" class=\"img-circle\">\n" +
    "                </span>\n" +
    "                <div class=\"chat-body clearfix\">\n" +
    "                    <div class=\"header\">\n" +
    "                        <small class=\" text-muted\">\n" +
    "                            <i class=\"fa fa-clock-o fa-fw\"></i> 15 mins ago</small>\n" +
    "                            <strong class=\"pull-right primary-font\">Bhaumik Patel</strong>\n" +
    "                    </div>\n" +
    "                    <p>\n" +
    "                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur bibendum ornare dolor, quis ullamcorper ligula sodales.\n" +
    "                    </p>\n" +
    "                </div>\n" +
    "            </li>\n" +
    "        </ul>\n" +
    "    </div>\n" +
    "                <!-- /.panel-body -->\n" +
    "    <div class=\"panel-footer\">\n" +
    "        <div class=\"input-group\">\n" +
    "            <input id=\"btn-input\" type=\"text\" class=\"form-control input-sm\" placeholder=\"Type your message here...\">\n" +
    "            <span class=\"input-group-btn\">\n" +
    "                <button class=\"btn btn-warning btn-sm\" id=\"btn-chat\">\n" +
    "                    Send\n" +
    "                </button>\n" +
    "            </span>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "    <!-- /.panel-footer -->\n" +
    "</div>");
}]);

angular.module("shared/templates/directives/header-breadcrumb.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("shared/templates/directives/header-breadcrumb.html",
    "<ul class=\"breadcrumb\">\n" +
    "    <li ng-repeat=\"link in links\" ng-class=\"{'active':$last}\">\n" +
    "        <a href=\"#\" ng-if=\"!$last\">{{link}}</a>\n" +
    "        <span ng-if=\"$last\">{{link}}</span>\n" +
    "    </li>\n" +
    "</ul>");
}]);

angular.module("shared/templates/directives/header-notification.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("shared/templates/directives/header-notification.html",
    "<ul class=\"nav navbar-top-links navbar-right\">\n" +
    "    <li class=\"dropdown\">\n" +
    "        <a class=\"dropdown-toggle\" data-toggle=\"dropdown\">\n" +
    "            <i class=\"fa fa-envelope fa-fw\"></i>  <i class=\"fa fa-caret-down\"></i>\n" +
    "        </a>\n" +
    "        <ul class=\"dropdown-menu dropdown-messages\">\n" +
    "            <li>\n" +
    "                <a href=\"#\">\n" +
    "                    <div>\n" +
    "                        <strong>John Smith</strong>\n" +
    "                        <span class=\"pull-right text-muted\">\n" +
    "                            <em>Yesterday</em>\n" +
    "                        </span>\n" +
    "                    </div>\n" +
    "                    <div>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque eleifend...</div>\n" +
    "                </a>\n" +
    "            </li>\n" +
    "            <li class=\"divider\"></li>\n" +
    "            <li>\n" +
    "                <a href=\"#\">\n" +
    "                    <div>\n" +
    "                        <strong>John Smith</strong>\n" +
    "                        <span class=\"pull-right text-muted\">\n" +
    "                            <em>Yesterday</em>\n" +
    "                        </span>\n" +
    "                    </div>\n" +
    "                    <div>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque eleifend...</div>\n" +
    "                </a>\n" +
    "            </li>\n" +
    "            <li class=\"divider\"></li>\n" +
    "            <li>\n" +
    "                <a href=\"#\">\n" +
    "                    <div>\n" +
    "                        <strong>John Smith</strong>\n" +
    "                        <span class=\"pull-right text-muted\">\n" +
    "                            <em>Yesterday</em>\n" +
    "                        </span>\n" +
    "                    </div>\n" +
    "                    <div>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque eleifend...</div>\n" +
    "                </a>\n" +
    "            </li>\n" +
    "            <li class=\"divider\"></li>\n" +
    "            <li>\n" +
    "                <a class=\"text-center\" href=\"#\">\n" +
    "                    <strong>Read All Messages</strong>\n" +
    "                    <i class=\"fa fa-angle-right\"></i>\n" +
    "                </a>\n" +
    "            </li>\n" +
    "        </ul>\n" +
    "        <!-- /.dropdown-messages -->\n" +
    "    </li>\n" +
    "    <!-- /.dropdown -->\n" +
    "    <li class=\"dropdown\">\n" +
    "        <a class=\"dropdown-toggle\" data-toggle=\"dropdown\">\n" +
    "            <i class=\"fa fa-tasks fa-fw\"></i>  <i class=\"fa fa-caret-down\"></i>\n" +
    "        </a>\n" +
    "        <ul class=\"dropdown-menu dropdown-tasks\">\n" +
    "            <li>\n" +
    "                <a href=\"#\">\n" +
    "                    <div>\n" +
    "                        <p>\n" +
    "                            <strong>Task 1</strong>\n" +
    "                            <span class=\"pull-right text-muted\">40% Complete</span>\n" +
    "                        </p>\n" +
    "                        <div class=\"progress progress-striped active\">\n" +
    "                            <div class=\"progress-bar progress-bar-success\" role=\"progressbar\" aria-valuenow=\"40\" aria-valuemin=\"0\" aria-valuemax=\"100\" style=\"width: 40%\">\n" +
    "                                <span class=\"sr-only\">40% Complete (success)</span>\n" +
    "                            </div>\n" +
    "                        </div>\n" +
    "                    </div>\n" +
    "                </a>\n" +
    "            </li>\n" +
    "            <li class=\"divider\"></li>\n" +
    "            <li>\n" +
    "                <a href=\"#\">\n" +
    "                    <div>\n" +
    "                        <p>\n" +
    "                            <strong>Task 2</strong>\n" +
    "                            <span class=\"pull-right text-muted\">20% Complete</span>\n" +
    "                        </p>\n" +
    "                        <div class=\"progress progress-striped active\">\n" +
    "                            <div class=\"progress-bar progress-bar-info\" role=\"progressbar\" aria-valuenow=\"20\" aria-valuemin=\"0\" aria-valuemax=\"100\" style=\"width: 20%\">\n" +
    "                                <span class=\"sr-only\">20% Complete</span>\n" +
    "                            </div>\n" +
    "                        </div>\n" +
    "                    </div>\n" +
    "                </a>\n" +
    "            </li>\n" +
    "            <li class=\"divider\"></li>\n" +
    "            <li>\n" +
    "                <a href=\"#\">\n" +
    "                    <div>\n" +
    "                        <p>\n" +
    "                            <strong>Task 3</strong>\n" +
    "                            <span class=\"pull-right text-muted\">60% Complete</span>\n" +
    "                        </p>\n" +
    "                        <div class=\"progress progress-striped active\">\n" +
    "                            <div class=\"progress-bar progress-bar-warning\" role=\"progressbar\" aria-valuenow=\"60\" aria-valuemin=\"0\" aria-valuemax=\"100\" style=\"width: 60%\">\n" +
    "                                <span class=\"sr-only\">60% Complete (warning)</span>\n" +
    "                            </div>\n" +
    "                        </div>\n" +
    "                    </div>\n" +
    "                </a>\n" +
    "            </li>\n" +
    "            <li class=\"divider\"></li>\n" +
    "            <li>\n" +
    "                <a href=\"#\">\n" +
    "                    <div>\n" +
    "                        <p>\n" +
    "                            <strong>Task 4</strong>\n" +
    "                            <span class=\"pull-right text-muted\">80% Complete</span>\n" +
    "                        </p>\n" +
    "                        <div class=\"progress progress-striped active\">\n" +
    "                            <div class=\"progress-bar progress-bar-danger\" role=\"progressbar\" aria-valuenow=\"80\" aria-valuemin=\"0\" aria-valuemax=\"100\" style=\"width: 80%\">\n" +
    "                                <span class=\"sr-only\">80% Complete (danger)</span>\n" +
    "                            </div>\n" +
    "                        </div>\n" +
    "                    </div>\n" +
    "                </a>\n" +
    "            </li>\n" +
    "            <li class=\"divider\"></li>\n" +
    "            <li>\n" +
    "                <a class=\"text-center\" href=\"#\">\n" +
    "                    <strong>See All Tasks</strong>\n" +
    "                    <i class=\"fa fa-angle-right\"></i>\n" +
    "                </a>\n" +
    "            </li>\n" +
    "        </ul>\n" +
    "        <!-- /.dropdown-tasks -->\n" +
    "    </li>\n" +
    "    <!-- /.dropdown -->\n" +
    "    <li class=\"dropdown\">\n" +
    "        <a class=\"dropdown-toggle\" data-toggle=\"dropdown\">\n" +
    "            <i class=\"fa fa-bell fa-fw\"></i>  <i class=\"fa fa-caret-down\"></i>\n" +
    "        </a>\n" +
    "        <ul class=\"dropdown-menu dropdown-alerts\">\n" +
    "            <li>\n" +
    "                <a href=\"#\">\n" +
    "                    <div>\n" +
    "                        <i class=\"fa fa-comment fa-fw\"></i> New Comment\n" +
    "                        <span class=\"pull-right text-muted small\">4 minutes ago</span>\n" +
    "                    </div>\n" +
    "                </a>\n" +
    "            </li>\n" +
    "            <li class=\"divider\"></li>\n" +
    "            <li>\n" +
    "                <a href=\"#\">\n" +
    "                    <div>\n" +
    "                        <i class=\"fa fa-twitter fa-fw\"></i> 3 New Followers\n" +
    "                        <span class=\"pull-right text-muted small\">12 minutes ago</span>\n" +
    "                    </div>\n" +
    "                </a>\n" +
    "            </li>\n" +
    "            <li class=\"divider\"></li>\n" +
    "            <li>\n" +
    "                <a href=\"#\">\n" +
    "                    <div>\n" +
    "                        <i class=\"fa fa-envelope fa-fw\"></i> Message Sent\n" +
    "                        <span class=\"pull-right text-muted small\">4 minutes ago</span>\n" +
    "                    </div>\n" +
    "                </a>\n" +
    "            </li>\n" +
    "            <li class=\"divider\"></li>\n" +
    "            <li>\n" +
    "                <a href=\"#\">\n" +
    "                    <div>\n" +
    "                        <i class=\"fa fa-tasks fa-fw\"></i> New Task\n" +
    "                        <span class=\"pull-right text-muted small\">4 minutes ago</span>\n" +
    "                    </div>\n" +
    "                </a>\n" +
    "            </li>\n" +
    "            <li class=\"divider\"></li>\n" +
    "            <li>\n" +
    "                <a href=\"#\">\n" +
    "                    <div>\n" +
    "                        <i class=\"fa fa-upload fa-fw\"></i> Server Rebooted\n" +
    "                        <span class=\"pull-right text-muted small\">4 minutes ago</span>\n" +
    "                    </div>\n" +
    "                </a>\n" +
    "            </li>\n" +
    "            <li class=\"divider\"></li>\n" +
    "            <li>\n" +
    "                <a class=\"text-center\" href=\"#\">\n" +
    "                    <strong>See All Alerts</strong>\n" +
    "                    <i class=\"fa fa-angle-right\"></i>\n" +
    "                </a>\n" +
    "            </li>\n" +
    "        </ul>\n" +
    "        <!-- /.dropdown-alerts -->\n" +
    "    </li>\n" +
    "    <!-- /.dropdown -->\n" +
    "    <li class=\"dropdown\">\n" +
    "        <a class=\"dropdown-toggle\" data-toggle=\"dropdown\">\n" +
    "            <i class=\"fa fa-user fa-fw\"></i>  <i class=\"fa fa-caret-down\"></i>\n" +
    "        </a>\n" +
    "        <ul class=\"dropdown-menu dropdown-user\">\n" +
    "            <li><a href=\"#\"><i class=\"fa fa-user fa-fw\"></i> Profil</a>\n" +
    "            </li>\n" +
    "            <li><a href=\"#\"><i class=\"fa fa-gear fa-fw\"></i> Ayarlar</a>\n" +
    "            </li>\n" +
    "            <li class=\"divider\"></li>\n" +
    "            <li><a ui-sref=\"login\" href=\"javascript:void(0);\" logout><i class=\"fa fa-sign-out fa-fw\"></i> Çıkış</a>\n" +
    "            </li>\n" +
    "        </ul>\n" +
    "        <!-- /.dropdown-user -->\n" +
    "    </li>\n" +
    "    <!-- /.dropdown -->\n" +
    "</ul>\n" +
    "\n" +
    "");
}]);

angular.module("shared/templates/directives/header-sub-menu.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("shared/templates/directives/header-sub-menu.html",
    "<div class=\"manager-view-header container-fluid\">\n" +
    "    <header-breadcrumb></header-breadcrumb>\n" +
    "    <div id=\"header-buttons\">\n" +
    "        <button type=\"button\" class=\"btn btn-primary\" ng-click=\"triggerSubmit()\">Kaydet</button>\n" +
    "        <!--<button type=\"button\" class=\"btn btn-warning\">Düzenle</button>-->\n" +
    "        <!--<button type=\"button\" class=\"btn btn-danger\">İptal</button>-->\n" +
    "    </div>\n" +
    "</div>");
}]);

angular.module("shared/templates/directives/notifications.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("shared/templates/directives/notifications.html",
    "<div class=\"panel-body\">\n" +
    "    <div class=\"list-group\">\n" +
    "        <a href=\"#\" class=\"list-group-item\">\n" +
    "            <i class=\"fa fa-comment fa-fw\"></i> New Comment\n" +
    "            <span class=\"pull-right text-muted small\"><em>4 minutes ago</em>\n" +
    "            </span>\n" +
    "        </a>\n" +
    "        <a href=\"#\" class=\"list-group-item\">\n" +
    "            <i class=\"fa fa-twitter fa-fw\"></i> 3 New Followers\n" +
    "            <span class=\"pull-right text-muted small\"><em>12 minutes ago</em>\n" +
    "            </span>\n" +
    "        </a>\n" +
    "        <a href=\"#\" class=\"list-group-item\">\n" +
    "            <i class=\"fa fa-envelope fa-fw\"></i> Message Sent\n" +
    "            <span class=\"pull-right text-muted small\"><em>27 minutes ago</em>\n" +
    "            </span>\n" +
    "        </a>\n" +
    "        <a href=\"#\" class=\"list-group-item\">\n" +
    "            <i class=\"fa fa-tasks fa-fw\"></i> New Task\n" +
    "            <span class=\"pull-right text-muted small\"><em>43 minutes ago</em>\n" +
    "            </span>\n" +
    "        </a>\n" +
    "        <a href=\"#\" class=\"list-group-item\">\n" +
    "            <i class=\"fa fa-upload fa-fw\"></i> Server Rebooted\n" +
    "            <span class=\"pull-right text-muted small\"><em>11:32 AM</em>\n" +
    "            </span>\n" +
    "        </a>\n" +
    "        <a href=\"#\" class=\"list-group-item\">\n" +
    "            <i class=\"fa fa-bolt fa-fw\"></i> Server Crashed!\n" +
    "            <span class=\"pull-right text-muted small\"><em>11:13 AM</em>\n" +
    "            </span>\n" +
    "        </a>\n" +
    "        <a href=\"#\" class=\"list-group-item\">\n" +
    "            <i class=\"fa fa-warning fa-fw\"></i> Server Not Responding\n" +
    "            <span class=\"pull-right text-muted small\"><em>10:57 AM</em>\n" +
    "            </span>\n" +
    "        </a>\n" +
    "        <a href=\"#\" class=\"list-group-item\">\n" +
    "            <i class=\"fa fa-shopping-cart fa-fw\"></i> New Order Placed\n" +
    "            <span class=\"pull-right text-muted small\"><em>9:49 AM</em>\n" +
    "            </span>\n" +
    "        </a>\n" +
    "        <a href=\"#\" class=\"list-group-item\">\n" +
    "            <i class=\"fa fa-money fa-fw\"></i> Payment Received\n" +
    "            <span class=\"pull-right text-muted small\"><em>Yesterday</em>\n" +
    "            </span>\n" +
    "        </a>\n" +
    "    </div>\n" +
    "    <!-- /.list-group -->\n" +
    "    <a href=\"#\" class=\"btn btn-default btn-block\">View All Alerts</a>\n" +
    "</div>");
}]);

angular.module("shared/templates/directives/sidebar-search.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("shared/templates/directives/sidebar-search.html",
    "");
}]);

angular.module("shared/templates/directives/sidebar.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("shared/templates/directives/sidebar.html",
    "<div class=\"navbar-default sidebar\" role=\"navigation\">\n" +
    "    <div class=\"sidebar-nav navbar-collapse\">\n" +
    "    	<div class=\"brand\">\n" +
    "        	<a href=\"\" class=\"logo\"><img src=\"/img/brand-logo.png\" /></a>\n" +
    "        </div>\n" +
    "        <ul class=\"nav in sidebarscroll\" id=\"side-menu\">\n" +
    "            <!--<sidebar-search></sidebar-search>-->\n" +
    "            <li ui-sref-active=\"active\">\n" +
    "                <a href=\"#/dashboard\"><i class=\"fa fa-dashboard fa-fw\"></i> Panel</a>\n" +
    "            </li>\n" +
    "            <li ng-repeat=\"(key, item) in menuItems\" ng-class=\"{active: collapseVar == key}\">\n" +
    "                <a href=\"\" ng-click=\"check(key)\"><i class=\"fa fa-wrench fa-fw\"></i> {{ item[0] }}<span\n" +
    "                        class=\"fa arrow\"></span></a>\n" +
    "                <ul class=\"nav nav-second-level\" collapse=\"collapseVar!={{key}}\">\n" +
    "                    <li ng-repeat=\"(k, v) in item[1]\" ng-init=\"third=!third\"\n" +
    "                        ng-class=\"{active: multiCollapseVar==$index}\">\n" +
    "                        <a href=\"\" ng-click=\"multiCheck($index)\">{{v[0]}} <span class=\"fa arrow\"></span></a>\n" +
    "                        <ul class=\"nav nav-third-level\" collapse=\"multiCollapseVar!={{$index}}\">\n" +
    "                            <li>\n" +
    "                                <a href=\"#/{{v[1]}}\">Listele</a>\n" +
    "                            </li>\n" +
    "                            <li>\n" +
    "                                <a href=\"#/{{v[1]}}/add\">Ekle</a>\n" +
    "                            </li>\n" +
    "                        </ul>\n" +
    "                        <!-- /.nav-third-level -->\n" +
    "                    </li>\n" +
    "                </ul>\n" +
    "                <!-- /.nav-second-level -->\n" +
    "            </li>\n" +
    "        </ul>\n" +
    "    </div>\n" +
    "    <!-- /.sidebar-collapse -->\n" +
    "</div>\n" +
    "");
}]);

angular.module("shared/templates/directives/stats.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("shared/templates/directives/stats.html",
    "<div class=\"col-lg-3 col-md-6\">\n" +
    "    <div class=\"panel panel-{{colour}}\">\n" +
    "        <div class=\"panel-heading\">\n" +
    "            <div class=\"row\">\n" +
    "                <div class=\"col-xs-3\">\n" +
    "                    <i class=\"fa fa-{{type}} fa-5x\"></i>\n" +
    "                </div>\n" +
    "                <div class=\"col-xs-9 text-right\">\n" +
    "                    <div class=\"huge\">{{number}}</div>\n" +
    "                    <div>{{comments}}</div>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "        <a ui-sref=\"{{goto}}\">\n" +
    "            <div class=\"panel-footer\">\n" +
    "                <span class=\"pull-left\">View Details</span>\n" +
    "                <span class=\"pull-right\"><i class=\"fa fa-arrow-circle-right\"></i></span>\n" +
    "                <div class=\"clearfix\"></div>\n" +
    "            </div>\n" +
    "        </a>\n" +
    "    </div>\n" +
    "</div>");
}]);

angular.module("shared/templates/directives/timeline.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("shared/templates/directives/timeline.html",
    "<div class=\"panel-body\">\n" +
    "    <ul class=\"timeline\">\n" +
    "        <li>\n" +
    "            <div class=\"timeline-badge\"><i class=\"fa fa-check\"></i>\n" +
    "            </div>\n" +
    "            <div class=\"timeline-panel\">\n" +
    "                <div class=\"timeline-heading\">\n" +
    "                    <h4 class=\"timeline-title\">Lorem ipsum dolor</h4>\n" +
    "                    <p><small class=\"text-muted\"><i class=\"fa fa-clock-o\"></i> 11 hours ago via Twitter</small>\n" +
    "                    </p>\n" +
    "                </div>\n" +
    "                <div class=\"timeline-body\">\n" +
    "                    <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Libero laboriosam dolor perspiciatis omnis exercitationem. Beatae, officia pariatur? Est cum veniam excepturi. Maiores praesentium, porro voluptas suscipit facere rem dicta, debitis.</p>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "        </li>\n" +
    "        <li class=\"timeline-inverted\">\n" +
    "            <div class=\"timeline-badge warning\"><i class=\"fa fa-credit-card\"></i>\n" +
    "            </div>\n" +
    "            <div class=\"timeline-panel\">\n" +
    "                <div class=\"timeline-heading\">\n" +
    "                    <h4 class=\"timeline-title\">Lorem ipsum dolor</h4>\n" +
    "                </div>\n" +
    "                <div class=\"timeline-body\">\n" +
    "                    <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Autem dolorem quibusdam, tenetur commodi provident cumque magni voluptatem libero, quis rerum. Fugiat esse debitis optio, tempore. Animi officiis alias, officia repellendus.</p>\n" +
    "                    <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Laudantium maiores odit qui est tempora eos, nostrum provident explicabo dignissimos debitis vel! Adipisci eius voluptates, ad aut recusandae minus eaque facere.</p>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "        </li>\n" +
    "        <li>\n" +
    "            <div class=\"timeline-badge danger\"><i class=\"fa fa-bomb\"></i>\n" +
    "            </div>\n" +
    "            <div class=\"timeline-panel\">\n" +
    "                <div class=\"timeline-heading\">\n" +
    "                    <h4 class=\"timeline-title\">Lorem ipsum dolor</h4>\n" +
    "                </div>\n" +
    "                <div class=\"timeline-body\">\n" +
    "                    <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Repellendus numquam facilis enim eaque, tenetur nam id qui vel velit similique nihil iure molestias aliquam, voluptatem totam quaerat, magni commodi quisquam.</p>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "        </li>\n" +
    "        <li class=\"timeline-inverted\">\n" +
    "            <div class=\"timeline-panel\">\n" +
    "                <div class=\"timeline-heading\">\n" +
    "                    <h4 class=\"timeline-title\">Lorem ipsum dolor</h4>\n" +
    "                </div>\n" +
    "                <div class=\"timeline-body\">\n" +
    "                    <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Voluptates est quaerat asperiores sapiente, eligendi, nihil. Itaque quos, alias sapiente rerum quas odit! Aperiam officiis quidem delectus libero, omnis ut debitis!</p>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "        </li>\n" +
    "        <li>\n" +
    "            <div class=\"timeline-badge info\"><i class=\"fa fa-save\"></i>\n" +
    "            </div>\n" +
    "            <div class=\"timeline-panel\">\n" +
    "                <div class=\"timeline-heading\">\n" +
    "                    <h4 class=\"timeline-title\">Lorem ipsum dolor</h4>\n" +
    "                </div>\n" +
    "                <div class=\"timeline-body\">\n" +
    "                    <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Nobis minus modi quam ipsum alias at est molestiae excepturi delectus nesciunt, quibusdam debitis amet, beatae consequuntur impedit nulla qui! Laborum, atque.</p>\n" +
    "                    <hr>\n" +
    "                    <div class=\"btn-group\">\n" +
    "                        <button type=\"button\" class=\"btn btn-primary btn-sm dropdown-toggle\" data-toggle=\"dropdown\">\n" +
    "                            <i class=\"fa fa-gear\"></i>  <span class=\"caret\"></span>\n" +
    "                        </button>\n" +
    "                        <ul class=\"dropdown-menu\" role=\"menu\">\n" +
    "                            <li><a href=\"#\">Action</a>\n" +
    "                            </li>\n" +
    "                            <li><a href=\"#\">Another action</a>\n" +
    "                            </li>\n" +
    "                            <li><a href=\"#\">Something else here</a>\n" +
    "                            </li>\n" +
    "                            <li class=\"divider\"></li>\n" +
    "                            <li><a href=\"#\">Separated link</a>\n" +
    "                            </li>\n" +
    "                        </ul>\n" +
    "                    </div>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "        </li>\n" +
    "        <li>\n" +
    "            <div class=\"timeline-panel\">\n" +
    "                <div class=\"timeline-heading\">\n" +
    "                    <h4 class=\"timeline-title\">Lorem ipsum dolor</h4>\n" +
    "                </div>\n" +
    "                <div class=\"timeline-body\">\n" +
    "                    <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Sequi fuga odio quibusdam. Iure expedita, incidunt unde quis nam! Quod, quisquam. Officia quam qui adipisci quas consequuntur nostrum sequi. Consequuntur, commodi.</p>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "        </li>\n" +
    "        <li class=\"timeline-inverted\">\n" +
    "            <div class=\"timeline-badge success\"><i class=\"fa fa-graduation-cap\"></i>\n" +
    "            </div>\n" +
    "            <div class=\"timeline-panel\">\n" +
    "                <div class=\"timeline-heading\">\n" +
    "                    <h4 class=\"timeline-title\">Lorem ipsum dolor</h4>\n" +
    "                </div>\n" +
    "                <div class=\"timeline-body\">\n" +
    "                    <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Deserunt obcaecati, quaerat tempore officia voluptas debitis consectetur culpa amet, accusamus dolorum fugiat, animi dicta aperiam, enim incidunt quisquam maxime neque eaque.</p>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "        </li>\n" +
    "    </ul>\n" +
    "</div>");
}]);

angular.module("shared/templates/fieldset.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("shared/templates/fieldset.html",
    "<fieldset ng-disabled=\"form.readonly\" class=\"schema-form-fieldset {{form.htmlClass}}\">\n" +
    "    <legend ng-class=\"{'sr-only': !showTitle() }\">\n" +
    "        <span ng-click=\"isCollapsed = !isCollapsed\">{{ form.title }}</span>\n" +
    "    </legend>\n" +
    "    <div collapse=\"isCollapsed\" name=\"{{form.title}}\">\n" +
    "        <div class=\"help-block\" ng-show=\"form.description\" ng-bind-html=\"form.description\"></div>\n" +
    "        <sf-decorator class=\"col-md-4\" ng-repeat=\"item in form.items\" ng-if=\"item.name!='idx'\" form=\"item\"></sf-decorator>\n" +
    "    </div>\n" +
    "</fieldset>\n" +
    "");
}]);

angular.module("shared/templates/foreignKey.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("shared/templates/foreignKey.html",
    "<div class=\"form-group {{form.htmlClass}} schema-form-select col-md-12\"\n" +
    "     ng-class=\"{'has-error': form.disableErrorState !== true && hasError(), 'has-success': form.disableSuccessState !== true && hasSuccess(), 'has-feedback': form.feedback !== false}\">\n" +
    "    <div class=\"col-md-8\">\n" +
    "        <label class=\"control-label {{form.labelHtmlClass}}\" ng-show=\"showTitle()\">\n" +
    "            {{form.title}}\n" +
    "        </label>\n" +
    "\n" +
    "        <select ng-model=\"$$value$$\"\n" +
    "                value=\"$$value$$\"\n" +
    "                ng-model-options=\"form.ngModelOptions\"\n" +
    "                ng-disabled=\"form.readonly\"\n" +
    "                sf-changed=\"form\"\n" +
    "                class=\"form-control {{form.fieldHtmlClass}}\"\n" +
    "                schema-validate=\"form\"\n" +
    "                ng-options=\"item.value as item.name for item in form.titleMap\"\n" +
    "                name=\"{{form.key.slice(-1)[0]}}\">\n" +
    "        </select>\n" +
    "\n" +
    "        <div class=\"help-block\" sf-message=\"form.description\"></div>\n" +
    "    </div>\n" +
    "    <div class=\"col-md-4\">\n" +
    "        <a href=\"javascript:void(0);\" add-modal-for-linked-model>\n" +
    "            <i class=\"fa fa-plus-circle fa-fw\"></i>\n" +
    "        </a>\n" +
    "    </div>\n" +
    "</div>");
}]);

angular.module("shared/templates/linkedModelModalContent.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("shared/templates/linkedModelModalContent.html",
    "<div class=\"modal-body\">\n" +
    "    <h3>{{schema.title}}</h3>\n" +
    "    <form name=\"linkedModelForm\" sf-schema=\"schema\" sf-form=\"form\" sf-model=\"model\"></form>\n" +
    "</div>\n" +
    "<div class=\"modal-footer\">\n" +
    "    <button type=\"submit\" class=\"btn btn-primary\" ng-click=\"onSubmit(linkedModelForm)\">OK</button>\n" +
    "    <button type=\"button\" class=\"btn btn-warning\" ng-click=\"cancel()\">Cancel</button>\n" +
    "</div>");
}]);

angular.module("shared/templates/listnodeModalContent.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("shared/templates/listnodeModalContent.html",
    "<div class=\"modal-body\">\n" +
    "    <h3>{{schema.title}}</h3>\n" +
    "    <form name=\"listnodeform\" sf-schema=\"schema\" sf-form=\"form\" sf-model=\"model\"></form>\n" +
    "</div>\n" +
    "<div class=\"modal-footer\">\n" +
    "    <button type=\"submit\" class=\"btn btn-primary\" ng-click=\"onSubmit(listnodeform)\">OK</button>\n" +
    "    <button type=\"button\" class=\"btn btn-warning\" ng-click=\"cancel()\">Cancel</button>\n" +
    "</div>");
}]);

angular.module("shared/templates/modalContent.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("shared/templates/modalContent.html",
    "");
}]);

angular.module("shared/templates/nodeTable.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("shared/templates/nodeTable.html",
    "<div class=\"tablescroll\">\n" +
    "<table class=\"table table-bordered\" style=\"background-color:#fff;\">\n" +
    "    <thead>\n" +
    "    <tr>\n" +
    "        <th colspan=\"2\">\n" +
    "            <label>\n" +
    "                <input type=\"checkbox\" style=\"zoom:1.5; margin:5px 0 0 8px;\">\n" +
    "                Hepsini Seç\n" +
    "            </label>\n" +
    "        </th>\n" +
    "        <th ng-repeat=\"(key,value) in node.form\">{{ value }}</th>\n" +
    "        <th>action</th>\n" +
    "    </tr>\n" +
    "    </thead>\n" +
    "    <tbody ng-class=\"{true: '', false: 'hidden'}[node.lengthModels > 0]\">\n" +
    "    <tr>\n" +
    "        <td width=\"60\">\n" +
    "            <label>\n" +
    "                <input type=\"checkbox\" style=\"zoom:1.5; margin:5px 0 0 8px;\">\n" +
    "            </label>\n" +
    "        </td>\n" +
    "        <th scope=\"row\" style=\"text-align:center\">1</th>\n" +
    "        <td ng-repeat=\"value in node.model\">{{ value }}</td>\n" +
    "        <td>\n" +
    "            <button modal-for-nodes=\"{{node.title}},ListNode\">Edit</button><br>\n" +
    "            <button>Show</button>\n" +
    "            <button>Delete</button>\n" +
    "        </td>\n" +
    "    </tr>\n" +
    "    </tbody>\n" +
    "</table>\n" +
    "</div>");
}]);
