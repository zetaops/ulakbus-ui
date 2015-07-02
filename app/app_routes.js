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
            templateUrl: 'components/staff/templates/edit.html',
            controller: 'StaffEditCtrl',
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
}).config(['$httpProvider', function ($httpProvider) {
    /**
     * the interceptor for all requests to check response
     * 4xx - 5xx errors will be handled here
     */
    $httpProvider.interceptors.push(function ($q) {
        return {
            'response': function (response) {
                //Will only be called for HTTP up to 300
                return response;
            },
            'responseError': function (rejection) {
                // if unauthorized then redirect to login page
                if(rejection.status === 400) {
                    location.reload();
                }
                if(rejection.status === 401) {
                    location.path('#/login');
                }
                return $q.reject(rejection);
            }
        };
    });
}]);