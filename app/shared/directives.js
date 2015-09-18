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
                    console.log($rootScope.loggedInUser);
                    $location.path("/login");
                    $scope.$apply();
                });
            });
        }
    }
});

/**
 * headerNotification directive for header
 */
app.directive('headerNotification', function () {
    return {
        templateUrl: 'shared/templates/directives/header-notification.html',
        restrict: 'E',
        replace: true
    }
});

app.directive('headerSubMenu', function () {
    return {
        templateUrl: 'shared/templates/directives/header-sub-menu.html',
        restrict: 'E',
        controller: "CRUDAddEditCtrl",
        replace: true,
        link: function($scope){
            $scope.triggerSubmit = function() {
                // todo: double make it but single not solve this!
                angular.element($('#submitbutton')).triggerHandler('click');
                angular.element($('#submitbutton')).triggerHandler('click');
            }
        }
    }
});

app.directive('headerBreadcrumb', function ($location) {
    return {
        templateUrl: 'shared/templates/directives/header-breadcrumb.html',
        restrict: 'E',
        replace: true,
        link: function($scope){
            $scope.$watch('$routeUpdate', function(){
                // todo: create actual links
                //debugger;
                $scope.links = $location.path().split('/');
            });
        }
    }
});

app.directive('sidebar', ['$location', function () {
    return {
        templateUrl: 'shared/templates/directives/sidebar.html',
        restrict: 'E',
        replace: true,
        scope: {},
        controller: function ($scope, $http, RESTURL) {
            $http.post(RESTURL.url + 'crud/').success(function (data) {
                $scope.menuItems = data.app_models;
            });

            $scope.selectedMenu = 'dashboard';
            $scope.collapseVar = 0;
            $scope.multiCollapseVar = 0;

            $scope.check = function (x) {

                if (x == $scope.collapseVar)
                    $scope.collapseVar = 0;
                else
                    $scope.collapseVar = x;
            };

            $scope.multiCheck = function (y) {

                if (y == $scope.multiCollapseVar)
                    $scope.multiCollapseVar = 0;
                else
                    $scope.multiCollapseVar = y;
            };
        }
    }
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

    }
});

app.directive('notifications', function () {
    return {
        templateUrl: 'shared/templates/directives/notifications.html',
        restrict: 'E',
        replace: true,
    }
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
    }
});

app.directive('timeline', function () {
    return {
        templateUrl: 'shared/templates/directives/timeline.html',
        restrict: 'E',
        replace: true,
    }
});

app.directive('chat', function () {
    return {
        templateUrl: 'shared/templates/directives/chat.html',
        restrict: 'E',
        replace: true,
    }
});