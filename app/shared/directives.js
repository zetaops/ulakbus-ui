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
app.directive('headerNotification', function ($http, $interval, RESTURL) {
    return {
        templateUrl: 'shared/templates/directives/header-notification.html',
        restrict: 'E',
        replace: true,
        //link: function ($scope) {
        //    $interval(function () {
        //        // todo: change url to backend
        //        $http.post(RESTURL+"crud").success(function (data) {
        //            $scope.notifications = data;
        //        });
        //    }, 15000);
        //}
    };
});

app.directive('collapseMenu', function () {
    return {
        templateUrl: 'shared/templates/directives/menuCollapse.html',
        restrict: 'E',
        replace: true,
        link: function ($scope) {
            $scope.collapsed = false;
            $scope.collapseToggle = function () {
                if ($scope.collapsed === false) {
					jQuery("span.menu-text").css("display" , "none");
                    jQuery(".sidebar").css("width" , "62px");
					jQuery(".manager-view").css("z-index" , "9999").css("width" , "calc(100% - 62px)");
					jQuery(".sidebar footer").css("display" , "none");
                    $scope.collapsed = true;
                } else {
					jQuery("span.menu-text").fadeIn(400);
                    jQuery(".sidebar").css("z-index" , "0").css("width" , "250px");
					jQuery(".manager-view").css("width" , "calc(100% - 250px)");
					jQuery(".sidebar footer").fadeIn(400);
                    $scope.collapsed = false;
                }
            };
        }
    };
});

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

app.directive('headerBreadcrumb', function () {
    return {
        templateUrl: 'shared/templates/directives/header-breadcrumb.html',
        restrict: 'E',
        replace: true
    };
});

app.directive('sidebar', ['$location', function () {
    return {
        templateUrl: 'shared/templates/directives/sidebar.html',
        restrict: 'E',
        replace: true,
        scope: {},
        controller: function ($scope, $rootScope, $http, RESTURL, $location, $timeout) {
            $http.post(RESTURL.url + 'crud/').success(function (data) {
                $scope.allMenuItems = angular.copy(data.app_models);
                $scope.menuItems = []; // angular.copy($scope.allMenuItems);
                // at start define breadcrumblinks for breadcrumb
                angular.forEach(data.app_models, function (value, key) {
                    angular.forEach(value[1], function (v, k) {
                        if (v[1] === $location.path().split('/')[2]) {
                            $rootScope.breadcrumblinks = [value[0], v[0]];
                            $scope.menuItems = [$scope.allMenuItems[key]];
                        } else {
                            $rootScope.breadcrumblinks = ['Panel'];
                        }
                    });
                });
            });

            $rootScope.$watch(function ($rootScope) {return $rootScope.section; },
                function (newindex, oldindex) {
                    if (newindex > -1) {
                        $scope.menuItems = [$scope.allMenuItems[newindex]];
                        $scope.collapseVar = 1;
                        $timeout(function () {
                            $('#side-menu').metisMenu();
                        });
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
            $scope.breadcrumb = function (itemlist) {
                $rootScope.breadcrumblinks = itemlist;
                // showSaveButton is used for to show or not to show save button on top of the page
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

app.directive('notifications', function () {
    return {
        templateUrl: 'shared/templates/directives/notifications.html',
        restrict: 'E',
        replace: true,
    };
});

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

app.directive('timeline', function () {
    return {
        templateUrl: 'shared/templates/directives/timeline.html',
        restrict: 'E',
        replace: true,
    };
});

app.directive('chat', function () {
    return {
        templateUrl: 'shared/templates/directives/chat.html',
        restrict: 'E',
        replace: true,
    };
});