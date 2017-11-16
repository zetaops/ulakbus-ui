angular.module('templates-prod_bap', ['/components/bapComponents/dashboard.html', '/components/bapComponents/left-menu.html', '/components/bapComponents/top-action-buttons.html', '/shared/templates/actionsModalContent.html', '/shared/templates/add.html', '/shared/templates/confirm.html', '/shared/templates/confirmModalContent.html', '/shared/templates/confirmprev.html', '/shared/templates/datefield.html', '/shared/templates/demoMode.html', '/shared/templates/directives/alert.html', '/shared/templates/directives/chat.html', '/shared/templates/directives/guide-help.html', '/shared/templates/directives/header-breadcrumb.html', '/shared/templates/directives/header-notification.html', '/shared/templates/directives/header-sub-menu.html', '/shared/templates/directives/header-user-menu.html', '/shared/templates/directives/messaging/detail.html', '/shared/templates/directives/messaging/index.html', '/shared/templates/directives/msgbox.html', '/shared/templates/directives/notifications.html', '/shared/templates/directives/right-sidebar.html', '/shared/templates/directives/search.html', '/shared/templates/directives/selected-user.html', '/shared/templates/directives/selectedUserPopover.html', '/shared/templates/directives/sidebar-search.html', '/shared/templates/directives/sidebar.html', '/shared/templates/directives/sort.html', '/shared/templates/directives/stats.html', '/shared/templates/directives/timeline.html', '/shared/templates/directives/timetable-action-selector.html', '/shared/templates/directives/user-info.html', '/shared/templates/fieldset.html', '/shared/templates/filefield.html', '/shared/templates/foreignKey.html', '/shared/templates/linkedModelModalContent.html', '/shared/templates/listnodeModalContent.html', '/shared/templates/modalContent.html', '/shared/templates/multiselect.html', '/shared/templates/notificationsModalContent.html', '/shared/templates/select.html', '/shared/templates/translate.html', '/shared/templates/typeahead.html']);

angular.module("/components/bapComponents/dashboard.html", []).run(["$templateCache", function ($templateCache) {
  $templateCache.put("/components/bapComponents/dashboard.html",
    "<top-action-buttons button-list=\"dashboardData.top_action_buttons\"></top-action-buttons>\n" +
    "<div class=\"col-md-12\">\n" +
    "    <div class=\"col-md-12 detail-box\">\n" +
    "        <h4 ng-repeat=\"announcement in dashboardData.bidding.announcements\" ng-click=\"clickAnnouncement(announcement)\">\n" +
    "            {{announcement.text}}\n" +
    "        </h4>\n" +
    "        <div class=\"col-md-12\">\n" +
    "            <button class=\"brand-bg pull-right\" ng-click=\"clickMore(dashboardData.bidding.more.wf);\">{{dashboardData.bidding.more.text}}</button>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "\n" +
    "    <div class=\"col-md-12 detail-box\">\n" +
    "        <h4 ng-repeat=\"announcement in dashboardData.general.announcements\" ng-click=\"clickAnnouncement(announcement)\">\n" +
    "            {{announcement.text}}\n" +
    "        </h4>\n" +
    "        <div class=\"col-md-12\">\n" +
    "            <button class=\"brand-bg pull-right\" ng-click=\"clickMore(dashboardData.general.more.wf);\">{{dashboardData.general.more.text}}</button>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "</div>");
}]);

angular.module("/components/bapComponents/left-menu.html", []).run(["$templateCache", function ($templateCache) {
  $templateCache.put("/components/bapComponents/left-menu.html",
    "<div class=\"vertical-menu\">\n" +
    "    <h3 class=\"title\">{{menuItems.title}}</h3>\n" +
    "    <ul class=\"nav nav-pills nav-stacked left-menu\" id=\"bap-menu\">\n" +
    "        <li ng-repeat=\"menu in menuItems.items\">\n" +
    "            <a ng-href=\"#/{{menu.wf}}\" ng-class=\"{active: selectedMenu == $index}\" ng-click=\"setActive($index)\">{{menu.text}}</a>\n" +
    "        </li>\n" +
    "    </ul>\n" +
    "</div>\n" +
    "\n" +
    "");
}]);

angular.module("/components/bapComponents/top-action-buttons.html", []).run(["$templateCache", function ($templateCache) {
  $templateCache.put("/components/bapComponents/top-action-buttons.html",
    "<div class=\"col-md-12 tiles-container\">\n" +
    "    <div class=\"col-md-2 tiles\" ng-repeat=\"button in buttonList\" ng-class=\"{active: selectedButton == $index}\" ng-click=\"setActive($index, button)\">\n" +
    "        <div class=\"top-tiles\"><span>{{button.text}}</span></div>\n" +
    "    </div>\n" +
    "</div>");
}]);

angular.module("/shared/templates/actionsModalContent.html", []).run(["$templateCache", function ($templateCache) {
  $templateCache.put("/shared/templates/actionsModalContent.html",
    "<div class=\"modal-body\" style=\"padding: 0 !important; border-radius: 6px;\">\n" +
    "    <input type=\"text\" ng-model=\"act.selected\" placeholder=\"İşlem ismi giriniz...\"\n" +
    "           typeahead-on-select=\"doThis($item)\"\n" +
    "           uib-typeahead=\"act as act.name for act in actions | filter:$viewValue\" typeahead-no-results=\"noResults\"\n" +
    "           typeahead-wait-ms=\"500\" class=\"form-control\" style=\"border-radius: 6px; height: 50px; line-height: 40px\"\n" +
    "           autofocus>\n" +
    "</div>");
}]);

angular.module("/shared/templates/add.html", []).run(["$templateCache", function ($templateCache) {
  $templateCache.put("/shared/templates/add.html",
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
    "        <ng-include src=\"'/shared/templates/nodeTable.html'\"></ng-include>\n" +
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
    "        <ng-include src=\"'/shared/templates/nodeTable.html'\"></ng-include>\n" +
    "    </div>\n" +
    "    <hr>\n" +
    "</div>\n" +
    "\n" +
    "<button id=\"submitbutton\" type=\"button\" class=\"btn btn-primary\" ng-click=\"onSubmit(formgenerated)\">Kaydet</button>\n" +
    "<!-- <button type=\"button\" class=\"btn btn-warning\">Düzenle</button>  todo: make it conditional -->\n" +
    "<!-- <button type=\"button\" class=\"btn btn-danger\">İptal</button> todo: turn back to previous page -->");
}]);

angular.module("/shared/templates/confirm.html", []).run(["$templateCache", function ($templateCache) {
  $templateCache.put("/shared/templates/confirm.html",
    "<div class=\"form-group schema-form-submit {{form.htmlClass}}\">\n" +
    "    <button class=\"btn {{ form.style || 'btn-default' }}\"\n" +
    "            type=\"button\"\n" +
    "            ng-disabled=\"form.readonly\"\n" +
    "            ng-click=\"form.openModal()\">\n" +
    "        <span ng-if=\"form.icon\" class=\"{{form.icon}}\"></span>\n" +
    "        {{form.title}}\n" +
    "    </button>\n" +
    "    <!--<script type=\"text/ng-template\" id=\"confirmModalTemplate.html\">-->\n" +
    "        <!--<div class=\"modal-header\">-->\n" +
    "            <!--<h3 class=\"modal-title\">{{form.title}}</h3>-->\n" +
    "        <!--</div>-->\n" +
    "        <!--<div class=\"modal-body\">-->\n" +
    "            <!--<p>{{form.confirm_message}}</p>-->\n" +
    "        <!--</div>-->\n" +
    "        <!--<div class=\"modal-footer\">-->\n" +
    "            <!--<button ng-repeat=\"b in form.buttons\" class=\"btn {{b.style || 'btn-default'}}\" type=\"button\" ng-click=\"form.send(b.cmd,(b.dismiss || false))\">{{b.text}}</button>-->\n" +
    "        <!--</div>-->\n" +
    "    <!--</script>-->\n" +
    "</div>");
}]);

angular.module("/shared/templates/confirmModalContent.html", []).run(["$templateCache", function ($templateCache) {
  $templateCache.put("/shared/templates/confirmModalContent.html",
    "<div class=\"modal-header\">\n" +
    "    <h3 class=\"modal-title\">{{form.title}}</h3>\n" +
    "</div>\n" +
    "<div class=\"modal-body\">\n" +
    "    <p>{{form.confirm_message}}</p>\n" +
    "</div>\n" +
    "<div class=\"modal-footer\">\n" +
    "    <button ng-repeat=\"b in form.buttons\" class=\"btn {{b.style || 'btn-default'}}\" type=\"button\" ng-click=\"form.onClick(b.cmd)\">{{b.text}}</button>\n" +
    "</div>");
}]);

angular.module("/shared/templates/confirmprev.html", []).run(["$templateCache", function ($templateCache) {
  $templateCache.put("/shared/templates/confirmprev.html",
    "<div class=\"form-group schema-form-submit {{form.htmlClass}}\">\n" +
    "    <button class=\"btn {{ form.style || 'btn-default' }}\"\n" +
    "            type=\"button\"\n" +
    "            ng-disabled=\"form.readonly\"\n" +
    "            uib-popover-template=\"'confirmPopoverTemplate.html'\"\n" +
    "            popover-title=\"{{form.title}}\"\n" +
    "            popover-trigger=\"none\"\n" +
    "            popover-placement=\"bottom\"\n" +
    "            popover-is-open=\"form.isOpen\"\n" +
    "            ng-click=\"form.clickHandler()\">\n" +
    "        <span ng-if=\"form.icon\" class=\"{{form.icon}}\"></span>\n" +
    "        {{form.title}}\n" +
    "    </button>\n" +
    "    <script type=\"text/ng-template\" id=\"confirmPopoverTemplate.html\">\n" +
    "            <div class=\"form-group\">\n" +
    "                <p>{{form.confirm_message}}</p>\n" +
    "                <button class=\"btn btn-default\" ng-click=\"form.confirm()\">Confirm</button>\n" +
    "            </div>\n" +
    "    </script>\n" +
    "</div>");
}]);

angular.module("/shared/templates/datefield.html", []).run(["$templateCache", function ($templateCache) {
  $templateCache.put("/shared/templates/datefield.html",
    "<div class=\"form-group schema-form-{{form.type}} {{form.htmlClass}}\"\n" +
    "     ng-class=\"{'has-error': form.disableErrorState !== true && hasError(), 'has-success': form.disableSuccessState !== true && hasSuccess(), 'has-feedback': form.feedback !== false }\">\n" +
    "    <label class=\"control-label {{form.labelHtmlClass}}\" ng-class=\"{'sr-only': !showTitle()}\"\n" +
    "           for=\"{{form.key.slice(-1)[0]}}\">{{form.title}}</label>\n" +
    "\n" +
    "    <p class=\"input-group\">\n" +
    "        <span class=\"input-group-btn\">\n" +
    "            <button ng-disabled=\"form.readonly\" type=\"button\" class=\"btn btn-default\" ng-click=\"form.open($event)\">\n" +
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
    "               readonly\n" +
    "               schema-validate=\"form\"\n" +
    "               name=\"{{form.key.slice(-1)[0]}}\"\n" +
    "               aria-describedby=\"{{form.key.slice(-1)[0] + 'Status'}}\"\n" +
    "               ng-change=\"form.onSelect()\"\n" +
    "               ng-disabled=\"form.readonly\"\n" +
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
    "        <span ng-if=\"form.fieldAddonRight\"\n" +
    "              class=\"input-group-addon\"\n" +
    "              ng-bind-html=\"form.fieldAddonRight\"></span>\n" +
    "    </div>\n" +
    "\n" +
    "    <span ng-if=\"form.feedback !== false\"\n" +
    "          class=\"form-control-feedback\"\n" +
    "          ng-class=\"evalInScope(form.feedback) || {'glyphicon': true, 'glyphicon-ok': hasSuccess(), 'glyphicon-remove': hasError() }\"\n" +
    "          aria-hidden=\"true\"></span>\n" +
    "\n" +
    "    <span ng-if=\"hasError() || hasSuccess()\"\n" +
    "          id=\"{{form.key.slice(-1)[0] + 'Status'}}\"\n" +
    "          class=\"sr-only\">{{ hasSuccess() ? '(success)' : '(error)' }}</span>\n" +
    "\n" +
    "    <div class=\"help-block\" sf-message=\"form.description\"></div>\n" +
    "</div>");
}]);

angular.module("/shared/templates/demoMode.html", []).run(["$templateCache", function ($templateCache) {
  $templateCache.put("/shared/templates/demoMode.html",
    "<nav class=\"navbar navbar-default navbar-static-top\"  ng-if=\"demo\" style=\"margin-bottom: 0; border: 0; background: transparent\">\n" +
    "    <div class=\"alert alert-warning text-center\" role=\"alert\" style=\"margin-bottom: 0\">\n" +
    "        <b><i class=\"fa fa-exclamation-triangle\" aria-hidden=\"true\"></i> Demo Modu <i class=\"fa fa-exclamation-triangle\" aria-hidden=\"true\"></i></b>\n" +
    "        <br>\n" +
    "        <small>HITAP, MERNIS gibi dış servislere bağlı iş akışları demo modunda çalışmamaktadır.</small>\n" +
    "    </div>\n" +
    "    <div class=\"clearfix\"></div>\n" +
    "</nav>");
}]);

angular.module("/shared/templates/directives/alert.html", []).run(["$templateCache", function ($templateCache) {
  $templateCache.put("/shared/templates/directives/alert.html",
    "<div ng-repeat=\"alert in alerts\" style=\"position: fixed; top:70px; right:20px; z-index: 999;\">\n" +
    "    <div class=\"alert\" ng-class=\"{'info':'alert-info', 'error': 'alert-danger', 'warning': 'alert-warning'}[alert.type]\">\n" +
    "        <b>\n" +
    "            {{alert.title}}\n" +
    "        </b>\n" +
    "        <p>{{alert.msg}}</p>\n" +
    "    </div>\n" +
    "</div>");
}]);

angular.module("/shared/templates/directives/chat.html", []).run(["$templateCache", function ($templateCache) {
  $templateCache.put("/shared/templates/directives/chat.html",
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

angular.module("/shared/templates/directives/guide-help.html", []).run(["$templateCache", function ($templateCache) {
  $templateCache.put("/shared/templates/directives/guide-help.html",
    "");
}]);

angular.module("/shared/templates/directives/header-breadcrumb.html", []).run(["$templateCache", function ($templateCache) {
  $templateCache.put("/shared/templates/directives/header-breadcrumb.html",
    "<!--<button type=\"button\" class=\"close breadcrumb pull-left\"><i class=\"fa fa-angle-left\"></i> Geri </button>-->\n" +
    "<!--<ul class=\"breadcrumb\">-->\n" +
    "    <!--<li ng-repeat=\"link in $root.breadcrumblinks\" ng-class=\"{'active':$last}\">-->\n" +
    "        <!--<a href=\"#\" ng-if=\"!$last\">{{link}}</a>-->\n" +
    "        <!--<span ng-if=\"$last\">{{link}}</span>-->\n" +
    "    <!--</li>-->\n" +
    "<!--</ul>-->\n" +
    "<!--<button type=\"button\" class=\"close breadcrumb pull-right\" ng-click=\"goBack()\">İleri <i class=\"fa fa-angle-right\"></i></button>-->");
}]);

angular.module("/shared/templates/directives/header-notification.html", []).run(["$templateCache", function ($templateCache) {
  $templateCache.put("/shared/templates/directives/header-notification.html",
    "<ul class=\"nav navbar-top-links navbar-right\" ng-if=\" !isPublicAccess \">\n" +
    "    <li>\n" +
    "        <a ng-click=\"showMessagesWindow('messages')\">\n" +
    "            <div class=\"badge\" ng-show=\"count.messages.count > 0\">{{count.messages.count}}</div>\n" +
    "            <i class=\"fa fa-envelope fa-fw\" tooltip-placement=\"bottom\" uib-tooltip=\"Mesajlar\"></i>\n" +
    "        </a>\n" +
    "    </li>\n" +
    "    <li>\n" +
    "        <a ng-click=\"showMessagesWindow('notifications')\">\n" +
    "            <div class=\"badge\" ng-if=\"count.notifications.count > 0\">{{count.notifications.count}}</div>\n" +
    "            <i class=\"fa fa-bell fa-fw\" tooltip-placement=\"bottom\" uib-tooltip=\"Duyurular\"></i>\n" +
    "        </a>\n" +
    "    </li>\n" +
    "   <user-menu></user-menu>\n" +
    "</ul>\n" +
    "");
}]);

angular.module("/shared/templates/directives/header-sub-menu.html", []).run(["$templateCache", function ($templateCache) {
  $templateCache.put("/shared/templates/directives/header-sub-menu.html",
    "<div class=\"manager-view-header\">\n" +
    "    <ul class=\"nav in\" id=\"side-menu\" data-step=\"1\"\n" +
    "        data-intro=\"Genel menüler yer almaktadır. yapılacak işlemi buradan seçebilirsiniz.\" ng-if=\" !isPublicAccess \">\n" +
    "        <!--<sidebar-search></sidebar-search>-->\n" +
    "        <li ui-sref-active=\"active\">\n" +
    "            <a href=\"#/dashboard\" ng-click=\"breadcrumb(['Panel'])\"><i class=\"fa fa-dashboard fa-fw\"></i>\n" +
    "                <span class=\"menu-text\" ng-class=\"{hidden: $root.collapsed}\">Panel</span>\n" +
    "            </a>\n" +
    "        </li>\n" +
    "        <li ng-repeat=\"(key, item) in menuItems\" ng-class=\"{active: collapseVar == $index+1}\">{{dropDown}}\n" +
    "            <a href=\"\" ng-click=\"check($index+1)\">\n" +
    "                <i class=\"fa fa-fw\"\n" +
    "                    ng-class=\"{\n" +
    "                        'Admin': 'fa fa-fw fa-terminal',\n" +
    "                        'Genel': 'fa fa-fw fa-graduation-cap',\n" +
    "                        'Alt Kategori': 'fa fa-fw fa-tags',\n" +
    "                        'Kadro İşlemleri': 'fa fa-fw fa-group',\n" +
    "                        'Seçime Uygun Görevler':'fa fa-fw fa-user',\n" +
    "                        'Personel': 'fa fa-fw fa-user',\n" +
    "                        'Raporlar': 'fa fa-pie-chart',\n" +
    "                        'Formlar': 'fa fa-fw fa-file-text',\n" +
    "                        'BAP': 'fa fa-star-half-o'\n" +
    "                        }[item[0].kategori]\"></i>\n" +
    "                <span class=\"menu-text\" ng-class=\"{hidden: $root.collapsed}\">{{ key }}</span>\n" +
    "                <i class=\"fa fa-arrow\"></i>\n" +
    "                <span class=\"fa arrow\"></span>\n" +
    "            </a>\n" +
    "            <ul class=\"dropdown-menu\">\n" +
    "                <li ng-repeat=\"(k, v) in item\">\n" +
    "                    <a ng-href=\"#/{{v.wf}}/{{v.model}}\"\n" +
    "                    ng-click=\"breadcrumb([key, v.text], $event)\">{{v.text}}</a>\n" +
    "                </li>\n" +
    "            </ul>\n" +
    "            <!-- /.nav-second-level -->\n" +
    "        </li>\n" +
    "    </ul>\n" +
    "    <div class=\"clearfix\">\n" +
    "        <header-breadcrumb></header-breadcrumb>\n" +
    "        <loaderdiv><div></div></loaderdiv>\n" +
    "    </div>\n" +
    "</div>");
}]);

angular.module("/shared/templates/directives/header-user-menu.html", []).run(["$templateCache", function ($templateCache) {
  $templateCache.put("/shared/templates/directives/header-user-menu.html",
    "<li class=\"dropdown\" style=\"border-left:1px solid #891723;\">\n" +
    "    <a class=\"dropdown-toggle\" data-toggle=\"dropdown\" style=\"padding-top: 7px; padding-bottom: 6px;\">\n" +
    "        <!-- TODO: replace image with placeholder avatar image-->\n" +
    "        <img ng-if=\"hasProfileImage\" ng-src=\"{{user.avatar}}\" class=\"header-profile\">\n" +
    "        <i ng-if=\"!hasProfileImage\" class=\"fa fa-user fa-fw\" aria-hidden=\"true\"></i>\n" +
    "        <span class=\"user-info\">\n" +
    "            <span class=\"user-name\">{{user.name}}&nbsp{{user.surname}}</span>\n" +
    "        </span>\n" +
    "\n" +
    "        <i class=\"fa fa-caret-down\" style=\"margin-left:3px;\"></i>\n" +
    "    </a>\n" +
    "    <ul class=\"dropdown-menu dropdown-user\">\n" +
    "        <li><a ng-href=\"#/profil_sayfasi_goruntuleme\" role=\"button\"><i class=\"fa fa-user fa-fw\"></i> Profil</a></li>\n" +
    "        <li ng-if=\"showRole\"><a ng-href=\"#/role_switching/\" role=\"button\"><i class=\"fa fa-user fa-fw\"></i> Rol Değiştir</a></li>\n" +
    "        <li class=\"divider\"></li>\n" +
    "        <!--<li><a role=\"button\"><i class=\"fa fa-gear fa-fw\"></i> Ayarlar</a></li>\n" +
    "        <li><a ng-href=\"#/dev/settings\"><i class=\"fa fa-gear fa-fw\"></i> Ayarlar</a></li>-->\n" +
    "        <li class=\"divider\"></li>\n" +
    "        <li><a ui-sref=\"login\" href=\"javascript:void(0);\" logout><i class=\"fa fa-sign-out fa-fw\"></i> Çıkış</a></li>\n" +
    "    </ul>\n" +
    "    <!-- /.dropdown-user -->\n" +
    "</li>");
}]);

angular.module("/shared/templates/directives/messaging/detail.html", []).run(["$templateCache", function ($templateCache) {
  $templateCache.put("/shared/templates/directives/messaging/detail.html",
    "<div class=\"conversation-section\">\n" +
    "\n" +
    "    <div class=\"conversation-header\">\n" +
    "        <div class=\"conversation-user\">\n" +
    "            <div class=\"user-photo\"><img src=\"../../../img/erkan.jpg\"></div>\n" +
    "            <div class=\"user-name\">Erkan Öğümsöğütlü</div>\n" +
    "        </div>\n" +
    "        <div class=\"conversation-search\">\n" +
    "            <input type=\"text\" placeholder=\"Arama Yap\">\n" +
    "        </div>\n" +
    "        <div class=\"dropdown\">\n" +
    "            <div class=\"chat-app-actions dropdown-toggle\" data-toggle=\"dropdown\" id=\"chat-app-actions\">\n" +
    "                <span class=\"glyphicon glyphicon-option-vertical\"></span>\n" +
    "            </div>\n" +
    "            <ul class=\"dropdown-menu\" aria-labelledby=\"chat-app-actions\" style=\"left: inherit; top: 53px; right: 66px;\">\n" +
    "                <li><a href=\"#\">Action One</a></li>\n" +
    "                <li><a href=\"#\">Action Two</a></li>\n" +
    "                <li><a href=\"#\">Action Three</a></li>\n" +
    "            </ul>\n" +
    "        </div>\n" +
    "        <div class=\"close-chat-app\">\n" +
    "            <span class=\"glyphicon glyphicon-remove\" ng-click=\"hideApp()\"></span>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "\n" +
    "    <div class=\"conversation-body\">\n" +
    "        <div class=\"conversation-body-inner\">\n" +
    "\n" +
    "            <div class=\"beginning-of-conversation\">\n" +
    "                This is the beginning of the conversation\n" +
    "            </div>\n" +
    "\n" +
    "            <div class=\"conversation-block clearfix\">\n" +
    "                <div class=\"conversation-actions\">\n" +
    "                    <div class=\"action\"><span class=\"glyphicon glyphicon-star-empty\"></span></div>\n" +
    "                    <div class=\"action dropdown-toggle\" data-toggle=\"dropdown\">\n" +
    "                    	<span class=\"glyphicon glyphicon-option-horizontal\"></span>\n" +
    "                    </div>\n" +
    "                    <ul class=\"dropdown-menu\" style=\"left:-86px;\">\n" +
    "                      <li><a href=\"#\">Edit</a></li>\n" +
    "                      <li><a href=\"#\">Delete</a></li>\n" +
    "                    </ul>\n" +
    "                </div>\n" +
    "\n" +
    "                <div class=\"user-photo\">\n" +
    "                    <img src=\"../../../img/erkan.jpg\">\n" +
    "                </div>\n" +
    "                \n" +
    "                <div class=\"user-message\">\n" +
    "                    <div class=\"message-header clearfix\">\n" +
    "                        <div class=\"user-name\">Erkan Öğümsöğütlü</div>\n" +
    "                        <div class=\"message-time\">13:16</div>\n" +
    "                    </div>\n" +
    "                    <div class=\"message-content\">\n" +
    "                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer purus mauris.\n" +
    "                    </div>\n" +
    "                    <div class=\"edit-text-message\">\n" +
    "                        <input type=\"text\">\n" +
    "                        <button class=\"btn btn-default\">Cancel</button>\n" +
    "                        <button class=\"btn btn-success\">Save Changes</button>\n" +
    "                    </div>\n" +
    "                    <!-- end of edit-text-message -->\n" +
    "                </div>\n" +
    "            </div>\n" +
    "            <!-- end of conversation-block -->\n" +
    "            \n" +
    "            <div class=\"conversation-block clearfix\">\n" +
    "                <div class=\"conversation-actions\">\n" +
    "                    <div class=\"action\"><span class=\"glyphicon glyphicon-star-empty\"></span></div>\n" +
    "                    <div class=\"action dropdown-toggle\" data-toggle=\"dropdown\">\n" +
    "                    	<span class=\"glyphicon glyphicon-option-horizontal\"></span>\n" +
    "                    </div>\n" +
    "                    <ul class=\"dropdown-menu\" style=\"left:-86px;\">\n" +
    "                      <li><a href=\"#\">Edit</a></li>\n" +
    "                      <li><a href=\"#\">Delete</a></li>\n" +
    "                    </ul>\n" +
    "                </div>\n" +
    "\n" +
    "                <div class=\"user-photo\">\n" +
    "                    <img src=\"../../../img/erkan.jpg\">\n" +
    "                </div>\n" +
    "                \n" +
    "                <div class=\"user-message\">\n" +
    "                    <div class=\"message-header clearfix\">\n" +
    "                        <div class=\"user-name\">Erkan Öğümsöğütlü</div>\n" +
    "                        <div class=\"message-time\">13:16</div>\n" +
    "                    </div>\n" +
    "                    <div class=\"message-content\">\n" +
    "                        <p class=\"attachment-message\">uploaded an image: <span>sample.jpg</span></p>\n" +
    "                        <a href=\"#\" class=\"attachment-holder image-attached\" target=\"_blank\">\n" +
    "                        	<img src=\"../../../img/sample.jpg\">\n" +
    "                            <span class=\"glyphicon glyphicon-download attachment-download\"></span>\n" +
    "                        </a>\n" +
    "                    </div>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "            <!-- end of conversation-block -->\n" +
    "            \n" +
    "            <div class=\"conversation-block clearfix\">\n" +
    "                <div class=\"conversation-actions\">\n" +
    "                    <div class=\"action\"><span class=\"glyphicon glyphicon-star-empty\"></span></div>\n" +
    "                    <div class=\"action dropdown-toggle\" data-toggle=\"dropdown\">\n" +
    "                    	<span class=\"glyphicon glyphicon-option-horizontal\"></span>\n" +
    "                    </div>\n" +
    "                    <ul class=\"dropdown-menu\" style=\"left:-86px;\">\n" +
    "                      <li><a href=\"#\">Edit</a></li>\n" +
    "                      <li><a href=\"#\">Delete</a></li>\n" +
    "                    </ul>\n" +
    "                </div>\n" +
    "\n" +
    "                <div class=\"user-photo\">\n" +
    "                    <img src=\"../../../img/erkan.jpg\">\n" +
    "                </div>\n" +
    "                \n" +
    "                <div class=\"user-message\">\n" +
    "                    <div class=\"message-header clearfix\">\n" +
    "                        <div class=\"user-name\">Erkan Öğümsöğütlü</div>\n" +
    "                        <div class=\"message-time\">13:16</div>\n" +
    "                    </div>\n" +
    "                    <div class=\"message-content\">\n" +
    "                        <p class=\"attachment-message\">uploaded a file</p>\n" +
    "                        <a href=\"#\" class=\"attachment-holder file-attached\" target=\"_blank\">\n" +
    "                        	<img src=\"../../../img/file-icon.png\">\n" +
    "                            <div class=\"attached-file-info\">\n" +
    "                            	<div>ulakbus-pdf</div>\n" +
    "                                <div>128KB PDF</div>\n" +
    "                            </div>\n" +
    "                            <span class=\"glyphicon glyphicon-download attachment-download\"></span>\n" +
    "                        </a>\n" +
    "                    </div>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "            <!-- end of conversation-block -->\n" +
    "\n" +
    "        </div>\n" +
    "    </div>\n" +
    "\n" +
    "    <div class=\"conversation-footer\">\n" +
    "\n" +
    "        <textarea placeholder=\"Mesajını buraya yaz...\"></textarea>\n" +
    "        <div class=\"add-attachment\">\n" +
    "            <span class=\"glyphicon glyphicon-send\"></span>\n" +
    "            <div class=\"dropup\" style=\"float:left;\">\n" +
    "            <span class=\"glyphicon glyphicon-paperclip dropdown-toggle\" data-toggle=\"dropdown\" id=\"attachment\"></span>\n" +
    "            <ul class=\"dropdown-menu\" aria-labelledby=\"attachment\" style=\"left:-104px;\">\n" +
    "            	<li><a href=\"#\">Image</a></li>\n" +
    "            	<li><a href=\"#\">File</a></li>\n" +
    "            </ul>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "\n" +
    "    </div>\n" +
    "\n" +
    "</div>\n" +
    "");
}]);

angular.module("/shared/templates/directives/messaging/index.html", []).run(["$templateCache", function ($templateCache) {
  $templateCache.put("/shared/templates/directives/messaging/index.html",
    "<div class=\"chat-app\" ng-hide=\"hidden\">\n" +
    "    <div class=\"chat-app-container\">\n" +
    "\n" +
    "        <div class=\"side-navigation\">\n" +
    "\n" +
    "            <ul class=\"channels\">\n" +
    "                <li class=\"title\">CHANNELS <span class=\"badge\">{{ }}</span></li>\n" +
    "                <li class=\"unread\">Public Channel</li>\n" +
    "                <li class=\"public-ro-channel\">Public Read Only Channel</li>\n" +
    "            </ul>\n" +
    "\n" +
    "            <ul class=\"channels\">\n" +
    "                <li class=\"title\">NOTIFICATIONS <span class=\"badge\">8</span></li>\n" +
    "                <li class=\"unread\">Notification One</li>\n" +
    "            </ul>\n" +
    "\n" +
    "            <ul class=\"direct-messages\">\n" +
    "                <li class=\"compose\"><span class=\"glyphicon glyphicon-plus-sign\"></span> Create New Message</li>\n" +
    "                <li class=\"title\">DIRECT MESSAGES <span class=\"badge\">14</span></li>\n" +
    "                <li class=\"online\" ng-class=\"{'active':'active', 'unread': 'unread'}\">Erkan Öğümsöğütlü</li>\n" +
    "            </ul>\n" +
    "\n" +
    "        </div>\n" +
    "\n" +
    "        <message-detail></message-detail>\n" +
    "\n" +
    "        <div class=\"chat-popup-window create-new-message-window\">\n" +
    "            <div class=\"close-chat-popup-window\"><span class=\"glyphicon glyphicon-remove\"></span></div>\n" +
    "            <input type=\"text\" placeholder=\"Birini ismi ile ara...\">\n" +
    "            <div class=\"search-results\">\n" +
    "                <div class=\"user\">\n" +
    "                    <img src=\"../../../../img/erkan.jpg\">\n" +
    "                    <div class=\"user-name\">Erkan Öğümsöğütlü</div>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "        <!-- end of create-new-message-window -->\n" +
    "        \n" +
    "        <div class=\"chat-popup-window create-new-channel-window\">\n" +
    "            <div class=\"close-chat-popup-window\"><span class=\"glyphicon glyphicon-remove\"></span></div>\n" +
    "            <h3>Create New Channel</h3>\n" +
    "            <div class=\"text-center\">\n" +
    "                <input type=\"text\" placeholder=\"Channel Name\"><br>\n" +
    "                <textarea placeholder=\"Channel Description\"></textarea>\n" +
    "                <button class=\"btn btn-success\">Create</button>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "        <!-- end of create-new-message-window -->\n" +
    "        \n" +
    "        <div class=\"chat-popup-window add-user-unit\">\n" +
    "            <div class=\"close-chat-popup-window\"><span class=\"glyphicon glyphicon-remove\"></span></div>\n" +
    "            <h3>Add User/Unit</h3>\n" +
    "            <div class=\"text-center\">\n" +
    "                <input type=\"text\" placeholder=\"Search User/Unit to Add\"><br>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "        <!-- end of create-new-message-window -->\n" +
    "    </div>\n" +
    "</div>\n" +
    "");
}]);

angular.module("/shared/templates/directives/msgbox.html", []).run(["$templateCache", function ($templateCache) {
  $templateCache.put("/shared/templates/directives/msgbox.html",
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

angular.module("/shared/templates/directives/notifications.html", []).run(["$templateCache", function ($templateCache) {
  $templateCache.put("/shared/templates/directives/notifications.html",
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

angular.module("/shared/templates/directives/right-sidebar.html", []).run(["$templateCache", function ($templateCache) {
  $templateCache.put("/shared/templates/directives/right-sidebar.html",
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

angular.module("/shared/templates/directives/search.html", []).run(["$templateCache", function ($templateCache) {
  $templateCache.put("/shared/templates/directives/search.html",
    "<form class=\"form-inline pull-right\" id=\"search\" name=\"search\" sf-schema=\"searchSchema\" sf-form=\"searchForm\"\n" +
    "      sf-model=\"searchModel\"\n" +
    "      ng-submit=\"searchSubmit(search)\"></form>");
}]);

angular.module("/shared/templates/directives/selected-user.html", []).run(["$templateCache", function ($templateCache) {
  $templateCache.put("/shared/templates/directives/selected-user.html",
    "<span uib-popover-template=\"dynamicPopover.templateUrl\"\n" +
    "      popover-title=\"{{dynamicPopover.title}}\"\n" +
    "      popover-trigger=\"click\"\n" +
    "      popover-placement=\"bottom\"\n" +
    "      type=\"button\"\n" +
    "      ng-if=\"selectedUser\"\n" +
    "      class=\"\">İşlem yapılan kişi: <i class=\"fa fa-fw fa-user\"></i> <b>{{selectedUser.name}}</b> <i\n" +
    "        class=\"fa fa-caret-down\"></i></span>");
}]);

angular.module("/shared/templates/directives/selectedUserPopover.html", []).run(["$templateCache", function ($templateCache) {
  $templateCache.put("/shared/templates/directives/selectedUserPopover.html",
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

angular.module("/shared/templates/directives/sidebar-search.html", []).run(["$templateCache", function ($templateCache) {
  $templateCache.put("/shared/templates/directives/sidebar-search.html",
    "");
}]);

angular.module("/shared/templates/directives/sidebar.html", []).run(["$templateCache", function ($templateCache) {
  $templateCache.put("/shared/templates/directives/sidebar.html",
    "<div class=\"navbar-default sidebar\" role=\"navigation\">\n" +
    "    <!-- <user-info></user-info> -->\n" +
    "    <div class=\"sidebar-container\">\n" +
    "        <div class=\"sidebar-nav navbar-collapse\">\n" +
    "            <ul class=\"nav in\" id=\"side-menu\" data-step=\"1\"\n" +
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
    "                               'Raporlar': 'fa fa-pie-chart',\n" +
    "                               'BAP': 'fa fa-star-half-o'\n" +
    "                               }[item[0].kategori]\"></i>\n" +
    "                        <span class=\"menu-text\" ng-class=\"{hidden: $root.collapsed}\">{{ key }}</span>\n" +
    "                        <span class=\"fa arrow\" ng-class=\"{hidden: $root.collapsed}\"></span>\n" +
    "                    </a>\n" +
    "                    <ul class=\"nav nav-second-level\" ng-class=\"{hidden: $root.collapsed}\">\n" +
    "                        <li ng-repeat=\"(k, v) in item\">\n" +
    "                            <!--<a ng-if=\"v.model\" ng-href=\"#{{v.url}}\" ng- -->\n" +
    "                            <!--ng-click=\"breadcrumb([key, v.text], $event)\">{{v.text}}</a>-->\n" +
    "                            <a ng-href=\"#/{{v.wf}}/{{v.model}}\"\n" +
    "                               ng-click=\"breadcrumb([key, v.text], $event)\">{{v.text}}</a>\n" +
    "                        </li>\n" +
    "                    </ul>\n" +
    "                    <!-- /.nav-second-level -->\n" +
    "                </li>\n" +
    "            </ul>\n" +
    "        </div>\n" +
    "        <!-- /.sidebar-collapse -->\n" +
    "    </div>\n" +
    "    <footer ng-class=\"{hidden: $root.collapsed}\">\n" +
    "    	<span>v <app-version></app-version> &copy; ZetaOps</span>\n" +
    "    </footer>\n" +
    "</div>\n" +
    "");
}]);

angular.module("/shared/templates/directives/sort.html", []).run(["$templateCache", function ($templateCache) {
  $templateCache.put("/shared/templates/directives/sort.html",
    "<form class=\"form-inline pull-left\" id=\"sort\" name=\"sort\" sf-schema=\"sortSchema\" sf-form=\"sortForm\"\n" +
    "      sf-model=\"sortModel\"\n" +
    "      ng-submit=\"sortSubmit(sort)\"></form>");
}]);

angular.module("/shared/templates/directives/stats.html", []).run(["$templateCache", function ($templateCache) {
  $templateCache.put("/shared/templates/directives/stats.html",
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

angular.module("/shared/templates/directives/timeline.html", []).run(["$templateCache", function ($templateCache) {
  $templateCache.put("/shared/templates/directives/timeline.html",
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

angular.module("/shared/templates/directives/timetable-action-selector.html", []).run(["$templateCache", function ($templateCache) {
  $templateCache.put("/shared/templates/directives/timetable-action-selector.html",
    "<div class=\"action-selector\" ng-class=\"{readonly: readonly}\">\n" +
    "    <span class=\"action-indicator\" ng-class=\"value\"></span>\n" +
    "    <div class=\"popover bottom ng-hide\" ng-if=\"!readonly\">\n" +
    "        <div class=\"arrow\"></div>\n" +
    "        <div class=\"popover-content\">\n" +
    "            <ul class=\"actions-selector-select\">\n" +
    "                <li ng-click=\"setModelValue(1)\">\n" +
    "                    <span class=\"action-indicator action-indicator_appropriate\"></span>\n" +
    "                </li>\n" +
    "                <li ng-click=\"setModelValue(2)\">\n" +
    "                    <span class=\"action-indicator action-indicator_uncertain\"></span>\n" +
    "                </li>\n" +
    "                <li ng-click=\"setModelValue(3)\">\n" +
    "                    <span class=\"action-indicator action-indicator_busy\"></span>\n" +
    "                </li>\n" +
    "            </ul>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "</div>\n" +
    "");
}]);

angular.module("/shared/templates/directives/user-info.html", []).run(["$templateCache", function ($templateCache) {
  $templateCache.put("/shared/templates/directives/user-info.html",
    "<div class=\"user-info-wrapper\">\n" +
    "    <div class=\"avatar-container\">\n" +
    "        <!-- TODO: replace image with placeholder avatar image-->\n" +
    "        <img ng-src=\"{{user.avatar || '../../../img/sample-profile-pic.jpg'}}\" class=\"header-profile\">\n" +
    "    </div>\n" +
    "    <div class=\"user-info-container\">\n" +
    "        <span class=\"user-name\" title=\"{{user.name}}&nbsp{{user.surname}}\">{{user.name}}&nbsp{{user.surname}}</span>\n" +
    "        <span class=\"user-title\" title=\"{{user.role_details.abs_name}}\">{{user.role_details.abs_name}}</span>\n" +
    "        <span class=\"user-unit\" title=\"{{user.role_details.unit_name}}\">{{user.role_details.unit_name}}</span>\n" +
    "    </div>\n" +
    "</div>\n" +
    "");
}]);

angular.module("/shared/templates/fieldset.html", []).run(["$templateCache", function ($templateCache) {
  $templateCache.put("/shared/templates/fieldset.html",
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

angular.module("/shared/templates/filefield.html", []).run(["$templateCache", function ($templateCache) {
  $templateCache.put("/shared/templates/filefield.html",
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

angular.module("/shared/templates/foreignKey.html", []).run(["$templateCache", function ($templateCache) {
  $templateCache.put("/shared/templates/foreignKey.html",
    "<div class=\"form-group {{form.htmlClass}} schema-form-select col-md-12\"\n" +
    "     ng-class=\"{'has-error': form.disableErrorState !== true && hasError(), 'has-success': form.disableSuccessState !== true && hasSuccess(), 'has-feedback': form.feedback !== false}\">\n" +
    "    <label class=\"control-label {{form.labelHtmlClass}}\" ng-show=\"showTitle()\">\n" +
    "        {{form.title}}\n" +
    "    </label>\n" +
    "    <a role=\"button\"><i ng-if=\"form.add_cmd\" class=\"fa fa-plus-square fa-fw\" style=\"font-size: 18px;\"\n" +
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
    "                <ul class=\"dropdown-menu\" ng-if=\"form.titleMap.length > 0\">\n" +
    "                    <li class=\"text-center\" ng-if=\"form.gettingTitleMap\"><a><span class=\"loader\"></span></a></li>\n" +
    "                    <li ng-repeat=\"item in form.titleMap\">\n" +
    "                        <a ng-click=\"form.onDropdownSelect(item, form.name)\">{{item\n" +
    "                            .name}}</a>\n" +
    "                    </li>\n" +
    "                </ul>\n" +
    "            </span>\n" +
    "        <input type=\"text\"\n" +
    "               ng-model=\"_$$value$$\"\n" +
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
    "</div>\n" +
    "");
}]);

angular.module("/shared/templates/linkedModelModalContent.html", []).run(["$templateCache", function ($templateCache) {
  $templateCache.put("/shared/templates/linkedModelModalContent.html",
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
    "            <ng-include src=\"'/shared/templates/nodeTable.html'\"></ng-include>\n" +
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
    "            <ng-include src=\"'/shared/templates/nodeTable.html'\"></ng-include>\n" +
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

angular.module("/shared/templates/listnodeModalContent.html", []).run(["$templateCache", function ($templateCache) {
  $templateCache.put("/shared/templates/listnodeModalContent.html",
    "<div class=\"modal-body\">\n" +
    "    <h3>{{schema.title}}</h3>\n" +
    "    <form name=\"modalForm\" sf-schema=\"schema\" sf-form=\"form\" sf-model=\"model\" modal-form-locator></form>\n" +
    "</div>\n" +
    "<div class=\"modal-footer\">\n" +
    "    <button type=\"submit\" class=\"btn btn-primary\" ng-click=\"onNodeSubmit()\" ng-disabled=\"disableTamam\">Tamam</button>\n" +
    "    <button type=\"button\" class=\"btn btn-warning\" ng-click=\"cancel()\">İptal</button>\n" +
    "</div>");
}]);

angular.module("/shared/templates/modalContent.html", []).run(["$templateCache", function ($templateCache) {
  $templateCache.put("/shared/templates/modalContent.html",
    "");
}]);

angular.module("/shared/templates/multiselect.html", []).run(["$templateCache", function ($templateCache) {
  $templateCache.put("/shared/templates/multiselect.html",
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
    "                        name=\"filterItems\"\n" +
    "                        size=30 style=\"height: 60%;\"\n" +
    "                        multiple>\n" +
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
    "                        name=\"selectedItems\"\n" +
    "                        size=30 style=\"height: 60%;\"\n" +
    "                        multiple>\n" +
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

angular.module("/shared/templates/notificationsModalContent.html", []).run(["$templateCache", function ($templateCache) {
  $templateCache.put("/shared/templates/notificationsModalContent.html",
    "<div class=\"modal-body\">\n" +
    "    <h3>{{notification.title}}</h3>\n" +
    "    {{notification.body}}\n" +
    "</div>\n" +
    "<div class=\"modal-footer\">\n" +
    "    <button type=\"button\" class=\"btn btn-warning\" ng-click=\"cancel()\">İptal</button>\n" +
    "</div>\n" +
    "");
}]);

angular.module("/shared/templates/select.html", []).run(["$templateCache", function ($templateCache) {
  $templateCache.put("/shared/templates/select.html",
    "<div class=\"form-group {{form.htmlClass}} schema-form-select\"\n" +
    "     ng-class=\"{'has-error': form.disableErrorState !== true && hasError(), 'has-success': form.disableSuccessState !== true && hasSuccess(), 'has-feedback': form.feedback !== false}\">\n" +
    "    <label class=\"control-label {{form.labelHtmlClass}}\" ng-show=\"showTitle()\">\n" +
    "        {{form.title}}\n" +
    "    </label>\n" +
    "\n" +
    "    <div class=\"select-wrapper {{form.fieldHtmlClass}}\">\n" +
    "        <ui-select\n" +
    "                ng-model=\"$$value$$\"\n" +
    "                title=\"{{form.title}}\"\n" +
    "                ng-model-options=\"form.ngModelOptions\"\n" +
    "                sf-changed=\"form\"\n" +
    "                schema-validate=\"form\"\n" +
    "                ng-disabled=\"form.readonly\"\n" +
    "                theme=\"bootstrap\"\n" +
    "                name=\"{{form.key.slice(-1)[0]}}\"\n" +
    "                id=\"{{form.key.slice(-1)[0]}}\">\n" +
    "            <ui-select-match placeholder=\"\">{{$select.selected.value.name}}</ui-select-match>\n" +
    "            <ui-select-choices repeat=\"item.value.value as (key, item) in form.titleMap | filter: $select.search\">\n" +
    "                <span ng-bind-html=\"item.value.name | highlight: $select.search \"></span>\n" +
    "            </ui-select-choices>\n" +
    "        </ui-select>\n" +
    "    </div>\n" +
    "\n" +
    "\n" +
    "\n" +
    "    <div class=\"help-block\" sf-message=\"form.description\"></div>\n" +
    "</div>");
}]);

angular.module("/shared/templates/translate.html", []).run(["$templateCache", function ($templateCache) {
  $templateCache.put("/shared/templates/translate.html",
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

angular.module("/shared/templates/typeahead.html", []).run(["$templateCache", function ($templateCache) {
  $templateCache.put("/shared/templates/typeahead.html",
    "<div class=\"form-group {{form.htmlClass}} schema-form-select col-md-12\"\n" +
    "     ng-class=\"{'has-error': form.disableErrorState !== true && hasError(), 'has-success': form.disableSuccessState !== true && hasSuccess(), 'has-feedback': form.feedback !== false}\">\n" +
    "    <label class=\"control-label {{form.labelHtmlClass}}\" ng-show=\"showTitle()\">\n" +
    "        {{form.title}}\n" +
    "    </label>\n" +
    "\n" +
    "    <input ng-if=\"form.widget!=='custom'\"\n" +
    "           type=\"text\"\n" +
    "           autocomplete=\"off\"\n" +
    "           ng-model=\"$$value$$\"\n" +
    "           uib-typeahead=\"item as item.name for item in form.titleMap\"\n" +
    "           typeahead-wait-ms=\"500\"\n" +
    "           typeahead-loading=\"loadingTitleMap\"\n" +
    "           typeahead-on-select=\"form.onDropdownSelect($item, form.name)\"\n" +
    "           placeholder=\"{{form.title}}\"\n" +
    "           ng-model-options=\"form.ngModelOptions\"\n" +
    "           ng-disabled=\"form.readonly\"\n" +
    "           sf-changed=\"form\"\n" +
    "           class=\"form-control {{form.fieldHtmlClass}}\"\n" +
    "           schema-validate=\"form\"\n" +
    "           name=\"{{form.name}}\"/>\n" +
    "\n" +
    "    <input ng-if=\"form.widget==='custom'\"\n" +
    "           type=\"text\"\n" +
    "           autocomplete=\"off\"\n" +
    "           ng-model=\"$$value$$\"\n" +
    "           uib-typeahead=\"item as item.name for item in form.getTitleMap($viewValue)\"\n" +
    "           typeahead-wait-ms=\"500\"\n" +
    "           typeahead-loading=\"loadingTitleMap\"\n" +
    "           typeahead-on-select=\"form.onDropdownSelect($item, form.name)\"\n" +
    "           placeholder=\"{{form.title}}\"\n" +
    "           ng-model-options=\"form.ngModelOptions\"\n" +
    "           ng-disabled=\"form.readonly\"\n" +
    "           sf-changed=\"form\"\n" +
    "           class=\"form-control {{form.fieldHtmlClass}}\"\n" +
    "           schema-validate=\"form\"\n" +
    "           name=\"{{form.name}}\"/>\n" +
    "\n" +
    "    <div ng-show=\"loadingTitleMap\" class=\"loader\"></div>\n" +
    "    <div class=\"help-block\" sf-message=\"form.description\"></div>\n" +
    "</div>");
}]);
