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
        .when('/staff/add', {
            templateUrl: 'components/staff/staff_add_template.html',
            controller: 'StaffAddCtrl',
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
            templateUrl: 'components/staff/staff_add_template.html',
            controller: 'StudentEditCtrl',
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
        .when('/staffs', {
            templateUrl: 'components/staff/staff_list_template.html',
            controller: 'StaffListCtrl',
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

    var sessionId = $cookies.get('session');
    $rootScope.loggedInUser = sessionId ? true : false;
    $rootScope.$on("$routeChangeStart", function (event, next, current) {
        if ($rootScope.loggedInUser == null) {
            // no logged user, redirect to /login
            if (next.templateUrl === "login/login.html") {
                console.log("test log to login");
            } else {
                console.log("test log logged");
                $location.path("/login");
            }
        }
    });
});