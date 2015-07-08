app.config(['$routeProvider', function ($routeProvider) {
    $routeProvider
        .when('/login', {
            templateUrl: 'components/auth/login.html',
            controller: 'LoginCtrl',
            resolve: {
                loadMyCtrl: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load('components/auth/auth_controller.js');
                }],
                loadMyService: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load('components/auth/auth_service.js');
                }],
                loadMyService2: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load('zetalib/forms/form_service.js');
                }],
                loadMyService3: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load('zetalib/general.js');
                }]
            }
        })
        .when('/dashboard', {
            templateUrl: 'components/dashboard/dashboard.html',
            controller: 'DashCtrl',
            resolve: {
                loadMyCtrl: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load('components/dashboard/dashboard.js');
                }]
            }
        })
        .when('/student/add', {
            templateUrl: 'components/student/student_add_template.html',
            controller: 'StudentAddEditCtrl',
            resolve: {
                loadMyCtrl: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load('components/student/student_controller.js');
                }],
                loadMyService: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load('zetalib/forms/form_service.js');
                }],
                loadMyService2: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load('zetalib/general.js');
                }]
            }
        })
        .when('/student/edit/:id', {
            templateUrl: 'components/student/student_add_template.html',
            controller: 'StudentAddEditCtrl',
            resolve: {
                loadMyCtrl: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load('components/student/student_controller.js');
                }],
                loadMyService: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load('zetalib/forms/form_service.js');
                }],
                loadMyService2: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load('zetalib/general.js');
                }]
            }
        })
        .when('/students', {
            templateUrl: 'components/student/student_list_template.html',
            controller: 'StudentListCtrl',
            resolve: {
                loadMyCtrl: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load('components/student/student_controller.js');
                }],
                loadMyService: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load('zetalib/forms/form_service.js');
                }],
                loadMyService2: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load('zetalib/general.js');
                }]
            }
        })
        .when('/student/:id', {
            templateUrl: 'components/student/student_list_template.html',
            controller: 'StudentShowCtrl',
            resolve: {
                loadMyCtrl: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load('components/student/student_controller.js');
                }],
                loadMyService: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load('zetalib/forms/form_service.js');
                }],
                loadMyService2: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load('zetalib/general.js');
                }]
            }
        })
        .when('/staff/add', {
            templateUrl: 'components/staff/templates/add.html',
            controller: 'StaffAddEditCtrl',
            resolve: {
                loadMyCtrl: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load('components/staff/staff_controller.js');
                }],
                loadMyService: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load('zetalib/forms/form_service.js');
                }],
                loadMyService2: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load('zetalib/general.js');
                }]
            }
        })
        .when('/staff/edit/:id', {
            templateUrl: 'components/staff/templates/edit.html',
            controller: 'StaffAddEditCtrl',
            resolve: {
                loadMyCtrl: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load('components/staff/staff_controller.js');
                }],
                loadMyService: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load('zetalib/forms/form_service.js');
                }],
                loadMyService2: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load('zetalib/general.js');
                }]
            }
        })
        .when('/staffs', {
            templateUrl: 'components/staff/templates/list.html',
            controller: 'StaffListCtrl',
            resolve: {
                loadMyCtrl: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load('components/staff/staff_controller.js');
                }],
                loadMyService: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load('zetalib/forms/form_service.js');
                }],
                loadMyService2: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load('zetalib/general.js');
                }]
            }
        })
        .when('/staff/:id', {
            templateUrl: 'components/staff/templates/show.html',
            controller: 'StaffShowCtrl',
            resolve: {
                loadMyCtrl: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load('components/staff/staff_controller.js');
                }],
                loadMyService: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load('zetalib/forms/form_service.js');
                }],
                loadMyService2: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load('zetalib/general.js');
                }]
            }
        })
        .when('/input_types', {
            templateUrl: 'components/types/types_template.html',
            controller: 'TypeCtrl',
            resolve: {
                loadMyCtrl: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load('components/types/types_controller.js');
                }],
                loadMyService: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load('zetalib/forms/form_service.js');
                }]
            }
        })
        .otherwise({redirectTo: '/dashboard'});
}]).run(function ($rootScope, $location, $cookies) {
    /**
     * todo: below session id is temporary session_id
     * the login logic will be finished when backend complete
     *
     */

    //$rootScope.loggedInUser ? $rootScope.loggedInUser : false;
    //$rootScope.$on("$routeChangeStart", function (event, next, current) {
    //    if ($rootScope.loggedInUser == null) {
    //        // no logged user, redirect to /login
    //        console.log($rootScope.loggedInUser);
    //        if (next.templateUrl === "login/login.html") {
    //
    //        } else {
    //            $location.path("/login");
    //        }
    //    }
    //});
}).config(['$httpProvider', function($httpProvider) {
    // to send cookies CORS
    $httpProvider.defaults.withCredentials = true;
}]);