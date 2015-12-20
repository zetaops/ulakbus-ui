/**
 * @license Ulakbus-UI
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
    })

    /**
     * headerNotification directive for header
     */

    .directive('headerNotification', function ($http, $rootScope, $cookies, $interval, RESTURL) {
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
                    $http.get(RESTURL.url + "notify", {ignoreLoadingBar: true}).success(function (data) {
                        $scope.groupNotifications(data.notifications);
                        $rootScope.$broadcast("notifications", $scope.notifications);
                    });
                };

                $scope.getNotifications();

                // check notifications every 5 seconds
                $interval(function () {
                    if ($cookies.get("notificate") == "on") {
                        $scope.getNotifications();
                    }
                }, 5000);

                // when clicked mark as read notification
                // it can be list of notifications
                $scope.markAsRead = function (items) {
                    $http.post(RESTURL.url + "notify", {ignoreLoadingBar: true, read: [items]})
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
    })

    /**
     *
     */
    .directive('searchDirective', function (Generator, $log, $rootScope) {
        return {
            templateUrl: 'shared/templates/directives/search.html',
            restrict: 'E',
            replace: true,
            link: function ($scope) {
                $scope.searchForm = [{key: 'searchbox', htmlClass: "pull-left"}, {
                    type: "submit",
                    title: "Ara",
                    style: "btn-info",
                    htmlClass: "pull-left"
                }];
                $scope.searchSchema = {
                    type: "object",
                    properties: {
                        searchbox: {
                            type: "string",
                            minLength: 2,
                            title: "Ara",
                            "x-schema-form": {placeholder: "Arama kriteri giriniz..."}
                        }
                    },
                    required: []
                };
                $scope.searchModel = {searchbox: ''};

                $scope.searchSubmit = function (form) {
                    $scope.$broadcast('schemaFormValidate');
                    if (form.$valid) {
                        var searchparams = {
                            url: $scope.wf,
                            token: $scope.$parent.token,
                            object_id: $scope.$parent.object_id,
                            form_params: {
                                model: $scope.$parent.form_params.model,
                                cmd: $scope.$parent.reload_cmd,
                                flow: $scope.$parent.form_params.flow,
                                param: 'query',
                                id: $scope.searchModel.searchbox
                            }
                        };

                        Generator.submit(searchparams).success(function (data) {
                            // update objects item of page scope
                            $rootScope.$broadcast('updateObjects', data.objects);
                        });
                    }
                };
            }
        };
    })

    /**
     *
     */
    .directive('sortDirective', function (Generator, $log) {
        return {
            templateUrl: 'shared/templates/directives/sort.html',
            restrict: 'E',
            replace: true,
            link: function ($scope) {

                // titleMap will be list
                $scope.titleMap = [{value: "artan", name: "Artan"}, {value: "azalan", name: "Azalan"}];
                $scope.sortForm = [
                    {key: 'sortbox', htmlClass: "pull-left", type: "select", titleMap: $scope.titleMap},
                    {type: "submit", title: "Sırala", htmlClass: "pull-left"}];
                $scope.sortSchema = {
                    type: "object",
                    properties: {
                        sortbox: {
                            type: "select",
                            title: "Sırala"
                        }
                    },
                    required: ['sortbox']
                };
                $scope.sortModel = {sortbox: ''};

                $scope.sortSubmit = function (form) {
                    $scope.$broadcast('schemaFormValidate');
                    if (form.$valid) {
                        var sortparams = {
                            url: $scope.wf,
                            token: $scope.$parent.token,
                            object_id: $scope.$parent.object_id,
                            form_params: {
                                model: $scope.$parent.form_params.model,
                                cmd: $scope.$parent.reload_cmd,
                                flow: $scope.$parent.form_params.flow,
                                param: 'sort',
                                id: $scope.sortModel.sortbox
                            }
                        };

                        Generator.submit(sortparams);
                    }
                }
            }
        };
    })


    /**
     * collapseMenu directive
     * toggle collapses sidebar menu when clicked menu button
     */

    .directive('collapseMenu', function ($timeout, $window, $cookies) {
        return {
            templateUrl: 'shared/templates/directives/menuCollapse.html',
            restrict: 'E',
            replace: true,
            scope: {},
            controller: function ($scope, $rootScope) {
                $rootScope.collapsed = false;
                $rootScope.sidebarPinned = $cookies.get('sidebarPinned') || 0;

                $scope.collapseToggle = function () {
                    if ($window.innerWidth > '768') {
                        if ($rootScope.collapsed === false) {
                            jQuery(".sidebar").css("width", "62px");
                            jQuery(".manager-view").css("width", "calc(100% - 62px)");
                            $rootScope.collapsed = true;
                            $rootScope.sidebarPinned = 0;
                            $cookies.put('sidebarPinned', 0);
                        } else {
                            jQuery("span.menu-text, span.arrow, .sidebar footer").fadeIn(400);
                            jQuery(".sidebar").css("width", "250px");
                            jQuery(".manager-view").css("width", "calc(100% - 250px)");
                            $rootScope.collapsed = false;
                            $rootScope.sidebarPinned = 1;
                            $cookies.put('sidebarPinned', 1);
                        }
                    }
                };

                $timeout(function () {
                    if ($cookies.get('sidebarPinned') === "0") {
                        $scope.collapseToggle();
                    }
                });
            }
        };
    })

    /**
     * headerSubmenu directive
     */

    .directive('headerSubMenu', function ($location) {
        return {
            templateUrl: 'shared/templates/directives/header-sub-menu.html',
            restrict: 'E',
            //controller: "CRUDAddEditCtrl",
            replace: true,
            link: function ($scope) {
                $scope.style = 'width:calc(100% - 300px);';
                $scope.$on('$routeChangeStart', function () {
                    $scope.style = $location.path() === '/dashboard' ? 'width:calc(100% - 300px);' : 'width:%100 !important;';
                });
            }
        };
    })

    /**
     * breadcrumb directive
     * produces breadcrumb with related links
     */

    .directive('headerBreadcrumb', function ($location) {
        return {
            templateUrl: 'shared/templates/directives/header-breadcrumb.html',
            restrict: 'E',
            replace: false,
            link: function ($scope) {
                $scope.goBack = function () {
                    $location.state();
                }
            }
        };
    })

    /**
     * selected user directive
     * todo: unused
     */

    .directive('selectedUser', function ($http, RESTURL) {
        return {
            templateUrl: 'shared/templates/directives/selected-user.html',
            restrict: 'E',
            replace: true,
            link: function ($scope, $rootScope) {
                $scope.$on('selectedUser', function ($event, data) {
                    $scope.selectedUser = data;
                    $scope.dynamicPopover = {
                        content: '',
                        name: data.name,
                        tcno: data.tcno,
                        key: data.key,
                        templateUrl: 'shared/templates/directives/selectedUserPopover.html',
                        title: 'İşlem Yapılan Kişi'
                    };
                });
                $scope.$on('selectedUserTrigger', function ($event, data) {
                    var postToApi = {model: 'Personel', cmd: 'show', id: data[1]};
                    //postToApi[data[0]]=data[1];
                    $http.get(RESTURL.url + 'ara/personel/' + data[1]).success(
                        function (data) {
                        }
                    );
                })
            }
        };
    })

    /**
     * sidebar directive
     * changes breadcrumb when an item selected
     * consists of menu items of related user or transaction
     * controller communicates with dashboard controller to shape menu items and authz
     */

    .directive('sidebar', ['$location', function () {
        return {
            templateUrl: 'shared/templates/directives/sidebar.html',
            restrict: 'E',
            replace: true,
            scope: {},
            controller: function ($scope, $rootScope, $cookies, $route, $http, RESTURL, $location, $window, $timeout) {
                $scope.prepareMenu = function (menuItems) {
                    var newMenuItems = {};
                    angular.forEach(menuItems, function (value, key) {
                        angular.forEach(value, function (v, k) {
                            newMenuItems[k] = v;
                        });
                    });
                    return newMenuItems;
                };

                var sidebarmenu = $('#side-menu');
                var sidebarUserMenu = $('#side-user-menu');
                sidebarmenu.metisMenu();
                $http.get(RESTURL.url + 'menu/')
                    .success(function (data) {
                        $scope.allMenuItems = angular.copy(data);

                        // regroup menu items based on their category
                        function reGroupMenuItems(items, baseCategory) {
                            var newItems = {};
                            angular.forEach(items, function (value, key) {
                                newItems[value.kategori] = newItems[value.kategori] || [];
                                value['baseCategory'] = baseCategory;
                                newItems[value.kategori].push(value);
                            });
                            return newItems;
                        }

                        angular.forEach($scope.allMenuItems, function (value, key) {
                            $scope.allMenuItems[key] = reGroupMenuItems(value, key);
                        });

                        // broadcast for authorized menu items, consume in dashboard to show search inputs and/or
                        // related items
                        $rootScope.$broadcast("authz", data);

                        $scope.menuItems = $scope.prepareMenu({other: $scope.allMenuItems.other});

                        // if selecteduser on cookie then add related part to the menu

                        //if ($cookies.get("selectedUserType")) {
                        //    $scope.menuItems[$cookies.get("selectedUserType")] = $scope.allMenuItems[$cookies.get("selectedUserType")];
                        //}

                        $timeout(function () {
                            sidebarmenu.metisMenu();
                            sidebarUserMenu.metisMenu();
                        });
                    });

                // changing menu items by listening for broadcast

                $scope.$on("menuitems", function (event, data) {
                    var menu = {};
                    menu[data] = $scope.allMenuItems[data];
                    //menu['other'] = $scope.allMenuItems.other;
                    $scope.selectedMenuItems = $scope.prepareMenu(menu);
                    $timeout(function () {
                        sidebarmenu.metisMenu();
                        sidebarUserMenu.metisMenu();

                    });
                });

                $scope.$on('selectedUser', function ($event, data) {
                    $scope.selectedUser = data;
                });

                $scope.deselectUser = function () {
                    delete $scope.selectedUser;
                    delete $scope.selectedMenuItems;
                };

                $scope.openSidebar = function () {
                    if ($window.innerWidth > '768') {
                        if ($rootScope.sidebarPinned === 0) {
                            jQuery("span.menu-text, span.arrow, .sidebar footer, #side-menu").fadeIn(400);
                            jQuery(".sidebar").css("width", "250px");
                            jQuery(".manager-view").css("width", "calc(100% - 250px)");
                            $rootScope.collapsed = false;
                        }
                    }
                };

                $scope.closeSidebar = function () {
                    if ($window.innerWidth > '768') {
                        if ($rootScope.sidebarPinned === 0) {
                            jQuery(".sidebar").css("width", "62px");
                            jQuery(".manager-view").css("width", "calc(100% - 62px)");
                            $rootScope.collapsed = true;
                        }
                    }
                };

                $rootScope.$watch(function ($rootScope) {
                        return $rootScope.section;
                    },
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
                    $rootScope.breadcrumblinks = itemlist;
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
    }])

    .directive('stats', function () {
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
    })

    /**
     * header menu notifications directive
     */

    .directive('notifications', function () {
        return {
            templateUrl: 'shared/templates/directives/notifications.html',
            restrict: 'E',
            replace: true
        };
    })

    /**
     * msgbox directive
     */

    .directive('msgbox', function () {
        return {
            templateUrl: 'shared/templates/directives/msgbox.html',
            restrict: 'E',
            replace: false
        };
    })


    /**
     * alert directive
     */

    .directive('alertBox', function ($timeout) {
        return {
            templateUrl: 'shared/templates/directives/alert.html',
            restrict: 'E',
            replace: true,
            link: function ($scope) {
                $scope.$on('alertBox', function ($event, data) {
                    $timeout(function () {
                        delete $scope.alerts;
                    }, 5000);
                    $scope.alerts = [data];
                });
            }
        };
    })

    /**
     * search directive in sidebar
     */

    .directive('sidebarSearch', function () {
        return {
            templateUrl: 'shared/templates/directives/sidebar-search.html',
            restrict: 'E',
            replace: true,
            scope: {},
            controller: function ($scope) {
                $scope.selectedMenu = 'home';
            }
        };
    })

    .directive("fileread", function ($timeout) {
        return {
            scope: {
                fileread: "="
            },
            link: function (scope, element, attributes) {
                element.bind("change", function (changeEvent) {
                    var reader = new FileReader();
                    reader.onload = function (loadEvent) {
                        scope.$apply(function () {
                            scope.fileread = loadEvent.target.result;
                        });
                        $timeout(function () {
                            scope.$parent.model[changeEvent.target.name] = {
                                file_name: changeEvent.target.files[0].name,
                                file_content: scope.$parent.model[changeEvent.target.name]
                            }
                        });
                    }
                    reader.readAsDataURL(changeEvent.target.files[0]);
                });
            }
        }
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