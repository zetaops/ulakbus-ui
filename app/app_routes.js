app.config(['$routeProvider', function ($routeProvider) {
    $routeProvider
        .when('/login', {
            templateUrl: 'login/login.html',
            controller: 'LoginCtrl',
            resolve: {
                loadMyCtrl: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load('login/login.js');
                }],
                loadMyService: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load('login/login_service.js');
                }]
            }
        })
        .when('/dashboard', {
            templateUrl: 'dashboard/dashboard.html',
            controller: 'DashCtrl',
            resolve: {
                loadMyCtrl: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load('dashboard/dashboard.js');
                }]
            }
        })
        .when('/student_add', {
            templateUrl: 'student/student_add_template.html',
            controller: 'StudentAddCtrl',
            resolve: {
                loadMyCtrl: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load('student/student_add.js');
                }],
                loadMyService: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load('forms/form_service.js');
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