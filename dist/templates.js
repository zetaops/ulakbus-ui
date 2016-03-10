angular.module('templates-prod', ['components/auth/login.html', 'components/crud/templates/crud.html', 'components/crud/templates/filter.html', 'components/crud/templates/form.html', 'components/crud/templates/list.html', 'components/crud/templates/nodeTable.html', 'components/crud/templates/show.html', 'components/dashboard/dashboard.html', 'components/dashboard/user-info.html', 'components/dashboard/user-templates/staff.html', 'components/dashboard/user-templates/student.html', 'components/debug/debug.html', 'components/devSettings/devSettings.html', 'components/error_pages/404.html', 'components/error_pages/500.html', 'components/uitemplates/404.html', 'components/uitemplates/500.html', 'shared/templates/actionsModalContent.html', 'shared/templates/add.html', 'shared/templates/datefield.html', 'shared/templates/directives/alert.html', 'shared/templates/directives/chat.html', 'shared/templates/directives/guide-help.html', 'shared/templates/directives/header-breadcrumb.html', 'shared/templates/directives/header-notification.html', 'shared/templates/directives/header-sub-menu.html', 'shared/templates/directives/menuCollapse.html', 'shared/templates/directives/msgbox.html', 'shared/templates/directives/notifications.html', 'shared/templates/directives/right-sidebar.html', 'shared/templates/directives/search.html', 'shared/templates/directives/selected-user.html', 'shared/templates/directives/selectedUserPopover.html', 'shared/templates/directives/sidebar-notification.html', 'shared/templates/directives/sidebar-search.html', 'shared/templates/directives/sidebar.html', 'shared/templates/directives/sort.html', 'shared/templates/directives/stats.html', 'shared/templates/directives/timeline.html', 'shared/templates/fieldset.html', 'shared/templates/filefield.html', 'shared/templates/foreignKey.html', 'shared/templates/linkedModelModalContent.html', 'shared/templates/listnodeModalContent.html', 'shared/templates/modalContent.html', 'shared/templates/multiselect.html', 'shared/templates/select.html', 'shared/templates/translate.html', 'shared/templates/typeahead.html']);

angular.module("components/auth/login.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("components/auth/login.html",
    "<div style=\"width: 100%; height: 100%; position: fixed; z-index: 1100; top:0; left:0; background: #fff;\">\n" +
    "    <div ng-app=\"ulakbus.auth\" class=\"container\">\n" +
    "        <div class=\"row\">\n" +
    "            <div class=\"col-md-6 col-md-offset-3\">\n" +
    "                <div class=\"login-panel panel panel-default\">\n" +
    "                    <div class=\"panel-heading\">\n" +
    "                        <h3 class=\"panel-title\">Giriş Yap <span ng-if=\"loggingIn\" class=\"loader pull-right\"></span></h3>\n" +
    "                    </div>\n" +
    "                    <div class=\"panel-body\">\n" +
    "                        <form name=\"loginForm\" sf-schema=\"schema\" sf-form=\"form\" sf-model=\"model\"\n" +
    "                              ng-submit=\"onSubmit(loginForm)\"></form>\n" +
    "                    </div>\n" +
    "                </div>\n" +
    "                <span class=\"label label-inverse label-warning\">{{message}}</span>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "</div>");
}]);

angular.module("components/crud/templates/crud.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("components/crud/templates/crud.html",
    "<div class=\"container-fluid\">\n" +
    "    <div ng-class=\"{'col-md-8': meta.allow_filters}\">\n" +
    "        <msgbox ng-show=\"msgbox\"></msgbox>\n" +
    "        <h3 ng-class=\"{'mid-h3': !objects}\">{{ schema.title }}</h3>\n" +
    "        <crud-show-directive ng-if=\"object\"></crud-show-directive>\n" +
    "        <crud-form-directive ng-if=\"forms\"></crud-form-directive>\n" +
    "        <crud-list-directive ng-if=\"objects\"></crud-list-directive>\n" +
    "    </div>\n" +
    "    <crud-filters ng-show=\"meta.allow_filters === true\" class=\"col-md-4 filtre\"></crud-filters>\n" +
    "</div>");
}]);

angular.module("components/crud/templates/filter.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("components/crud/templates/filter.html",
    "<div>\n" +
    "	<div class=\"filter-inner\">\n" +
    "        <h4>Filtrele</h4>\n" +
    "        <hr>\n" +
    "    \n" +
    "        <div ng-repeat=\"filter in list_filters\">\n" +
    "            <div>\n" +
    "                <div class=\" clearfix\">\n" +
    "                    <h5 ng-click=\"collapseFilter(filter.field)\">{{filter.verbose_name}}\n" +
    "                        <i class=\"fa fa-fw fa-caret-down\"></i></h5>\n" +
    "                </div>\n" +
    "    \n" +
    "                <div ng-if=\"filter.type==='check' || !filter.type\" uib-collapse=\"filterCollapsed[filter.field]\">\n" +
    "                    <div class=\"checkbox\" ng-repeat=\"filterItem in filter.values\">\n" +
    "                        <label class=\"checkbox-inline\">\n" +
    "                            <input type=\"checkbox\" name=\"filter_group[]\"\n" +
    "                                   ng-model=\"filterList[filter.field].model[filterItem.value]\"\n" +
    "                                   value=\"{{filterItem.value || filterItem[0]}}\"\n" +
    "                                   ng-checked=\"filterItem.selected\"/>\n" +
    "                            {{filterItem.name || filterItem[1]}}\n" +
    "                        </label>\n" +
    "                    </div>\n" +
    "                </div>\n" +
    "    \n" +
    "                <div ng-if=\"filter.type==='select'\"  uib-collapse=\"filterCollapsed[filter.field]\">\n" +
    "                    <div class=\"col-md-12\">\n" +
    "                        <select name=\"filterSelect\" id=\"filterSelect\" class=\"form-control\" multiple>\n" +
    "                            <option ng-repeat=\"filterItem in filter.values\"\n" +
    "                                    value=\"{{filterItem.value}}\"\n" +
    "                                    ng-selected=\"filterItem.selected\">\n" +
    "                                {{filterItem.name}}\n" +
    "                            </option>\n" +
    "                        </select>\n" +
    "                    </div>\n" +
    "                </div>\n" +
    "    \n" +
    "                <div ng-if=\"filter.type==='date'\"  uib-collapse=\"filterCollapsed[filter.field]\">\n" +
    "                    <div class=\"col-md-12\">\n" +
    "                        <label class=\"control-label\" for=\"startDate\">Başlangıç</label>\n" +
    "    \n" +
    "                        <p class=\"input-group\">\n" +
    "                            <span class=\"input-group-btn\">\n" +
    "                                <button type=\"button\" class=\"btn btn-default\" ng-click=\"dateFilterOpen($event, 'startOpened')\">\n" +
    "                                    <i class=\"fa fa-calendar\"></i>\n" +
    "                                </button>\n" +
    "                            </span>\n" +
    "                            <input type=\"text\" name=\"startDate\" class=\"form-control\"\n" +
    "                                   ng-model=\"filterList[filter.field].model[0]\"\n" +
    "                                   uib-datepicker-popup=\"{{format}}\"\n" +
    "                                   is-open=\"status.startOpened\"\n" +
    "                                   close-text=\"Kapat\"\n" +
    "                                   current-text=\"Bugün\"\n" +
    "                                   clear-text=\"Temizle\"\n" +
    "                                   ng-click=\"dateFilterOpen($event, 'startOpened')\"/></p>\n" +
    "                    </div>\n" +
    "                    <div class=\"col-md-12\">\n" +
    "                        <label class=\"control-label\" for=\"endDate\">Bitiş</label>\n" +
    "    \n" +
    "                        <p class=\"input-group\">\n" +
    "                            <span class=\"input-group-btn\">\n" +
    "                                <button type=\"button\" class=\"btn btn-default\" ng-click=\"dateFilterOpen($event, 'endOpened')\">\n" +
    "                                    <i class=\"fa fa-calendar\"></i>\n" +
    "                                </button>\n" +
    "                            </span>\n" +
    "                            <input type=\"text\" name=\"endDate\" class=\"form-control\"\n" +
    "                                   ng-model=\"filterList[filter.field].model[1]\"\n" +
    "                                   uib-datepicker-popup=\"{{format}}\"\n" +
    "                                   is-open=\"status.endOpened\"\n" +
    "                                   close-text=\"Kapat\"\n" +
    "                                   current-text=\"Bugün\"\n" +
    "                                   clear-text=\"Temizle\"\n" +
    "                                   ng-click=\"dateFilterOpen($event, 'endOpened')\"/></p>\n" +
    "                    </div>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "    \n" +
    "        <div class=\"clearfix\"></div>\n" +
    "    \n" +
    "        <div style=\"margin-top: 40px;\">\n" +
    "            <button type=\"button\" class=\"btn btn-warning\" ng-click=\"filterSubmit()\">Filtrele</button>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "</div>");
}]);

angular.module("components/crud/templates/form.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("components/crud/templates/form.html",
    "<div class=\"clearfix\" ng-class=\"{'form-container': !objects}\">\n" +
    "    <div class=\"buttons-on-top\"></div>\n" +
    "\n" +
    "    <form id=\"formgenerated\" name=\"formgenerated\" sf-schema=\"schema\" sf-form=\"form\" sf-model=\"model\"\n" +
    "          ng-submit=\"onSubmit(formgenerated)\" form-locator></form>\n" +
    "\n" +
    "    <div ng-repeat=\"node in Node\">\n" +
    "        <h3>{{ node.title }}\n" +
    "        <span ng-if=\"node.lengthModels < 1\">\n" +
    "            <a modal-for-nodes=\"{{node.schema.model_name}},Node\">\n" +
    "                <i class=\"fa fa-plus-circle fa-fw\"></i>\n" +
    "            </a>\n" +
    "        </span>\n" +
    "        </h3>\n" +
    "\n" +
    "        <div class=\"node-table\">\n" +
    "            <ng-include src=\"'components/crud/templates/nodeTable.html'\"></ng-include>\n" +
    "        </div>\n" +
    "        <hr>\n" +
    "    </div>\n" +
    "    <div ng-repeat=\"node in ListNode\">\n" +
    "        <h3>{{ node.title }}\n" +
    "        <span>\n" +
    "            <a modal-for-nodes=\"{{node.schema.model_name}},ListNode,add\">\n" +
    "                <i class=\"fa fa-plus-circle fa-fw\"></i>\n" +
    "            </a>\n" +
    "        </span>\n" +
    "        </h3>\n" +
    "\n" +
    "        <div class=\"list-node-table\" ng-if=\"!meta.translate_widget\">\n" +
    "            <ng-include src=\"'components/crud/templates/nodeTable.html'\"></ng-include>\n" +
    "        </div>\n" +
    "        <div class=\"list-node-table\" ng-if=\"meta.translate_widget\">\n" +
    "            <ng-include src=\"'shared/templates/translate.html'\"></ng-include>\n" +
    "        </div>\n" +
    "        <hr>\n" +
    "    </div>\n" +
    "\n" +
    "    <div class=\"buttons-on-bottom\"></div>\n" +
    "\n" +
    "</div>");
}]);

angular.module("components/crud/templates/list.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("components/crud/templates/list.html",
    "<div class=\"starter-template\">\n" +
    "    <sort-directive ng-if=\"meta['allow_sort']===true\"></sort-directive>\n" +
    "    <search-directive ng-if=\"meta['allow_search']===true\"></search-directive>\n" +
    "    <div class=\"clearfix\"></div>\n" +
    "    <!--<h1>{{form_params.model || form_params.wf}}</h1>-->\n" +
    "    <div class=\"row\" ng-if=\"!objects[1]\">\n" +
    "        <div class=\"col-md-12\">\n" +
    "            <p class=\"no-content\">Listelenecek içerik yok.</p>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "    <div class=\"tablescroll\" ng-if=\"objects[1]\">\n" +
    "        <table class=\"table table-bordered\" style=\"background-color:#fff;\">\n" +
    "            <thead>\n" +
    "            <tr>\n" +
    "                <td ng-if=\"meta.allow_selection === true\">\n" +
    "                    <label>\n" +
    "                        <input type=\"checkbox\" style=\"zoom:1.5; margin:5px 0 0 8px;\">\n" +
    "                        Hepsini Seç\n" +
    "                    </label>\n" +
    "                </td>\n" +
    "                <td ng-repeat=\"value in objects[0] track by $index\" ng-if=\"objects[0]!='-1'\">{{value}}</td>\n" +
    "                <td ng-if=\"objects[0]=='-1'\">{{ schema.title||model}}</td>\n" +
    "                <td>İşlem</td>\n" +
    "            </tr>\n" +
    "            </thead>\n" +
    "            <tbody>\n" +
    "            <tr ng-repeat=\"object in objects\" ng-if=\"$index>0\">\n" +
    "                <td width=\"60\" ng-if=\"meta.allow_selection === true\">\n" +
    "                    <label>\n" +
    "                        <input type=\"checkbox\" style=\"zoom:1.5; margin:5px 0 0 8px;\">\n" +
    "                    </label>\n" +
    "                </td>\n" +
    "                <!--<td scope=\"row\" style=\"text-align:center\">{{$index}}</td>-->\n" +
    "\n" +
    "                <td ng-repeat=\"field in object.fields track by $index\">\n" +
    "                    <a role=\"button\" ng-if=\"field.type==='link'\"\n" +
    "                       ng-click=\"do_action(object.key, field)\" ng-bind-html=\"field.content | markdown\"></a>\n" +
    "                    <span ng-if=\"field.type==='str'\" ng-bind-html=\"field.content | markdown\"></span>\n" +
    "                </td>\n" +
    "\n" +
    "                <td>\n" +
    "                    <button class=\"btn btn-info\" style=\"margin-right: 5px;\" ng-repeat=\"action in object.actions track by $index\"\n" +
    "                            ng-if=\"action.show_as==='button'\"\n" +
    "                            ng-click=\"do_action(object.key, action)\">{{action\n" +
    "                        .name}}\n" +
    "                    </button>\n" +
    "                    <br>\n" +
    "                </td>\n" +
    "            </tr>\n" +
    "            </tbody>\n" +
    "        </table>\n" +
    "    </div>\n" +
    "    <br/>\n" +
    "\n" +
    "    <nav ng-if=\"pagination && pagination.total_pages > 1\" class=\"text-center\">\n" +
    "        <ul class=\"pagination\">\n" +
    "            <li ng-class=\"{disabled:pagination.page===1}\">\n" +
    "                <a role=\"button\" aria-label=\"Önceki\" ng-click=\"paginate({page:pagination.page-1})\">\n" +
    "                    <span aria-hidden=\"true\">&laquo;</span>\n" +
    "                </a>\n" +
    "            </li>\n" +
    "            <li ng-repeat=\"page in getNumber(pagination.total_pages) track by $index\"\n" +
    "                ng-class=\"{active:$index+1===pagination.page}\">\n" +
    "                <a role=\"button\" ng-click=\"paginate({page:$index+1})\">{{$index+1}}</a>\n" +
    "            </li>\n" +
    "            <li ng-class=\"{disabled:pagination.page===pagination.total_pages}\">\n" +
    "                <a role=\"button\" aria-label=\"Sonraki\" ng-click=\"paginate({page:pagination.page+1})\">\n" +
    "                    <span aria-hidden=\"true\">&raquo;</span>\n" +
    "                </a>\n" +
    "            </li>\n" +
    "        </ul>\n" +
    "    </nav>\n" +
    "\n" +
    "</div>");
}]);

angular.module("components/crud/templates/nodeTable.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("components/crud/templates/nodeTable.html",
    "<div class=\"tablescroll\">\n" +
    "    <table class=\"table table-bordered\" style=\"background-color:#fff;\">\n" +
    "        <thead>\n" +
    "        <tr ng-if=\"node.schema.formType=='Node'\">\n" +
    "            <!--<th colspan=\"2\">-->\n" +
    "            <!--<label>-->\n" +
    "            <!--<input type=\"checkbox\" style=\"zoom:1.5; margin:5px 0 0 8px;\">-->\n" +
    "            <!--Hepsini Seç-->\n" +
    "            <!--</label>-->\n" +
    "            <!--</th>-->\n" +
    "            <th ng-repeat=\"(key,value) in node.model track by $index\">{{ key }}</th>\n" +
    "            <th>İşlem</th>\n" +
    "        </tr>\n" +
    "        <tr ng-if=\"node.schema.formType=='ListNode'\">\n" +
    "            <th colspan=\"2\" ng-if=\"meta.allow_selection===true\">\n" +
    "                <label>\n" +
    "                    <input type=\"checkbox\" style=\"zoom:1.5; margin:5px 0 0 8px;\">\n" +
    "                    Hepsini Seç\n" +
    "                </label>\n" +
    "            </th>\n" +
    "            <th ng-repeat=\"(key,value) in node.items[0] track by $index\"\n" +
    "                ng-if=\"key!=='idx' && node.schema.properties[key]\">\n" +
    "                <span ng-if=\"value.verbose_name\">{{ value.verbose_name }}</span>\n" +
    "                <span ng-if=\"!value.verbose_name\">{{key}}</span>\n" +
    "            </th>\n" +
    "            <th ng-if=\"meta.allow_actions!==false\">İşlem</th>\n" +
    "        </tr>\n" +
    "        </thead>\n" +
    "        <tbody ng-class=\"{hidden: node.lengthModels < 1}\">\n" +
    "\n" +
    "        <tr ng-if=\"node.schema.formType=='Node'\">\n" +
    "            <!--<td width=\"60\">-->\n" +
    "            <!--<label>-->\n" +
    "            <!--<input type=\"checkbox\" style=\"zoom:1.5; margin:5px 0 0 8px;\">-->\n" +
    "            <!--</label>-->\n" +
    "            <!--</td>-->\n" +
    "            <!--<th scope=\"row\" style=\"text-align:center\">1</th>-->\n" +
    "            <td ng-repeat=\"value in node.model track by $index\">{{ value }}</td>\n" +
    "            <td>\n" +
    "                <button modal-for-nodes=\"{{node.schema.model_name}},{{node.schema.formType}},edit\">Düzenle</button>\n" +
    "                <br>\n" +
    "                <button ng-click=\"remove(node, 'Node', $index)\">Sil</button>\n" +
    "            </td>\n" +
    "        </tr>\n" +
    "\n" +
    "        <tr ng-repeat=\"listnodemodel in node.items track by $index\"\n" +
    "            ng-init=\"outerIndex=$index\"\n" +
    "            ng-if=\"node.schema.formType=='ListNode'\">\n" +
    "            <td ng-if=\"meta.allow_selection===true\" width=\"60\">\n" +
    "                <label>\n" +
    "                    <input type=\"checkbox\" style=\"zoom:1.5; margin:5px 0 0 8px;\">\n" +
    "                </label>\n" +
    "            </td>\n" +
    "            <th scope=\"row\" style=\"text-align:center\">{{$index+1}}</th>\n" +
    "            <td ng-repeat=\"(k, v) in listnodemodel track by $index\"\n" +
    "                ng-init=\"innerIndex=$index\"\n" +
    "                ng-if=\"k!=='idx' && node.schema.properties[k]\">\n" +
    "                <span ng-if=\"!node.schema.inline_edit || node.schema.inline_edit.indexOf(k) < 0\">{{ v.unicode || v }}</span>\n" +
    "                <input type=\"{{node.schema.properties[k].type}}\"\n" +
    "                       ng-if=\"node.schema.inline_edit.indexOf(k) > -1\"\n" +
    "                       ng-model=\"node.model[outerIndex][k]\"\n" +
    "                       ng-change=\"nodeModelChange(this)\">\n" +
    "            </td>\n" +
    "            <td ng-if=\"meta.allow_actions!==false\">\n" +
    "                <div ng-hide=\"meta.object_actions.length > 0\">\n" +
    "                    <span modal-for-nodes=\"{{node.schema.model_name}},{{node.schema.formType}},edit,{{$index}}\">\n" +
    "                        <i class=\"fa fa-pencil-square-o fa-fw\"></i>\n" +
    "                    </span>\n" +
    "                    <span ng-click=\"remove(node, 'ListNode', $index)\"><i class=\"fa fa-times fa-fw\"></i></span>\n" +
    "                </div>\n" +
    "                <div ng-show=\"meta.object_actions.length > 0\">\n" +
    "                    <!-- define object actions here -->\n" +
    "                </div>\n" +
    "            </td>\n" +
    "        </tr>\n" +
    "\n" +
    "        </tbody>\n" +
    "    </table>\n" +
    "</div>");
}]);

angular.module("components/crud/templates/show.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("components/crud/templates/show.html",
    "<div class=\"starter-template\">\n" +
    "    <div ng-repeat=\"obj in object\" class=\"detail-page\">\n" +
    "        <div class=\"info-block-header\">\n" +
    "            <h3>{{obj.title}}</h3>\n" +
    "        </div>\n" +
    "        <div class=\"table-responsive\">\n" +
    "            <table class=\"table\">\n" +
    "                <thead ng-if=\"obj.type==='table-multiRow'\">\n" +
    "                    <tr>\n" +
    "                        <td ng-repeat=\"(key, value) in obj.fields[0]\">{{key}}</td>\n" +
    "                    </tr>\n" +
    "                </thead>\n" +
    "                <tbody ng-if=\"obj.type==='table-multiRow'\">\n" +
    "                    <tr ng-repeat=\"row in obj.fields\">\n" +
    "                        <td ng-repeat=\"(k,v) in row track by $index\">{{v}}</td>\n" +
    "                    </tr>\n" +
    "                </tbody>\n" +
    "                <tbody ng-if=\"obj.type==='table'\">\n" +
    "                    <tr ng-repeat=\"(key, value) in obj.fields\">\n" +
    "                        <td class=\"col-md-2\">{{key}}</td>\n" +
    "                        <td class=\"col-md-8\">{{value}}</td>\n" +
    "                    </tr>\n" +
    "                </tbody>\n" +
    "            </table>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "</div>");
}]);

angular.module("components/dashboard/dashboard.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("components/dashboard/dashboard.html",
    "<div ng-app=\"ulakbus.dashboard\" class=\"dashboard student-dashboard\">\n" +
    "    <div class=\"starter-template\">\n" +
    "        <ng-include src=\"'components/dashboard/user-templates/student.html'\" ng-if=\"$root.current_user.is_student\"></ng-include>\n" +
    "        <ng-include src=\"'components/dashboard/user-templates/staff.html'\" ng-if=\"$root.current_user.is_staff\"></ng-include>\n" +
    "    </div>\n" +
    "</div>");
}]);

angular.module("components/dashboard/user-info.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("components/dashboard/user-info.html",
    "<div style=\"width:400px;\">\n" +
    "    <div class=\"row\">\n" +
    "        <div class=\"col-md-6\">\n" +
    "            <img src=\"img/sample-profile-pic.jpg\" alt=\"{{userPopover.name}}\" class=\"img-thumbnail\">\n" +
    "        </div>\n" +
    "    </div>\n" +
    "\n" +
    "    <div class=\"row\">\n" +
    "        <div class=\"col-md-6\">\n" +
    "            <table class=\"table table-condensed\">\n" +
    "                <tbody>\n" +
    "                <tr>\n" +
    "                    <td>Ad Soyad:</td>\n" +
    "                    <td>{{userPopover.name}}</td>\n" +
    "                </tr>\n" +
    "                <tr>\n" +
    "                    <td>TC Kimlik No:</td>\n" +
    "                    <td>{{userPopover.tcno}}</td>\n" +
    "                </tr>\n" +
    "                </tbody>\n" +
    "            </table>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "</div>");
}]);

angular.module("components/dashboard/user-templates/staff.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("components/dashboard/user-templates/staff.html",
    "<div class=\"dashboard-main-search clearfix\">\n" +
    "\n" +
    "    <div class=\"row\" ng-if=\"$root.current_user.can_search\">\n" +
    "        <div class=\"col-md-12\">\n" +
    "            <div class=\"panel panel-default\">\n" +
    "                <div class=\"panel-heading\">\n" +
    "                    <div class=\"panel-title\">Arama</div>\n" +
    "                </div>\n" +
    "                <div class=\"panel-body\">\n" +
    "                    <div class=\"dashboard-student-search\" data-step=\"2\"\n" +
    "                         data-intro=\"isim veya tcno ile öğrenci araması yapabilirsiniz.\"\n" +
    "                         ng-show=\"$root.searchInputs.ogrenci\">\n" +
    "                        <div class=\"text-center\">\n" +
    "                            <h3>ÖĞRENCİ</h3>\n" +
    "                            <input type=\"text\" placeholder=\"Öğrenci ara\" ng-model=\"keyword.student\"\n" +
    "                                   ng-keyup=\"search('ogrenci')\">\n" +
    "                            <span class=\"bordered-fa-icon fa fa-search\" ng-click=\"search('ogrenci')\"></span>\n" +
    "                        </div>\n" +
    "                        <div class=\"dashboard-search-results\" ng-show=\"showResults\">\n" +
    "                            <ul ng-if=\"students.length > 0\">\n" +
    "                                <li ng-repeat=\"student in students\">\n" +
    "                                    <a role=\"button\">\n" +
    "                                        <span ng-click=\"select(student, 'ogrenci')\">{{student[0]}}</span>\n" +
    "                                        <i class=\"fa fa-fw fa-info-circle pull-right\" popover-placement=\"bottom\"\n" +
    "                                           uib-popover-template=\"userPopover.templateUrl\"\n" +
    "                                           ng-click=\"get_info('Ogrenci', student[2])\"></i></a>\n" +
    "                                </li>\n" +
    "                            </ul>\n" +
    "                        </div>\n" +
    "                        <!-- end of dashboard-student-search-results -->\n" +
    "                    </div>\n" +
    "                    <!-- end of dashboard-student-search -->\n" +
    "                    <div class=\"dashboard-personnel-search\" data-step=\"3\"\n" +
    "                         data-intro=\"isim veya tcno ile personel araması yapabilirsiniz.\"\n" +
    "                         ng-show=\"$root.searchInputs.personel\">\n" +
    "                        <div class=\"text-center\">\n" +
    "                            <h3>PERSONEL</h3>\n" +
    "                            <input type=\"text\" placeholder=\"Personel ara\" ng-model=\"keyword.staff\"\n" +
    "                                   ng-keyup=\"search('personel')\">\n" +
    "                            <span class=\"bordered-fa-icon fa fa-search\" ng-click=\"search('personel')\"></span>\n" +
    "                        </div>\n" +
    "                        <div class=\"dashboard-search-results\" ng-show=\"showResults\">\n" +
    "                            <ul ng-if=\"staffs.length > 0\">\n" +
    "                                <li ng-repeat=\"staff in staffs\">\n" +
    "                                    <a role=\"button\">\n" +
    "                                        <span ng-click=\"select(staff, 'personel')\">{{staff[0]}}</span>\n" +
    "                                        <i class=\"fa fa-fw fa-info-circle pull-right\"\n" +
    "                                           popover-placement=\"bottom\"\n" +
    "                                           uib-popover-template=\"userPopover.templateUrl\"\n" +
    "                                           ng-click=\"get_info('Personel', staff[2])\"></i></a>\n" +
    "                                </li>\n" +
    "                            </ul>\n" +
    "                        </div>\n" +
    "                        <!-- end of dashboard-personnel-search-results -->\n" +
    "                    </div>\n" +
    "                    <!-- end of dashboard-personnel-search -->\n" +
    "                </div>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "\n" +
    "</div>\n" +
    "<!-- end of dashboard-main-search -->\n" +
    "\n" +
    "<div class=\"row\">\n" +
    "\n" +
    "    <div class=\"col-md-12 quick-links\">\n" +
    "        <div class=\"panel panel-default\">\n" +
    "            <div class=\"panel-heading\">\n" +
    "                <div class=\"panel-title\">Hızlı İşlemler</div>\n" +
    "                <div class=\"panel-action pull-right\"><i class=\"fa fa-edit fa-fw\"></i> Düzenle</div>\n" +
    "            </div>\n" +
    "            <div class=\"panel-body\">\n" +
    "                <div class=\"col-md-6 text-center link-buttons\"\n" +
    "                     ng-repeat=\"item in $root.quick_menu track by $index\">\n" +
    "                    <a\n" +
    "                            ng-href=\"#/{{item.wf}}/{{item.model}}?{{item.param}}={{selectedUser.key}}\">\n" +
    "                        {{item.text}}\n" +
    "                    </a>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "\n" +
    "</div>\n" +
    "<!-- end of row -->\n" +
    "\n" +
    "<div class=\"dashboard-main-anouncement clearfix\">\n" +
    "\n" +
    "    <div class=\"row\">\n" +
    "        <div class=\"col-md-12\">\n" +
    "            <div class=\"panel panel-default\">\n" +
    "                <div class=\"panel-heading\">\n" +
    "                    <div class=\"panel-title\">Duyurular</div>\n" +
    "                </div>\n" +
    "                <div class=\"panel-body\">\n" +
    "                    <a ng-click=\"markAsRead(notify)\"\n" +
    "                       ng-repeat=\"notify in notifications[3] | limitTo:5\">{{notify\n" +
    "                        .body}}</a>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "\n" +
    "</div>\n" +
    "<!-- end of dashboard-main-anouncement -->");
}]);

angular.module("components/dashboard/user-templates/student.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("components/dashboard/user-templates/student.html",
    "<!-- STUDENT DASHBOARD -->\n" +
    "\n" +
    "<div class=\"row\">\n" +
    "    <!-- STUDENT COURSES -->\n" +
    "    <div class=\"col-lg-6 col-md-12 student-course-list\">\n" +
    "        <div class=\"panel panel-default\">\n" +
    "            <div class=\"panel-heading\">\n" +
    "                <div class=\"panel-title\">Dersler</div>\n" +
    "            </div>\n" +
    "            <div class=\"panel-body\">\n" +
    "\n" +
    "                <ul>\n" +
    "                    <li><a href=\"#\"><span>181</span> Basic Physics</a></li>\n" +
    "                    <li><a href=\"#\"><span>421</span> Research and Development</a></li>\n" +
    "                    <li><a href=\"#\"><span>435</span> Project Management and Development</a></li>\n" +
    "                    <li><a href=\"#\"><span>207</span> Design and Use of Instructional Material</a></li>\n" +
    "                    <li><a href=\"#\"><span>323</span> Multimedia Design and Development</a></li>\n" +
    "                    <li><a href=\"#\"><span>475</span> Climate Change Education for Sustainability</a></li>\n" +
    "                </ul>\n" +
    "\n" +
    "            </div>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "    <!-- END OF STUDENT COURSES -->\n" +
    "\n" +
    "    <!-- STUDENT ASSIGNMENTS -->\n" +
    "    <div class=\"col-lg-6 col-md-12 student-assignment-list\">\n" +
    "        <div class=\"panel panel-default\">\n" +
    "            <div class=\"panel-heading\">\n" +
    "                <div class=\"panel-title\">Görevler</div>\n" +
    "            </div>\n" +
    "            <div class=\"panel-body\">\n" +
    "\n" +
    "                <ul>\n" +
    "                    <li class=\"urgent-assignment\">\n" +
    "                        <a href=\"#\" class=\"clearfix\">\n" +
    "                                	<span class=\"assignment-status\">\n" +
    "                                    	<div class=\"assignment-circle\" uib-tooltip=\"Acil\"></div>\n" +
    "                                    </span>\n" +
    "                                    <span class=\"assignment-title\">\n" +
    "                                    	<div>Needs Assessment Document</div>\n" +
    "                                        <div>435 - Project Management and Development</div>\n" +
    "                                    </span>\n" +
    "                                    <span class=\"assignment-due-date\">\n" +
    "                                    	<div>18</div>\n" +
    "                                        <div>ŞUB</div>\n" +
    "                                    </span>\n" +
    "                        </a>\n" +
    "                    </li>\n" +
    "                    <!-- end of urgent-assignment -->\n" +
    "                    <li class=\"approaching-assignment\">\n" +
    "                        <a href=\"#\" class=\"clearfix\">\n" +
    "                                	<span class=\"assignment-status\">\n" +
    "                                    	<div class=\"assignment-circle\" uib-tooltip=\"Yaklaşıyor\"></div>\n" +
    "                                    </span>\n" +
    "                                    <span class=\"assignment-title\">\n" +
    "                                    	<div>Storyboard Design</div>\n" +
    "                                        <div>435 - Project Management and Development</div>\n" +
    "                                    </span>\n" +
    "                                    <span class=\"assignment-due-date\">\n" +
    "                                    	<div>27</div>\n" +
    "                                        <div>ŞUB</div>\n" +
    "                                    </span>\n" +
    "                        </a>\n" +
    "                    </li>\n" +
    "                    <!-- end of approaching-assignment -->\n" +
    "                    <li class=\"non-urgent-assignment\">\n" +
    "                        <a href=\"#\" class=\"clearfix\">\n" +
    "                                	<span class=\"assignment-status\">\n" +
    "                                    	<div class=\"assignment-circle\" uib-tooltip=\"Acil olmayan\"></div>\n" +
    "                                    </span>\n" +
    "                                    <span class=\"assignment-title\">\n" +
    "                                    	<div>Design Report</div>\n" +
    "                                        <div>435 - Project Management and Development</div>\n" +
    "                                    </span>\n" +
    "                                    <span class=\"assignment-due-date\">\n" +
    "                                    	<div>05</div>\n" +
    "                                        <div>MAR</div>\n" +
    "                                    </span>\n" +
    "                        </a>\n" +
    "                    </li>\n" +
    "                    <!-- end of non-urgent-assignment -->\n" +
    "\n" +
    "                    <li class=\"last-assignment\">\n" +
    "                        <div class=\"panel-heading\">\n" +
    "                            <div class=\"panel-title\">Tamamlanan Son Görevler</div>\n" +
    "                        </div>\n" +
    "                        <a href=\"#\" class=\"clearfix\">\n" +
    "                                	<span class=\"assignment-status\">\n" +
    "                                    	<div></div>\n" +
    "                                    </span>\n" +
    "                                    <span class=\"assignment-title\">\n" +
    "                                    	<div>Design Report</div>\n" +
    "                                        <div>435 - Project Management and Development</div>\n" +
    "                                    </span>\n" +
    "                                    <span class=\"assignment-due-date\">\n" +
    "                                    	<div><i class=\"fa fa-check\"></i></div>\n" +
    "                                    </span>\n" +
    "                        </a>\n" +
    "                    </li>\n" +
    "                    <!-- end of last-assignment -->\n" +
    "                </ul>\n" +
    "\n" +
    "            </div>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "    <!-- END OF STUDENT ASSIGNMENTS -->\n" +
    "</div>\n" +
    "\n" +
    "\n" +
    "<div class=\"row\">\n" +
    "    <!-- STUDENT ANNOUNCEMENTS -->\n" +
    "    <div class=\"col-lg-6 col-md-12 student-announcement-list\">\n" +
    "        <div class=\"panel panel-default\">\n" +
    "            <div class=\"panel-heading\">\n" +
    "                <div class=\"panel-title\">Duyurular</div>\n" +
    "            </div>\n" +
    "            <div class=\"panel-body\">\n" +
    "\n" +
    "                <ul>\n" +
    "                    <li>\n" +
    "                        <a href=\"#\" class=\"clearfix\">\n" +
    "                            		<span class=\"announcement-date\">\n" +
    "                                    	<div>05</div>\n" +
    "                                        <div>MAR</div>\n" +
    "                                    </span>\n" +
    "                                    <span class=\"announcement-text\">\n" +
    "                                    	Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus non molestie est. Phasellus suscipit ut quam pulvinar tincidunt. Etiam accumsan vel turpis vitae vehicula. Quisque vel est nisl. In massa sapien, congue at dapibus sed, maximus eu urna.\n" +
    "                                    </span>\n" +
    "                        </a>\n" +
    "                    </li>\n" +
    "                    <li>\n" +
    "                        <a href=\"#\" class=\"clearfix\">\n" +
    "                            		<span class=\"announcement-date\">\n" +
    "                                    	<div>24</div>\n" +
    "                                        <div>MAR</div>\n" +
    "                                    </span>\n" +
    "                                    <span class=\"announcement-text\">\n" +
    "                                    	Donec nec purus et nunc imperdiet vulputate quis vel turpis. Suspendisse nec bibendum odio. Praesent et enim blandit, varius diam\n" +
    "                                    </span>\n" +
    "                        </a>\n" +
    "                    </li>\n" +
    "                    <li>\n" +
    "                        <a href=\"#\" class=\"clearfix\">\n" +
    "                            		<span class=\"announcement-date\">\n" +
    "                                    	<div>11</div>\n" +
    "                                        <div>NİS</div>\n" +
    "                                    </span>\n" +
    "                                    <span class=\"announcement-text\">\n" +
    "                                    	Etiam eget libero sapien. Nulla vitae ultricies quam. Aliquam gravida ligula eu leo ullamcorper tristique. Donec accumsan nec odio non viverra.\n" +
    "                                    </span>\n" +
    "                        </a>\n" +
    "                    </li>\n" +
    "                    <li>\n" +
    "                        <a href=\"#\" class=\"clearfix\">\n" +
    "                            		<span class=\"announcement-date\">\n" +
    "                                    	<div>19</div>\n" +
    "                                        <div>MAY</div>\n" +
    "                                    </span>\n" +
    "                                    <span class=\"announcement-text\">\n" +
    "                                    	Maecenas fermentum, metus sed feugiat lacinia, massa sem facilisis erat, eget sollicitudin ante ipsum id dolor. Curabitur id odio eleifend, lobortis ipsum id, lacinia lacus. Morbi ac rutrum nisl, id auctor purus. Fusce vulputate elit sed massa pellentesque convallis.\n" +
    "                                    </span>\n" +
    "                        </a>\n" +
    "                    </li>\n" +
    "                </ul>\n" +
    "\n" +
    "            </div>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "    <!-- END OF STUDENT ANNOUNCEMENTS -->\n" +
    "\n" +
    "    <!-- STUDENT MESSAGES -->\n" +
    "    <div class=\"col-lg-6 col-md-12 student-message-list\">\n" +
    "        <div class=\"panel panel-default\">\n" +
    "            <div class=\"panel-heading\">\n" +
    "                <div class=\"panel-title\">Görevler</div>\n" +
    "            </div>\n" +
    "            <div class=\"panel-body\">\n" +
    "\n" +
    "                <ul>\n" +
    "                    <li>\n" +
    "                        <a href=\"#\" class=\"clearfix\">\n" +
    "                                	<span class=\"profile-pic\">\n" +
    "                                    	<img src=\"../../img/gokhan.jpg\">\n" +
    "                                    </span>\n" +
    "                                    <span class=\"message-content\">\n" +
    "                                    	<div>Gökhan Boranalp</div>\n" +
    "                                        <div>Lorem ipsum dolor sit amet.</div>\n" +
    "                                    </span>\n" +
    "                                    <span class=\"message-time\">\n" +
    "                                    	14:40\n" +
    "                                    </span>\n" +
    "                        </a>\n" +
    "                    </li>\n" +
    "                    <li>\n" +
    "                        <a href=\"#\" class=\"clearfix\">\n" +
    "                                	<span class=\"profile-pic\">\n" +
    "                                    	<img src=\"../../img/evren.jpg\">\n" +
    "                                    </span>\n" +
    "                                    <span class=\"message-content\">\n" +
    "                                    	<div>Evren Kutar</div>\n" +
    "                                        <div>Donec nec purus et nunc imperdiet vulputate quis vel turpis. Suspendisse nec bibendum odio. Praesent et enim blandit, varius diam in.</div>\n" +
    "                                    </span>\n" +
    "                                    <span class=\"message-time\">\n" +
    "                                    	12:36\n" +
    "                                    </span>\n" +
    "                        </a>\n" +
    "                    </li>\n" +
    "                    <li>\n" +
    "                        <a href=\"#\" class=\"clearfix\">\n" +
    "                                	<span class=\"profile-pic\">\n" +
    "                                    	<img src=\"../../img/erkan.jpg\">\n" +
    "                                    </span>\n" +
    "                                    <span class=\"message-content\">\n" +
    "                                    	<div>Erkan Öğümsöğütlü</div>\n" +
    "                                        <div>Duis mi sem, euismod ut dui eget, egestas tincidunt ex. Aliquam id iaculis risus.</div>\n" +
    "                                    </span>\n" +
    "                                    <span class=\"message-time\">\n" +
    "                                    	Yesterday\n" +
    "                                    </span>\n" +
    "                        </a>\n" +
    "                    </li>\n" +
    "                    <li>\n" +
    "                        <a href=\"#\" class=\"clearfix\">\n" +
    "                                	<span class=\"profile-pic\">\n" +
    "                                    	<img src=\"../../img/sample-profile-pic.jpg\">\n" +
    "                                    </span>\n" +
    "                                    <span class=\"message-content\">\n" +
    "                                    	<div>Teddy Joyner</div>\n" +
    "                                        <div>Nulla vitae ultricies quam.</div>\n" +
    "                                    </span>\n" +
    "                                    <span class=\"message-time\">\n" +
    "                                    	16.02.2016\n" +
    "                                    </span>\n" +
    "                        </a>\n" +
    "                    </li>\n" +
    "                </ul>\n" +
    "\n" +
    "            </div>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "    <!-- END OF STUDENT MESSAGES -->\n" +
    "</div>\n" +
    "\n" +
    "<!-- END OF STUDENT DASHBOARD -->");
}]);

angular.module("components/debug/debug.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("components/debug/debug.html",
    "<div class=\"panel-group\" id=\"accordion\" role=\"tablist\" aria-multiselectable=\"true\">\n" +
    "    <div class=\"panel panel-default\" ng-repeat=\"query in debug_queries\">\n" +
    "        <div class=\"panel-heading\" role=\"tab\" id=\"headingOne\" data-toggle=\"collapse\" data-parent=\"#accordion\"\n" +
    "             data-target=\"#collapse{{$index}}\"\n" +
    "             aria-expanded=\"true\" aria-controls=\"collapseOne\">\n" +
    "            <h4 class=\"panel-title\">{{query.url}}\n" +
    "            </h4>\n" +
    "        </div>\n" +
    "        <div id=\"collapse{{$index}}\" class=\"panel-collapse collapse in\" role=\"tabpanel\" aria-labelledby=\"headingOne\">\n" +
    "            <div class=\"panel-body\">\n" +
    "                <div class=\"table-responsive\">\n" +
    "                    <ol>\n" +
    "                        <li ng-repeat=\"query in query.queries\">\n" +
    "                            <table class=\"table\">\n" +
    "                                <tbody>\n" +
    "                                <tr ng-repeat=\"(key, value) in query\">\n" +
    "                                    <td>{{key}}</td>\n" +
    "                                    <td>{{value}}</td>\n" +
    "                                </tr>\n" +
    "                                </tbody>\n" +
    "                            </table>\n" +
    "                        </li>\n" +
    "                    </ol>\n" +
    "\n" +
    "                </div>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "</div>");
}]);

angular.module("components/devSettings/devSettings.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("components/devSettings/devSettings.html",
    "<div class=\"table-responsive\">\n" +
    "    <table class=\"table\">\n" +
    "        <tbody>\n" +
    "        <tr>\n" +
    "            <td class=\"col-md-2\">Backend Url:</td>\n" +
    "            <td class=\"col-md-8\">\n" +
    "                <input class=\"form-control\" type=\"text\" placeholder=\"Backend Url Tanımla\"\n" +
    "                       value=\"{{backendurl}}\"\n" +
    "                       ng-model=\"backendurl\">\n" +
    "                <button class=\"btn btn-primary\" ng-click=\"setbackendurl()\">Kaydet</button>\n" +
    "            </td>\n" +
    "        </tr>\n" +
    "        <tr>\n" +
    "            <td>Notifications:</td>\n" +
    "            <td>\n" +
    "                <button class=\"btn\"\n" +
    "                        ng-class=\"{'btn-success':notificate=='on', 'btn-danger':notificate=='off'}\" ng-click=\"setnotification()\">{{notificate}}</button>\n" +
    "            </td>\n" +
    "        </tr>\n" +
    "        <tr>\n" +
    "            <td>Query Debug:</td>\n" +
    "            <td>\n" +
    "                <a href=\"#/debug/list\">Goster</a>\n" +
    "            </td>\n" +
    "        </tr>\n" +
    "        </tbody>\n" +
    "    </table>\n" +
    "</div>");
}]);

angular.module("components/error_pages/404.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("components/error_pages/404.html",
    "<div ng-app=\"ulakbus.error_pages\" class=\"error-page\">\n" +
    "    <div class=\"starter-template\">\n" +
    "\n" +
    "        <div class=\"row\">\n" +
    "            <div class=\"error-block\">\n" +
    "                <p>404</p>\n" +
    "                <p>Dosya Bulunamıyor</p>\n" +
    "                <a href=\"#/dashboard\"><button class=\"btn btn-warning\">Panel Sayfasına Dön</button></a>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "\n" +
    "    </div>\n" +
    "</div>");
}]);

angular.module("components/error_pages/500.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("components/error_pages/500.html",
    "<div ng-app=\"ulakbus.error_pages\" class=\"error-page\">\n" +
    "    <div class=\"starter-template\">\n" +
    "\n" +
    "        <div class=\"row\">\n" +
    "            <div class=\"error-block\">\n" +
    "                <p>500</p>\n" +
    "                <p>Sunucu Hatası</p>\n" +
    "                <a href=\"#/dashboard\"><button class=\"btn btn-warning\">Panel Sayfasına Dön</button></a>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "\n" +
    "    </div>\n" +
    "</div>");
}]);

angular.module("components/uitemplates/404.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("components/uitemplates/404.html",
    "<div ng-app=\"ulakbus.uitemplates\" class=\"dashboard\">\n" +
    "    <div class=\"starter-template\">\n" +
    "\n" +
    "        <div class=\"row\">\n" +
    "            <div>\n" +
    "                404.html\n" +
    "            </div>\n" +
    "        </div>\n" +
    "\n" +
    "    </div>\n" +
    "</div>");
}]);

angular.module("components/uitemplates/500.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("components/uitemplates/500.html",
    "<div ng-app=\"ulakbus.uitemplates\" class=\"dashboard\">\n" +
    "    <div class=\"starter-template\">\n" +
    "\n" +
    "        <div class=\"row\">\n" +
    "            <div>500.html</div>\n" +
    "        </div>\n" +
    "\n" +
    "    </div>\n" +
    "</div>");
}]);

angular.module("shared/templates/actionsModalContent.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("shared/templates/actionsModalContent.html",
    "<div class=\"modal-body\" style=\"padding: 0 !important; border-radius: 6px;\">\n" +
    "    <input type=\"text\" ng-model=\"act.selected\" placeholder=\"İşlem ismi giriniz...\"\n" +
    "           typeahead-on-select=\"doThis($item)\"\n" +
    "           uib-typeahead=\"act as act.name for act in actions | filter:$viewValue\" typeahead-no-results=\"noResults\"\n" +
    "           typeahead-wait-ms=\"500\" class=\"form-control\" style=\"border-radius: 6px; height: 50px; line-height: 40px\"\n" +
    "           autofocus>\n" +
    "</div>");
}]);

angular.module("shared/templates/add.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("shared/templates/add.html",
    "<!-- todo: remove this template -->\n" +
    "<h1>{{ schema.title }}</h1>\n" +
    "<form id=\"formgenerated\" name=\"formgenerated\" sf-schema=\"schema\" sf-form=\"form\" sf-model=\"model\"></form>\n" +
    "{{Node}}\n" +
    "<div ng-repeat=\"node in Node\">\n" +
    "    <h3>{{ node.title }}\n" +
    "        <span ng-if=\"node.lengthModels < 1\">\n" +
    "            <a modal-for-nodes=\"{{node.title}},Node\">\n" +
    "                <i class=\"fa fa-plus-circle fa-fw\"></i>\n" +
    "            </a>\n" +
    "        </span>\n" +
    "    </h3>\n" +
    "    <div class=\"node-table\">\n" +
    "        <ng-include src=\"'shared/templates/nodeTable.html'\"></ng-include>\n" +
    "    </div>\n" +
    "    <hr>\n" +
    "</div>\n" +
    "<div ng-repeat=\"node in ListNode\">\n" +
    "    <h3>{{ node.title }}\n" +
    "        <span>\n" +
    "            <a modal-for-nodes=\"{{node.title}},ListNode\">\n" +
    "                <i class=\"fa fa-plus-circle fa-fw\"></i>\n" +
    "            </a>\n" +
    "        </span>\n" +
    "    </h3>\n" +
    "    <div class=\"list-node-table\">\n" +
    "        <ng-include src=\"'shared/templates/nodeTable.html'\"></ng-include>\n" +
    "    </div>\n" +
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
    "        <span class=\"input-group-btn\">\n" +
    "            <button type=\"button\" class=\"btn btn-default\" ng-click=\"form.open($event)\">\n" +
    "                <i class=\"fa fa-calendar\"></i>\n" +
    "            </button>\n" +
    "        </span>\n" +
    "        <input ng-if=\"!form.fieldAddonLeft && !form.fieldAddonRight\"\n" +
    "               ng-show=\"form.key\"\n" +
    "               step=\"any\"\n" +
    "               sf-changed=\"form\"\n" +
    "               placeholder=\"{{form.placeholder}}\"\n" +
    "               class=\"form-control {{form.fieldHtmlClass}} datepickerfield\"\n" +
    "               id=\"{{form.key.slice(-1)[0]}}\"\n" +
    "               ng-model-options=\"form.ngModelOptions\"\n" +
    "               ng-model=\"$$value$$\"\n" +
    "               ng-disabled=\"form.readonly\"\n" +
    "               schema-validate=\"form\"\n" +
    "               name=\"{{form.key.slice(-1)[0]}}\"\n" +
    "               aria-describedby=\"{{form.key.slice(-1)[0] + 'Status'}}\"\n" +
    "               ng-change=\"form.onSelect()\"\n" +
    "\n" +
    "               type=\"{{form.type}}\"\n" +
    "               uib-datepicker-popup=\"{{form.format}}\"\n" +
    "               is-open=\"form.status.opened\"\n" +
    "               close-text=\"Kapat\"\n" +
    "               current-text=\"Bugün\"\n" +
    "               clear-text=\"Temizle\"\n" +
    "               ng-click=\"form.open($event)\"/>\n" +
    "\n" +
    "    </p>\n" +
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

angular.module("shared/templates/directives/alert.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("shared/templates/directives/alert.html",
    "<div ng-repeat=\"alert in alerts\" style=\"position: fixed; top:70px; right:20px; z-index: 999;\">\n" +
    "    <div class=\"alert\" ng-class=\"{'info':'alert-info', 'error': 'alert-danger', 'warning': 'alert-warning'}[alert.type]\">\n" +
    "        <b>\n" +
    "            {{alert.title}}\n" +
    "        </b>\n" +
    "        <p>{{alert.msg}}</p>\n" +
    "    </div>\n" +
    "</div>");
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

angular.module("shared/templates/directives/guide-help.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("shared/templates/directives/guide-help.html",
    "");
}]);

angular.module("shared/templates/directives/header-breadcrumb.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("shared/templates/directives/header-breadcrumb.html",
    "<!--<button type=\"button\" class=\"close breadcrumb pull-left\"><i class=\"fa fa-angle-left\"></i> Geri </button>-->\n" +
    "<!--<ul class=\"breadcrumb\">-->\n" +
    "    <!--<li ng-repeat=\"link in $root.breadcrumblinks\" ng-class=\"{'active':$last}\">-->\n" +
    "        <!--<a href=\"#\" ng-if=\"!$last\">{{link}}</a>-->\n" +
    "        <!--<span ng-if=\"$last\">{{link}}</span>-->\n" +
    "    <!--</li>-->\n" +
    "<!--</ul>-->\n" +
    "<!--<button type=\"button\" class=\"close breadcrumb pull-right\" ng-click=\"goBack()\">İleri <i class=\"fa fa-angle-right\"></i></button>-->");
}]);

angular.module("shared/templates/directives/header-notification.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("shared/templates/directives/header-notification.html",
    "<ul class=\"nav navbar-top-links navbar-right\">\n" +
    "    <li class=\"dropdown\">\n" +
    "        <a class=\"dropdown-toggle\" data-toggle=\"dropdown\">\n" +
    "        	<div class=\"badge\" ng-if=\"notifications[2].length > 0\">{{notifications[2].length}}</div>\n" +
    "            <i class=\"fa fa-envelope fa-fw\" tooltip-placement=\"bottom\" uib-tooltip=\"Mesajlar\"></i>  <i\n" +
    "                class=\"fa fa-caret-down\"></i>\n" +
    "        </a>\n" +
    "        <ul class=\"dropdown-menu dropdown-messages\" ng-if=\"notifications[2].length > 0\">\n" +
    "            <li ng-repeat=\"notify in notifications[2] | limitTo: '8'\">\n" +
    "                <a ng-click=\"markAsRead(notify)\">\n" +
    "                    <div>\n" +
    "                        <strong>{{notify.title}}</strong>\n" +
    "                        <span class=\"pull-right text-muted\">\n" +
    "                            <em>22 Ekim 2015</em>\n" +
    "                        </span>\n" +
    "                    </div>\n" +
    "                    <div>{{notify.body}}...</div>\n" +
    "                </a>\n" +
    "            </li>\n" +
    "            <li class=\"divider\"></li>\n" +
    "            <li>\n" +
    "                <a class=\"text-center\">\n" +
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
    "            <div class=\"badge\" ng-if=\"notifications[1].length > 0\">{{notifications[1].length}}</div>\n" +
    "            <i class=\"fa fa-tasks fa-fw\" tooltip-placement=\"bottom\" uib-tooltip=\"Görevler\"></i>  <i\n" +
    "                class=\"fa fa-caret-down\"></i>\n" +
    "        </a>\n" +
    "        <ul class=\"dropdown-menu dropdown-tasks\" ng-if=\"notifications[1].length > 0\">\n" +
    "            <li ng-repeat=\"notify in notifications[1] | limitTo: '8'\">\n" +
    "                <a  ng-click=\"markAsRead(notify)\">\n" +
    "                    <div>\n" +
    "                        <p>\n" +
    "                            <strong>{{notify.title}}</strong>\n" +
    "                            <span class=\"pull-right text-muted\">{{notify.body}}</span>\n" +
    "                        </p>\n" +
    "                        <!-- todo: progress bar will be used in future developments-->\n" +
    "                        <!--<div class=\"progress progress-striped active\">-->\n" +
    "                            <!--<div class=\"progress-bar progress-bar-success\" role=\"progressbar\" aria-valuenow=\"40\" aria-valuemin=\"0\" aria-valuemax=\"100\" style=\"width: 40%\">-->\n" +
    "                                <!--<span class=\"sr-only\">40% Complete (success)</span>-->\n" +
    "                            <!--</div>-->\n" +
    "                        <!--</div>-->\n" +
    "\n" +
    "                    </div>\n" +
    "                </a>\n" +
    "            </li>\n" +
    "            <li class=\"divider\"></li>\n" +
    "            <li>\n" +
    "                <a class=\"text-center\">\n" +
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
    "        	<div class=\"badge\" ng-if=\"notifications[3].length > 0\">{{notifications[3].length}}</div>\n" +
    "            <i class=\"fa fa-bell fa-fw\" tooltip-placement=\"bottom\" uib-tooltip=\"Duyurular\"></i>  <i\n" +
    "                class=\"fa fa-caret-down\"></i>\n" +
    "        </a>\n" +
    "        <ul class=\"dropdown-menu dropdown-alerts\" ng-if=\"notifications[3].length > 0\">\n" +
    "            <li>\n" +
    "                <a role=\"button\">\n" +
    "                    <div>\n" +
    "                        <i class=\"fa fa-comment fa-fw\"></i> New Comment\n" +
    "                        <span class=\"pull-right text-muted small\">4 minutes ago</span>\n" +
    "                    </div>\n" +
    "                </a>\n" +
    "            </li>\n" +
    "        </ul>\n" +
    "        <!-- /.dropdown-alerts -->\n" +
    "    </li>\n" +
    "    <!-- /.dropdown -->\n" +
    "    <li class=\"dropdown\" style=\"border-left:1px solid #891723;\">\n" +
    "        <a class=\"dropdown-toggle\" data-toggle=\"dropdown\" style=\"padding-top: 7px; padding-bottom: 6px;\">\n" +
    "            <img src=\"../../../img/sample-profile-pic.jpg\" class=\"header-profile\">&nbsp;{{$root.current_user.name}}&nbsp;{{$root.current_user.surname}}&nbsp;\n" +
    "            <i class=\"fa fa-caret-down\" style=\"margin-left:3px;\"></i>\n" +
    "        </a>\n" +
    "        <ul class=\"dropdown-menu dropdown-user\">\n" +
    "            <li><a role=\"button\"><i class=\"fa fa-user fa-fw\"></i> Profil</a></li>\n" +
    "            <li class=\"divider\"></li>\n" +
    "            <li><a role=\"button\"><i class=\"fa fa-gear fa-fw\"></i> Ayarlar</a></li>\n" +
    "            <li><a href=\"#/dev/settings\"><i class=\"fa fa-gear fa-fw\"></i> Ayarlar (Dev)</a></li>\n" +
    "            <li class=\"divider\"></li>\n" +
    "            <li><a ui-sref=\"login\" href=\"javascript:void(0);\" logout><i class=\"fa fa-sign-out fa-fw\"></i> Çıkış</a></li>\n" +
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
    "<div class=\"manager-view-header\">\n" +
    "    <div class=\"clearfix\">\n" +
    "        <header-breadcrumb></header-breadcrumb>\n" +
    "        <loaderdiv><div></div></loaderdiv>\n" +
    "    </div>\n" +
    "</div>");
}]);

angular.module("shared/templates/directives/menuCollapse.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("shared/templates/directives/menuCollapse.html",
    "<div class=\"sidebar-collapse-button\" ng-click=\"collapseToggle()\">\n" +
    "    <div></div>\n" +
    "    <div></div>\n" +
    "    <div></div>\n" +
    "</div>");
}]);

angular.module("shared/templates/directives/msgbox.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("shared/templates/directives/msgbox.html",
    "<div class=\"row\">\n" +
    "    <div class=\"container\">\n" +
    "        <div class=\"col-lg-12\">\n" +
    "            <div class=\"panel\" ng-class=\"{'info':'panel-info', 'error': 'panel-red', 'warning': 'panel-yellow'}[msgbox.type]\">\n" +
    "                <div class=\"panel-heading\">\n" +
    "                    {{msgbox.title}}\n" +
    "                </div>\n" +
    "                <div class=\"panel-body\">\n" +
    "                    <p>{{msgbox.msg}}</p>\n" +
    "                </div>\n" +
    "                <!--<div class=\"panel-footer\">-->\n" +
    "\n" +
    "                <!--</div>-->\n" +
    "            </div>\n" +
    "        </div>\n" +
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

angular.module("shared/templates/directives/right-sidebar.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("shared/templates/directives/right-sidebar.html",
    "<div class=\"right-sidebar selected-person-field\">\n" +
    "    <div class=\"right-sidebar-header\">\n" +
    "        <button type=\"button\" class=\"close\" ng-click=\"deselectUser()\"\n" +
    "                aria-label=\"Close\">\n" +
    "            <span class=\"unselect-person\"><i class=\"fa fa-times\"></i></span>\n" +
    "        </button>\n" +
    "    </div>\n" +
    "\n" +
    "    <div class=\"selected-person-info\">\n" +
    "        <img class=\"selected-person-img\"\n" +
    "             ng-src=\"{{selectedUser ? '/img/sample-profile-pic.jpg' : '/img/empty-profile-pic.jpg'}}\">\n" +
    "        <div class=\"selected-person-name\">\n" +
    "            <p class=\"identity-name\">{{selectedUser.name || 'Kişi seçilmedi.'}}</p>\n" +
    "            <p class=\"identity-surname\">{{selectedUser.surname}}</p>\n" +
    "            <p>{{selectedUser ? 'TCNo: ' + selectedUser.tcno : ''}}</p>\n" +
    "        </div>\n" +
    "\n" +
    "    </div>\n" +
    "\n" +
    "    <div class=\"\">\n" +
    "        <ul class=\"nav in\" id=\"side-user-menu\" data-step=\"2\"\n" +
    "            data-intro=\"seçilen personele veya öğrenciye göre ilgili menüler yer almaktadır. yapılacak işlemi buradan seçebilirsiniz.\">\n" +
    "\n" +
    "\n" +
    "            <li ng-repeat=\"(key, item) in selectedMenuItems\" ng-class=\"{active: collapseVar == $index+100}\">{{dropDown}}\n" +
    "                <a href=\"\" ng-click=\"check($index+100)\">\n" +
    "                    <i class=\"fa fa-fw\"\n" +
    "                       ng-class=\"{\n" +
    "                               'Admin': 'fa fa-fw fa-terminal',\n" +
    "                               'Genel': 'fa fa-fw fa-graduation-cap',\n" +
    "                               'Alt Kategori': 'fa fa-fw fa-tags',\n" +
    "                               'Kadro Islemleri': 'fa fa-fw fa-users',\n" +
    "                               'Seçime Uygun Görevler':'fa fa-fw fa-user'\n" +
    "                               }[item[0].kategori]\"></i>\n" +
    "                    <span class=\"menu-text\">{{ key }}</span>\n" +
    "                    <span class=\"fa arrow\"></span>\n" +
    "                </a>\n" +
    "                <ul class=\"nav nav-second-level\">\n" +
    "                    <li ng-repeat=\"(k, v) in item\">\n" +
    "                        <a ng-href=\"#/{{v.wf}}/{{v.model}}?{{v.param}}={{selectedUser.key}}\"\n" +
    "                           ng-click=\"breadcrumb([key, v.text], $event)\">{{v.text}}</a>\n" +
    "                    </li>\n" +
    "                </ul>\n" +
    "            </li>\n" +
    "        </ul>\n" +
    "    </div>\n" +
    "</div>");
}]);

angular.module("shared/templates/directives/search.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("shared/templates/directives/search.html",
    "<form class=\"form-inline pull-right\" id=\"search\" name=\"search\" sf-schema=\"searchSchema\" sf-form=\"searchForm\"\n" +
    "      sf-model=\"searchModel\"\n" +
    "      ng-submit=\"searchSubmit(search)\"></form>");
}]);

angular.module("shared/templates/directives/selected-user.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("shared/templates/directives/selected-user.html",
    "<span uib-popover-template=\"dynamicPopover.templateUrl\"\n" +
    "      popover-title=\"{{dynamicPopover.title}}\"\n" +
    "      popover-trigger=\"click\"\n" +
    "      popover-placement=\"bottom\"\n" +
    "      type=\"button\"\n" +
    "      ng-if=\"selectedUser\"\n" +
    "      class=\"\">İşlem yapılan kişi: <i class=\"fa fa-fw fa-user\"></i> <b>{{selectedUser.name}}</b> <i\n" +
    "        class=\"fa fa-caret-down\"></i></span>");
}]);

angular.module("shared/templates/directives/selectedUserPopover.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("shared/templates/directives/selectedUserPopover.html",
    "<div style=\"width:400px;\">\n" +
    "    <div class=\"row\">\n" +
    "        <div class=\"col-md-6\">\n" +
    "            <img src=\"img/sample-profile-pic.jpg\" alt=\"{{dynamicPopover.name}}\" class=\"img-thumbnail\">\n" +
    "        </div>\n" +
    "    </div>\n" +
    "\n" +
    "    <div class=\"row\">\n" +
    "        <div class=\"col-md-6\">\n" +
    "            <table class=\"table table-condensed\">\n" +
    "                <tbody>\n" +
    "                <tr>\n" +
    "                    <td>Ad:</td>\n" +
    "                    <td>{{dynamicPopover.name}}</td>\n" +
    "                </tr>\n" +
    "                <tr>\n" +
    "                    <td>TC Kimlik No:</td>\n" +
    "                    <td>{{dynamicPopover.tcno}}</td>\n" +
    "                </tr>\n" +
    "                </tbody>\n" +
    "            </table>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "</div>");
}]);

angular.module("shared/templates/directives/sidebar-notification.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("shared/templates/directives/sidebar-notification.html",
    "<div class=\"right-sidebar\">\n" +
    "\n" +
    "    <div class=\"right-sidebar-box\">\n" +
    "        <div class=\"right-sidebar-messages\">\n" +
    "\n" +
    "            <div class=\"right-sidebar-title clearfix\">\n" +
    "                <h3>Mesajlar</h3>\n" +
    "                <span><a role=\"button\">Tüm Mesajlar</a></span>\n" +
    "            </div>\n" +
    "            <!-- end of right-sidebar-title -->\n" +
    "\n" +
    "            <div class=\"right-sidebar-message-block\" ng-repeat=\"notify in notifications[2] | limitTo:5\">\n" +
    "                <a class=\"clearfix\">\n" +
    "                    <img src=\"../../../img/sample-profile-pic.jpg\">\n" +
    "                    <div class=\"right-sidebar-message-content\">\n" +
    "                        <div>{{notify.title}}</div>\n" +
    "                        <div>{{notify.body}}</div>\n" +
    "                        <div>16:05</div>\n" +
    "                    </div>\n" +
    "                    <!-- end of right-sidebar-message-content -->\n" +
    "                </a>\n" +
    "            </div>\n" +
    "            <!-- end of right-sidebar-message-block -->\n" +
    "\n" +
    "        </div>\n" +
    "        <!-- end of right-sidebar-messages -->\n" +
    "    </div>\n" +
    "    <!-- end of right-sidebar-box -->\n" +
    "\n" +
    "\n" +
    "    <div class=\"right-sidebar-box\">\n" +
    "        <div class=\"right-sidebar-tasks\">\n" +
    "\n" +
    "            <div class=\"right-sidebar-title clearfix\">\n" +
    "                <h3>Görevler</h3>\n" +
    "                <span><a role=\"button\">Tüm Görevler</a></span>\n" +
    "            </div>\n" +
    "            <!-- end of right-sidebar-title -->\n" +
    "\n" +
    "            <!--<div class=\"right-sidebar-task-block\">-->\n" +
    "            <!--<div class=\"task-type\">Devam Eden Görevler</div>-->\n" +
    "            <!--<a role=\"button\">-->\n" +
    "            <!--<div class=\"task-title\">Öğrenci Kayıt</div>-->\n" +
    "            <!--<div class=\"progress\">-->\n" +
    "            <!--<div class=\"progress-bar\" role=\"progressbar\" aria-valuenow=\"25\" aria-valuemin=\"0\" aria-valuemax=\"100\" style=\"min-width: 2em; width:25%;\">-->\n" +
    "            <!--25%-->\n" +
    "            <!--</div>-->\n" +
    "            <!--</div>-->\n" +
    "            <!--&lt;!&ndash; end of progress &ndash;&gt;-->\n" +
    "            <!--</a>-->\n" +
    "            <!--</div>-->\n" +
    "            <!-- end of right-sidebar-task-block -->\n" +
    "\n" +
    "            <div class=\"right-sidebar-task-block\">\n" +
    "                <div class=\"task-type\">Onay Bekleyen Görevler</div>\n" +
    "                <a ng-repeat=\"notify in notifications[1] | limitTo:5\">\n" +
    "                    <div class=\"task-title\">{{notify.title}}</div>\n" +
    "                </a>\n" +
    "            </div>\n" +
    "            <!-- end of right-sidebar-task-block -->\n" +
    "\n" +
    "        </div>\n" +
    "        <!-- end of right-sidebar-tasks -->\n" +
    "    </div>\n" +
    "    <!-- end of right-sidebar-box -->\n" +
    "\n" +
    "\n" +
    "    <div class=\"right-sidebar-box\">\n" +
    "        <div class=\"right-sidebar-announcements\">\n" +
    "\n" +
    "            <div class=\"right-sidebar-title clearfix\">\n" +
    "                <h3>Duyurular</h3>\n" +
    "                <span><a role=\"button\">Tüm Duyurular</a></span>\n" +
    "            </div>\n" +
    "            <!-- end of right-sidebar-title -->\n" +
    "\n" +
    "            <div class=\"right-sidebar-announcement-block\">\n" +
    "                <a ng-repeat=\"notify in notifications[3] | limitTo:5\">{{notify.body}}</a>\n" +
    "            </div>\n" +
    "            <!-- end of right-sidebar-status-block -->\n" +
    "\n" +
    "        </div>\n" +
    "        <!-- end of right-sidebar-status -->\n" +
    "    </div>\n" +
    "    <!-- end of right-sidebar-box -->\n" +
    "\n" +
    "\n" +
    "    <div class=\"right-sidebar-box\">\n" +
    "        <div class=\"right-sidebar-last-actions\">\n" +
    "\n" +
    "            <div class=\"right-sidebar-title clearfix\">\n" +
    "                <h3>Son İşlemler</h3>\n" +
    "                <span><a role=\"button\">Tüm İşlemler</a></span>\n" +
    "            </div>\n" +
    "            <!-- end of right-sidebar-title -->\n" +
    "\n" +
    "            <div class=\"right-sidebar-last-action-block\">\n" +
    "                <a role=\"button\">Birinci dönem bitimine 10 gün kaldı.</a>\n" +
    "                <a role=\"button\">Ders seçimi işlemleri xx tarihinde başlayacaktır.</a>\n" +
    "            </div>\n" +
    "            <!-- end of right-sidebar-status-block -->\n" +
    "\n" +
    "        </div>\n" +
    "        <!-- end of right-sidebar-status -->\n" +
    "    </div>\n" +
    "    <!-- end of right-sidebar-box -->\n" +
    "\n" +
    "</div>\n" +
    "<!-- end of right-sidebar -->");
}]);

angular.module("shared/templates/directives/sidebar-search.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("shared/templates/directives/sidebar-search.html",
    "");
}]);

angular.module("shared/templates/directives/sidebar.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("shared/templates/directives/sidebar.html",
    "<div class=\"navbar-default sidebar\" role=\"navigation\" ng-mouseenter=\"openSidebar()\" ng-mouseleave=\"closeSidebar()\">\n" +
    "\n" +
    "    <div class=\"sidebar-container\">\n" +
    "        <div class=\"sidebar-nav navbar-collapse\">\n" +
    "            <ul class=\"nav in\" id=\"side-menu\" ng-class=\"{hidden: $root.loggedInUser != true}\" data-step=\"1\"\n" +
    "                data-intro=\"Genel menüler yer almaktadır. yapılacak işlemi buradan seçebilirsiniz.\">\n" +
    "                <!--<sidebar-search></sidebar-search>-->\n" +
    "                <li ui-sref-active=\"active\">\n" +
    "                    <a href=\"#/dashboard\" ng-click=\"breadcrumb(['Panel'])\"><i class=\"fa fa-dashboard fa-fw\"></i>\n" +
    "                        <span class=\"menu-text\" ng-class=\"{hidden: $root.collapsed}\">Panel</span>\n" +
    "                    </a>\n" +
    "                </li>\n" +
    "\n" +
    "                <li ng-repeat=\"(key, item) in menuItems\" ng-class=\"{active: collapseVar == $index+1}\">{{dropDown}}\n" +
    "                    <a href=\"\" ng-click=\"check($index+1)\">\n" +
    "                        <i class=\"fa fa-fw\"\n" +
    "                           ng-class=\"{\n" +
    "                               'Admin': 'fa fa-fw fa-terminal',\n" +
    "                               'Genel': 'fa fa-fw fa-graduation-cap',\n" +
    "                               'Alt Kategori': 'fa fa-fw fa-tags',\n" +
    "                               'Kadro Islemleri': 'fa fa-fw fa-users',\n" +
    "                               'Seçime Uygun Görevler':'fa fa-fw fa-user',\n" +
    "                               'Raporlar': 'fa fa-pie-chart'\n" +
    "                               }[item[0].kategori]\"></i>\n" +
    "                        <span class=\"menu-text\" ng-class=\"{hidden: $root.collapsed}\">{{ key }}</span>\n" +
    "                        <span class=\"fa arrow\" ng-class=\"{hidden: $root.collapsed}\"></span>\n" +
    "                    </a>\n" +
    "                    <ul class=\"nav nav-second-level\" ng-class=\"{hidden: $root.collapsed}\">\n" +
    "                        <li ng-repeat=\"(k, v) in item\">\n" +
    "                            <!--<a ng-if=\"v.model\" ng-href=\"#{{v.url}}\" ng- -->\n" +
    "                            <!--ng-click=\"breadcrumb([key, v.text], $event)\">{{v.text}}</a>-->\n" +
    "                            <a ng-href=\"#/{{v.wf}}/{{v.model}}?{{v.param}}={{selectedUser.key}}\"\n" +
    "                               ng-click=\"breadcrumb([key, v.text], $event)\">{{v.text}}</a>\n" +
    "                        </li>\n" +
    "                    </ul>\n" +
    "                    <!-- /.nav-second-level -->\n" +
    "                </li>\n" +
    "            </ul>\n" +
    "        </div>\n" +
    "        <!-- /.sidebar-collapse -->\n" +
    "\n" +
    "    </div>\n" +
    "    <footer ng-class=\"{hidden: $root.collapsed}\">\n" +
    "        <a class=\"btn btn-large btn-success\" href=\"javascript:void(0);\" onclick=\"javascript:introJs().setOptions({\n" +
    "        'nextLabel': 'Sonraki', 'prevLabel': 'Öncek', 'skipLabel': 'Atla', 'doneLabel': 'Bitir' }).start();\">Yardım\n" +
    "            Rehberi</a><br>\n" +
    "    	<span>v <app-version></app-version> &copy; ZetaOps</span>\n" +
    "    </footer>\n" +
    "</div>\n" +
    "");
}]);

angular.module("shared/templates/directives/sort.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("shared/templates/directives/sort.html",
    "<form class=\"form-inline pull-left\" id=\"sort\" name=\"sort\" sf-schema=\"sortSchema\" sf-form=\"sortForm\"\n" +
    "      sf-model=\"sortModel\"\n" +
    "      ng-submit=\"sortSubmit(sort)\"></form>");
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

angular.module("shared/templates/filefield.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("shared/templates/filefield.html",
    "<div class=\"form-group {{form.htmlClass}} schema-form-select col-md-12\"\n" +
    "     ng-class=\"{'has-error': form.disableErrorState !== true && hasError(), 'has-success': form.disableSuccessState !== true && hasSuccess(), 'has-feedback': form.feedback !== false}\">\n" +
    "    <label class=\"control-label {{form.labelHtmlClass}}\" ng-show=\"showTitle()\">\n" +
    "        {{form.title}}\n" +
    "    </label>\n" +
    "\n" +
    "    <div class=\"form-group input-group fileUpload btn btn-primary\">\n" +
    "        <span>Dosya seç</span>\n" +
    "        <input type=\"file\"\n" +
    "               ng-model=\"$$value$$\"\n" +
    "               fileread=\"$$value$$\"\n" +
    "               placeholder=\"dosya/imaj seçiniz\"\n" +
    "               ng-model-options=\"form.ngModelOptions\"\n" +
    "               ng-disabled=\"form.readonly\"\n" +
    "               sf-changed=\"form\"\n" +
    "               class=\"form-control {{form.fieldHtmlClass}} upload\"\n" +
    "               schema-validate=\"form\"\n" +
    "               ng-change=\"form.fileInsert()\"\n" +
    "               name=\"{{form.name}}\"/>\n" +
    "    </div>\n" +
    "\n" +
    "    <img ng-show=\"form.avatar\" src=\"{{form.imageSrc || 'img/empty-profile-pic.jpg'}}\" alt=\"\" id=\"image-preview\" style=\"width:\n" +
    "        100px;\" class=\"pull-left\">\n" +
    "\n" +
    "    <div class=\"help-block\" sf-message=\"form.description\"></div>\n" +
    "</div>");
}]);

angular.module("shared/templates/foreignKey.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("shared/templates/foreignKey.html",
    "<div class=\"form-group {{form.htmlClass}} schema-form-select col-md-12\"\n" +
    "     ng-class=\"{'has-error': form.disableErrorState !== true && hasError(), 'has-success': form.disableSuccessState !== true && hasSuccess(), 'has-feedback': form.feedback !== false}\">\n" +
    "    <label class=\"control-label {{form.labelHtmlClass}}\" ng-show=\"showTitle()\">\n" +
    "        {{form.title}}\n" +
    "    </label>\n" +
    "    <a role=\"button\"><i class=\"fa fa-plus-circle fa-fw\" style=\"font-size: 24px;\"\n" +
    "                        add-modal-for-linked-model=\"{{form.formName}}\"></i></a>\n" +
    "\n" +
    "    <div class=\"form-group input-group\" tooltip-enable=\"form.focusToInput\"\n" +
    "         tooltip-is-open=\"form.focusToInput\"\n" +
    "         tooltip-placement=\"bottom\" uib-tooltip=\"Arama sonucu çok fazla, filtre ediniz.\">\n" +
    "            <span class=\"input-group-btn\">\n" +
    "                <button class=\"btn btn-default dropdown-toggle\" type=\"button\" ng-click=\"form.getDropdownTitleMap()\"\n" +
    "                        data-toggle=\"dropdown\">\n" +
    "                    <span class=\"caret\"></span>\n" +
    "                </button>\n" +
    "                <ul class=\"dropdown-menu\">\n" +
    "                    <li class=\"text-center\" ng-if=\"form.gettingTitleMap\"><a><span class=\"loader\"></span></a></li>\n" +
    "                    <li ng-repeat=\"item in form.titleMap\">\n" +
    "                        <a ng-click=\"form.onDropdownSelect(item, form.name)\">{{item\n" +
    "                            .name}}</a>\n" +
    "                    </li>\n" +
    "                </ul>\n" +
    "            </span>\n" +
    "        <input type=\"text\"\n" +
    "               ng-model=\"$$value$$\"\n" +
    "               uib-typeahead=\"item as item.name for item in form.getTitleMap($viewValue)\"\n" +
    "               typeahead-on-select=\"form.onSelect($item, form.name)\"\n" +
    "               typeahead-loading=\"loadingTitleMap\" typeahead-no-results=\"noResults\"\n" +
    "               typeahead-wait-ms=\"500\"\n" +
    "               placeholder=\"{{form.title}}\"\n" +
    "               ng-model-options=\"form.ngModelOptions\"\n" +
    "               ng-disabled=\"form.readonly\"\n" +
    "               sf-changed=\"form\"\n" +
    "               class=\"form-control {{form.fieldHtmlClass}}\"\n" +
    "               schema-validate=\"form\"\n" +
    "               name=\"{{form.name}}\"/>\n" +
    "    </div>\n" +
    "    <div ng-show=\"loadingTitleMap\" class=\"loader\"></div>\n" +
    "    <div ng-show=\"noResults\">\n" +
    "        <i class=\"fa fa-close\"></i> bulunamadı\n" +
    "    </div>\n" +
    "\n" +
    "    <!--<select ng-model=\"$$value$$\"-->\n" +
    "    <!--value=\"$$value$$\"-->\n" +
    "    <!--ng-model-options=\"form.ngModelOptions\"-->\n" +
    "    <!--ng-disabled=\"form.readonly\"-->\n" +
    "    <!--sf-changed=\"form\"-->\n" +
    "    <!--class=\"form-control {{form.fieldHtmlClass}}\"-->\n" +
    "    <!--schema-validate=\"form\"-->\n" +
    "    <!--ng-options=\"item.value as item.name for item in form.titleMap\"-->\n" +
    "    <!--name=\"{{form.key.slice(-1)[0]}}\">-->\n" +
    "    <!--</select>-->\n" +
    "\n" +
    "    <div class=\"help-block\" sf-message=\"form.description\"></div>\n" +
    "</div>");
}]);

angular.module("shared/templates/linkedModelModalContent.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("shared/templates/linkedModelModalContent.html",
    "<div class=\"modal-body\" style=\"overflow: auto;\">\n" +
    "    <h3>{{schema.title}}</h3>\n" +
    "    <div class=\"buttons-on-top-modal{{formName}}\"></div>\n" +
    "    <hr>\n" +
    "    <form name=\"linkedModelForm\" sf-schema=\"schema\" sf-form=\"form\" sf-model=\"model\" modal-form-locator></form>\n" +
    "    <div ng-repeat=\"node in Node\">\n" +
    "        <h3>{{ node.title }}\n" +
    "        <span ng-if=\"node.lengthModels < 1\">\n" +
    "            <a modal-for-nodes=\"{{node.schema.model_name}},Node\">\n" +
    "                <i class=\"fa fa-plus-circle fa-fw\"></i>\n" +
    "            </a>\n" +
    "        </span>\n" +
    "        </h3>\n" +
    "\n" +
    "        <div class=\"node-table\">\n" +
    "            <ng-include src=\"'shared/templates/nodeTable.html'\"></ng-include>\n" +
    "        </div>\n" +
    "        <hr>\n" +
    "    </div>\n" +
    "    <div ng-repeat=\"node in ListNode\">\n" +
    "        <h3>{{ node.title }}\n" +
    "        <span>\n" +
    "            <a modal-for-nodes=\"{{node.schema.model_name}},ListNode,add\">\n" +
    "                <i class=\"fa fa-plus-circle fa-fw\"></i>\n" +
    "            </a>\n" +
    "        </span>\n" +
    "        </h3>\n" +
    "\n" +
    "        <div class=\"list-node-table\">\n" +
    "            <ng-include src=\"'shared/templates/nodeTable.html'\"></ng-include>\n" +
    "        </div>\n" +
    "        <hr>\n" +
    "    </div>\n" +
    "    <hr>\n" +
    "    <div class=\"buttons-on-bottom-modal{{formName}}\"></div>\n" +
    "</div>\n" +
    "<div class=\"modal-footer\">\n" +
    "\n" +
    "    <!--<button type=\"submit\" class=\"btn btn-primary\" ng-click=\"onSubmit(linkedModelForm)\">OK</button>-->\n" +
    "    <button type=\"button\" class=\"btn btn-warning\" ng-click=\"cancel()\">İptal</button>\n" +
    "</div>");
}]);

angular.module("shared/templates/listnodeModalContent.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("shared/templates/listnodeModalContent.html",
    "<div class=\"modal-body\">\n" +
    "    <h3>{{schema.title}}</h3>\n" +
    "    <form name=\"modalForm\" sf-schema=\"schema\" sf-form=\"form\" sf-model=\"model\" modal-form-locator></form>\n" +
    "</div>\n" +
    "<div class=\"modal-footer\">\n" +
    "    <button type=\"submit\" class=\"btn btn-primary\" ng-click=\"onNodeSubmit()\">Tamam</button>\n" +
    "    <button type=\"button\" class=\"btn btn-warning\" ng-click=\"cancel()\">İptal</button>\n" +
    "</div>");
}]);

angular.module("shared/templates/modalContent.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("shared/templates/modalContent.html",
    "");
}]);

angular.module("shared/templates/multiselect.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("shared/templates/multiselect.html",
    "<div class=\"form-group {{form.htmlClass}} schema-form-select col-md-12\"\n" +
    "     ng-class=\"{'has-error': form.disableErrorState !== true && hasError(), 'has-success': form.disableSuccessState !== true && hasSuccess(), 'has-feedback': form.feedback !== false}\">\n" +
    "    <div class=\"col-md-12\">\n" +
    "        <label class=\"control-label {{form.labelHtmlClass}}\" ng-show=\"showTitle()\">\n" +
    "            {{form.title}}\n" +
    "        </label>\n" +
    "        <!--<a role=\"button\"><i class=\"fa fa-plus-circle fa-fw\" add-modal-for-linked-model=\"{{form.formName}}\"></i></a>-->\n" +
    "\n" +
    "        <div class=\"row\">\n" +
    "            <div class=\"col-md-12\">\n" +
    "                <input type=\"text\"\n" +
    "                       placeholder=\"{{form.title}} filtrele\"\n" +
    "                       class=\"form-control {{form.fieldHtmlClass}}\"\n" +
    "                       name=\"filter-interface\"\n" +
    "                       ng-model=\"form.filterValue\"\n" +
    "                       ng-keyup=\"form.appendFiltered(form.filterValue)\"/>\n" +
    "            </div>\n" +
    "\n" +
    "            <div class=\"col-md-12\">\n" +
    "                <label for=\"filterItems\">{{form.title}} Liste</label>\n" +
    "                <select ng-model=\"selectedItemsModel\"\n" +
    "                        value=\"$$value$$\"\n" +
    "                        ng-model-options=\"form.ngModelOptions\"\n" +
    "                        ng-disabled=\"form.readonly\"\n" +
    "                        sf-changed=\"form\"\n" +
    "                        class=\"form-control {{form.fieldHtmlClass}}\"\n" +
    "                        schema-validate=\"form\"\n" +
    "                        ng-options=\"item as item.name for item in form.filteredItems\"\n" +
    "                        name=\"filterItems\" multiple>\n" +
    "                </select>\n" +
    "            </div>\n" +
    "\n" +
    "            <div class=\"col-md-12 text-center\">\n" +
    "                <a role=\"button\"><i class=\"fa fa-arrow-down fa-fw\" ng-click=\"form.select(selectedItemsModel)\"></i></a>\n" +
    "                <a role=\"button\"><i class=\"fa fa-arrow-up fa-fw\" ng-click=\"form.deselect(selectedFilteredItemsModel)\"></i></a>\n" +
    "            </div>\n" +
    "\n" +
    "            <div class=\"col-md-12\">\n" +
    "                <label for=\"selectedItems\">Seçilenler</label>\n" +
    "                <select ng-model=\"selectedFilteredItemsModel\"\n" +
    "                        value=\"$$value$$\"\n" +
    "                        ng-model-options=\"form.ngModelOptions\"\n" +
    "                        ng-disabled=\"form.readonly\"\n" +
    "                        sf-changed=\"form\"\n" +
    "                        class=\"form-control {{form.fieldHtmlClass}}\"\n" +
    "                        schema-validate=\"form\"\n" +
    "                        ng-options=\"item as item.name for item in form.selectedFilteredItems\"\n" +
    "                        name=\"selectedItems\" multiple>\n" +
    "                </select>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "\n" +
    "        <div class=\"help-block\" sf-message=\"form.description\"></div>\n" +
    "    </div>\n" +
    "    <!--<div class=\"col-md-4\">-->\n" +
    "        <!--<a add-modal-for-linked-model>-->\n" +
    "            <!--<i class=\"fa fa-plus-circle fa-fw\"></i>-->\n" +
    "        <!--</a>-->\n" +
    "    <!--</div>-->\n" +
    "</div>");
}]);

angular.module("shared/templates/select.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("shared/templates/select.html",
    "<div class=\"form-group {{form.htmlClass}} schema-form-select\"\n" +
    "     ng-class=\"{'has-error': form.disableErrorState !== true && hasError(), 'has-success': form.disableSuccessState !== true && hasSuccess(), 'has-feedback': form.feedback !== false}\">\n" +
    "    <label class=\"control-label {{form.labelHtmlClass}}\" ng-show=\"showTitle()\">\n" +
    "        {{form.title}}\n" +
    "    </label>\n" +
    "    <select ng-model=\"$$value$$\"\n" +
    "            ng-model-options=\"form.ngModelOptions\"\n" +
    "            ng-disabled=\"form.readonly\"\n" +
    "            sf-changed=\"form\"\n" +
    "            class=\"form-control {{form.fieldHtmlClass}}\"\n" +
    "            schema-validate=\"form\"\n" +
    "            ng-options=\"item.value as item.name for item in form.titleMap\"\n" +
    "            name=\"{{form.key.slice(-1)[0]}}\"\n" +
    "            id=\"{{form.key.slice(-1)[0]}}\">\n" +
    "    </select>\n" +
    "\n" +
    "    <div class=\"help-block\" sf-message=\"form.description\"></div>\n" +
    "</div>");
}]);

angular.module("shared/templates/translate.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("shared/templates/translate.html",
    "<div class=\"tablescroll\">\n" +
    "    <table class=\"table table-bordered\" style=\"background-color:#fff;\">\n" +
    "        <thead>\n" +
    "        <tr ng-if=\"node.schema.formType=='ListNode'\">\n" +
    "            <th colspan=\"2\" ng-if=\"meta.allow_selection===true\">\n" +
    "                <label>\n" +
    "                    <input type=\"checkbox\" style=\"zoom:1.5; margin:5px 0 0 8px;\">\n" +
    "                    Hepsini Seç\n" +
    "                </label>\n" +
    "            </th>\n" +
    "            <th scope=\"row\" style=\"text-align:center\">#</th>\n" +
    "            <th ng-repeat=\"(key,value) in node.items[0] track by $index\"\n" +
    "                ng-if=\"key!=='idx' && node.schema.properties[key]\">\n" +
    "                <span ng-if=\"value.verbose_name\">{{ value.verbose_name }}</span>\n" +
    "                <span ng-if=\"!value.verbose_name\">{{key}}</span>\n" +
    "            </th>\n" +
    "            <th ng-if=\"meta.allow_actions!==false\">İşlem</th>\n" +
    "        </tr>\n" +
    "        </thead>\n" +
    "        <tbody ng-class=\"{hidden: node.lengthModels < 1}\">\n" +
    "\n" +
    "        <tr ng-repeat=\"listnodemodel in node.items track by $index\"\n" +
    "            ng-init=\"outerIndex=$index\"\n" +
    "            ng-if=\"node.schema.formType=='ListNode'\">\n" +
    "            <td ng-if=\"meta.allow_selection===true\" width=\"60\">\n" +
    "                <label>\n" +
    "                    <input type=\"checkbox\" style=\"zoom:1.5; margin:5px 0 0 8px;\">\n" +
    "                </label>\n" +
    "            </td>\n" +
    "            <td scope=\"row\" style=\"text-align:center\">{{$index+1}}</td>\n" +
    "            <td ng-repeat=\"(k, v) in listnodemodel track by $index\"\n" +
    "                ng-init=\"innerIndex=$index\"\n" +
    "                ng-if=\"k!=='idx' && node.schema.properties[k]\">\n" +
    "                <span ng-if=\"!node.schema.inline_edit || node.schema.inline_edit.indexOf(k) < 0\">{{ v.unicode || v }}</span>\n" +
    "                <input type=\"{{node.schema.properties[k].type}}\"\n" +
    "                       ng-if=\"node.schema.inline_edit.indexOf(k) > -1\"\n" +
    "                       ng-model=\"node.model[outerIndex][k]\"\n" +
    "                       ng-change=\"nodeModelChange(this)\">\n" +
    "            </td>\n" +
    "            <td ng-if=\"meta.allow_actions!==false\">\n" +
    "                <div ng-hide=\"meta.object_actions.length > 0\">\n" +
    "                    <span ng-click=\"remove(node, 'ListNode', $index)\"><i class=\"fa fa-times fa=fw\"></i></span>\n" +
    "                </div>\n" +
    "                <div ng-show=\"meta.object_actions.length > 0\">\n" +
    "                    <!-- define object actions here -->\n" +
    "                </div>\n" +
    "            </td>\n" +
    "        </tr>\n" +
    "\n" +
    "        </tbody>\n" +
    "    </table>\n" +
    "</div>");
}]);

angular.module("shared/templates/typeahead.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("shared/templates/typeahead.html",
    "<div class=\"form-group {{form.htmlClass}} schema-form-select col-md-12\"\n" +
    "     ng-class=\"{'has-error': form.disableErrorState !== true && hasError(), 'has-success': form.disableSuccessState !== true && hasSuccess(), 'has-feedback': form.feedback !== false}\">\n" +
    "    <label class=\"control-label {{form.labelHtmlClass}}\" ng-show=\"showTitle()\">\n" +
    "        {{form.title}}\n" +
    "    </label>\n" +
    "\n" +
    "    <!--<div class=\"form-group input-group\">-->\n" +
    "            <!--<span class=\"input-group-btn\">-->\n" +
    "                <!--<button class=\"btn btn-default dropdown-toggle\" type=\"button\"-->\n" +
    "                        <!--data-toggle=\"dropdown\">-->\n" +
    "                    <!--<span class=\"caret\"></span>-->\n" +
    "                <!--</button>-->\n" +
    "                <!--<ul class=\"dropdown-menu\">-->\n" +
    "                    <!--<li class=\"text-center\" ng-if=\"form.gettingTitleMap\"><a><span class=\"loader\"></span></a></li>-->\n" +
    "                    <!--<li ng-repeat=\"item in form.titleMap\">-->\n" +
    "                        <!--<a ng-click=\"form.onDropdownSelect(item, form.name)\">{{item-->\n" +
    "                            <!--.name}}</a>-->\n" +
    "                    <!--</li>-->\n" +
    "                <!--</ul>-->\n" +
    "            <!--</span>-->\n" +
    "        <input type=\"text\"\n" +
    "               ng-model=\"$$value$$\"\n" +
    "               uib-typeahead=\"item.name for item in form.titleMap | filter:$viewValue\"\n" +
    "               typeahead-wait-ms=\"500\"\n" +
    "               typeahead-loading=\"loadingTitleMap\"\n" +
    "               placeholder=\"{{form.title}}\"\n" +
    "               ng-model-options=\"form.ngModelOptions\"\n" +
    "               ng-disabled=\"form.readonly\"\n" +
    "               sf-changed=\"form\"\n" +
    "               class=\"form-control {{form.fieldHtmlClass}}\"\n" +
    "               schema-validate=\"form\"\n" +
    "               name=\"{{form.name}}\"/>\n" +
    "    <!--</div>-->\n" +
    "    <div ng-show=\"loadingTitleMap\" class=\"loader\"></div>\n" +
    "    <div class=\"help-block\" sf-message=\"form.description\"></div>\n" +
    "</div>");
}]);
