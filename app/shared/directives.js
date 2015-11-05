/**
 * Copyright (C) 2015 ZetaOps Inc.
 *
 * This file is licensed under the GNU General Public License v3
 * (GPLv3).  See LICENSE.txt for details.
 */

/**
 * logout directive
 */

app.directive('logout', function ($http, $location, RESTURL) {
    return {
        link: function ($scope, $element, $rootScope) {
            $element.on('click', function () {
                $http.post(RESTURL.url + 'logout', {}).then(function () {
                    $rootScope.loggedInUser = false;
                    $location.path("/login");
                });
            });
        }
    };
});

/**
 * headerNotification directive for header
 */

app.directive('headerNotification', function ($http, $rootScope, $cookies, $interval, RESTURL) {
    return {
        templateUrl: 'shared/templates/directives/header-notification.html',
        restrict: 'E',
        replace: true,
        link: function ($scope) {
            $scope.groupNotifications = function (notifications) {
                // notification categories:
                // 1: tasks, 2: messages, 3: announcements, 4: recents
                $scope.notifications = {1: [], 2: [], 3: [], 4: []};

                angular.forEach(notifications, function (value, key) {
                    $scope.notifications[value.type].push(value);
                });
            };
            $scope.getNotifications = function () {
                // ignore loading bar here
                $http.get(RESTURL.url+"notify", {ignoreLoadingBar: true}).success(function (data) {
                    $scope.groupNotifications(data.notifications);
                    $rootScope.$broadcast("notifications", $scope.notifications);
                });
            };

            $scope.getNotifications();

            // check notifications every 5 seconds
            $interval(function () {
                if ($cookies.get("notificate") == "on") {
                    console.log('get notification call - interval');
                    $scope.getNotifications();
                }
            }, 5000);

            // when clicked mark as read notification
            // it can be list of notifications
            $scope.markAsRead = function (items) {
                $http.post(RESTURL.url+"notify", {ignoreLoadingBar: true, read: [items]})
                    .success(function (data) {
                        $scope.groupNotifications(data.notifications);
                        $rootScope.$broadcast("notifications", $scope.notifications);
                    });
            };

            // if markasread triggered outside the directive
            $scope.$on("markasread", function (event, data) {
                $scope.markAsRead(data);
            });
        }
    };
});

/**
 * collapseMenu directive
 * toggle collapses sidebar menu when clicked menu button
 */

app.directive('collapseMenu', function ($timeout) {
    return {
        templateUrl: 'shared/templates/directives/menuCollapse.html',
        restrict: 'E',
        replace: true,
        scope: {},
        controller: function ($scope, $rootScope) {
            $rootScope.collapsed = false;
            $rootScope.sidebarPinned = false;

            $scope.collapseToggle = function () {
                if ($rootScope.collapsed === false) {
                    jQuery(".sidebar").css("width" , "62px");
					jQuery(".manager-view").css("width" , "calc(100% - 62px)");
                    $rootScope.collapsed = true;
                    $rootScope.sidebarPinned = false;
                } else {
					jQuery("span.menu-text, span.arrow, .sidebar footer").fadeIn(400);
                    jQuery(".sidebar").css("width" , "250px");
					jQuery(".manager-view").css("width" , "calc(100% - 250px)");
                    $rootScope.collapsed = false;
                    $rootScope.sidebarPinned = true;
                }
            };

            $timeout(function(){
                $scope.collapseToggle();
            });
        }
    };
});

/**
 * headerSubmenu directive
 * todo: will be deleted
 */

app.directive('headerSubMenu', function () {
    return {
        templateUrl: 'shared/templates/directives/header-sub-menu.html',
        restrict: 'E',
        controller: "CRUDAddEditCtrl",
        replace: true,
        link: function ($scope) {
            $scope.triggerSubmit = function () {
                // todo: double make it but single not solve this!
                angular.element($('#submitbutton')).triggerHandler('click');
                angular.element($('#submitbutton')).triggerHandler('click');
            };
        }
    };
});

/**
 * breadcrumb directive
 * produces breadcrumb with related links
 */

app.directive('headerBreadcrumb', function () {
    return {
        templateUrl: 'shared/templates/directives/header-breadcrumb.html',
        restrict: 'E',
        replace: true
    };
});

/**
 * selected user directive
 */

app.directive('selectedUser', function () {
    return {
        templateUrl: 'shared/templates/directives/selected-user.html',
        restrict: 'E',
        replace: false,
        link: function ($scope, $rootScope) {
            $scope.selectedUser = $rootScope.selectedUser;
        }
    };
});

/**
 * sidebar directive
 * changes breadcrumb when an item selected
 * consists of menu items of related user or transaction
 * controller communicates with dashboard controller to shape menu items and authz
 */

app.directive('sidebar', ['$location', function () {
    return {
        templateUrl: 'shared/templates/directives/sidebar.html',
        restrict: 'E',
        replace: true,
        scope: {},
        controller: function ($scope, $rootScope, $cookies, $route, $http, RESTURL, $location, $timeout) {
            var sidebarmenu = $('#side-menu');
            sidebarmenu.metisMenu();
            $http.get(RESTURL.url + 'menu/')
                .success(function (data) {
                    $scope.allMenuItems = angular.copy(data);

                    // broadcast for authorized menu items, consume in dashboard
                    $rootScope.$broadcast("authz", data);

                    $scope.menuItems = {"other": $scope.allMenuItems.other};

                    // if selecteduser on cookie then add related part to the menu

                    //if ($cookies.get("selectedUserType")) {
                    //    $scope.menuItems[$cookies.get("selectedUserType")] = $scope.allMenuItems[$cookies.get("selectedUserType")];
                    //}

                    $timeout(function(){sidebarmenu.metisMenu()});
                });

            // changing menu items by listening for broadcast

            $scope.$on("menuitems", function (event, data) {
                $scope.menuItems[data] = $scope.allMenuItems[data];
                $scope.menuItems["other"] = $scope.allMenuItems['other'];
                $timeout(function(){sidebarmenu.metisMenu()});
            });

            $scope.openSidebar = function () {
                if ($rootScope.sidebarPinned === false) {
                    jQuery("span.menu-text, span.arrow, .sidebar footer, #side-menu").fadeIn(400);
                    jQuery(".sidebar").css("width" , "250px");
                    jQuery(".manager-view").css("width" , "calc(100% - 250px)");
                    $rootScope.collapsed = false;
                }
            };

            $scope.closeSidebar = function () {
                if ($rootScope.sidebarPinned === false) {
                    jQuery(".sidebar").css("width" , "62px");
                    jQuery(".manager-view").css("width" , "calc(100% - 62px)");
                    $rootScope.collapsed = true;
                }
            };

            $rootScope.$watch(function ($rootScope) {return $rootScope.section; },
                function (newindex, oldindex) {
                    if (newindex > -1) {
                        $scope.menuItems = [$scope.allMenuItems[newindex]];
                        $scope.collapseVar = 1;
                    }
                });

            $scope.selectedMenu = $location.path();
            $scope.collapseVar = 0;
            $scope.multiCollapseVar = 0;

            $scope.check = function (x) {

                if (x === $scope.collapseVar) {
                    $scope.collapseVar = 0;
                } else {
                    $scope.collapseVar = x;
                }

            };

            // breadcrumb function changes breadcrumb items and itemlist must be list
            $scope.breadcrumb = function (itemlist, $event) {
                //if ($event.target.href==location.href) {
                //    $route.reload();
                //}
                $rootScope.breadcrumblinks = itemlist;
                // showSaveButton is used for to show or not to show save button on top of the page
                // todo: remove button
                $rootScope.showSaveButton = false;
            };

            $scope.multiCheck = function (y) {

                if (y === $scope.multiCollapseVar) {
                    $scope.multiCollapseVar = 0;
                } else {
                    $scope.multiCollapseVar = y;
                }
            };
        }
    };
}]);

app.directive('stats', function () {
    return {
        templateUrl: 'shared/templates/directives/stats.html',
        restrict: 'E',
        replace: true,
        scope: {
            'model': '=',
            'comments': '@',
            'number': '@',
            'name': '@',
            'colour': '@',
            'details': '@',
            'type': '@',
            'goto': '@'
        }

    };
});

/**
 * header menu notifications directive
 */

app.directive('notifications', function () {
    return {
        templateUrl: 'shared/templates/directives/notifications.html',
        restrict: 'E',
        replace: true
    };
});

/**
 * search directive in sidebar
 */

app.directive('sidebarSearch', function () {
    return {
        templateUrl: 'shared/templates/directives/sidebar-search.html',
        restrict: 'E',
        replace: true,
        scope: {},
        controller: function ($scope) {
            $scope.selectedMenu = 'home';
        }
    };
});

//app.directive('timeline', function () {
//    return {
//        templateUrl: 'shared/templates/directives/timeline.html',
//        restrict: 'E',
//        replace: true,
//    };
//});
//
//app.directive('chat', function () {
//    return {
//        templateUrl: 'shared/templates/directives/chat.html',
//        restrict: 'E',
//        replace: true,
//    };
//});