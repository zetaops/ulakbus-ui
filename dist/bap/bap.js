/**
 * @license Ulakbus-UI
 * Copyright (C) 2015 ZetaOps Inc.
 *
 * This file is licensed under the GNU General Public License v3
 * (GPLv3).  See LICENSE.txt for details.
 */

'use strict';

/**
 * @ngdoc module
 * @name ulakbusBap
 * @module ulakbusBap
 * @description ulakbusBap module is the public module of ulakbus-ui.
 *
 */
angular.module(
    'ulakbusBap', [
        //'ui.bootstrap',
        'ngRoute',
        'ngSanitize',
        'ulakbus.formService',
        'ulakbus.crud',
        'ngCookies',
        'ui.select',
        'markdown',
        'ui.bootstrap',
        // @if NODE_ENV='PRODUCTION'
        'templates-prod',
        'templates-prod_bap'
        // @endif
        // @if NODE_ENV='DEVELOPMENT'
        // @endif
    ])
/**
 * @memberof ulakbusBap
 * @ngdoc constant
 * @name RESTURL
 * @description RESTURL is the url of rest api to talk.
 * Based on the environment it changes from dev to prod.
 *
 * For development needs backendurl can be switched from both dev/settings page and querystring `?backendurl=http://example.com`
 */
// todo: convert it to service
    .constant("RESTURL", (function () {
        // todo: below backendurl definition is for development purpose and will be deleted
        var backendurl = location.href.indexOf('nightly') > -1 ? "//nightly.api.ulakbus.net/" : "//api.ulakbus.net/";
        if (document.cookie.indexOf("backendurl") > -1) {
            var cookiearray = document.cookie.split(';');
            angular.forEach(cookiearray, function (item) {
                if (item.indexOf("backendurl") > -1) {
                    backendurl = item.split('=')[1];
                    if (backendurl.slice(-1) !== '/')  {backendurl += '/'}
                    if (backendurl.substring(0,4) !== 'http')  {backendurl = 'http://'+backendurl}
                }
            });
        }

        if (location.href.indexOf("backendurl") > -1) {
            var urlfromqstr = location.href.split('?')[1].split('=')[1];
            backendurl = decodeURIComponent(urlfromqstr.replace(/\+/g, " "));
            if (backendurl.slice(-1) !== '/')  {backendurl += '/'}
            if (backendurl.substring(0,4) !== 'http')  {backendurl = 'http://'+backendurl}
            document.cookie = "backendurl=" + backendurl;
            window.location.href = window.location.href.split('?')[0];
        }

        // add proto definition if not set
        if (backendurl.indexOf("http") != 0){
            var proto = window.location.href.split("/")[0];
            backendurl = proto + backendurl;
        }

        return {
            url: backendurl,
            ws : backendurl.replace('http', 'ws')+"ws"
        };
    })())

    .constant('toastr', window.toastr);


/**
 * @license Ulakbus-UI
 * Copyright (C) 2015 ZetaOps Inc.
 *
 * This file is licensed under the GNU General Public License v3
 * (GPLv3).  See LICENSE.txt for details.
 */
'use strict';

angular.module('ulakbusBap')
    .config(['$routeProvider', function ($routeProvider, $route) {
        $routeProvider
            .when('/bap_anasayfa', {
                templateUrl: '/components/bapComponents/dashboard.html'
            })
            .when('/:wf/', {
                templateUrl: '/components/crud/templates/crud-preload.html',
                controller: 'BapCRUDController'
            })
            .when('/:wf/do/:cmd', {
                templateUrl: '/components/crud/templates/crud.html',
                controller: 'BapCRUDListFormController'
            })
            .otherwise({redirectTo: '/bap_anasayfa'});
    }])

    .run(function ($rootScope) {
        //reset the value of user interaction on form when page refreshes
        $rootScope.isUserClicked = false;
    })

    .config(['$httpProvider', function ($httpProvider) {
        /**
         * @memberof ulakbusBap
         * @ngdoc interceptor
         * @name http_interceptor
         * @description The http interceptor for all requests and responses to check and config payload and response
         * objects.
         * - To prevent OPTIONS preflight request change header Content-Type to `text/plain`.
         * - 4xx - 5xx errors are handled in response objects.
         * - `_debug_queries` is helper object for development purposes to see how long the queries lasts.
         *   They are shown in /debug/list' page.
         * - API returns `is_login` key to check if current user is authenticated. Interceptor checks and if not logged
         *   in redirects to login page.
         */
        $httpProvider.interceptors.push(function ($rootScope , toastr) {
            return {
                'request': function (config) {
                    if (config.method === "POST") {
                        // to prevent OPTIONS preflight request
                        config.headers["Content-Type"] = "text/plain";
                    }
                    return config;
                },
                'response': function (response) {
                    //Will only be called for HTTP up to 300

                    if (response.data._debug_queries) {
                        if (response.data._debug_queries.length > 0) {
                            $rootScope.debug_queries = $rootScope.debug_queries || [];
                            $rootScope.debug_queries.push({
                                "url": response.config.url,
                                "queries": response.data._debug_queries
                            });
                        }
                    }
                    // handle toast notifications here
                    if (response.data.notify) {toastr.info(response.data.notify)}

                    if (response.data.error) {
                        //not authorized
                        if(response.data.code === 401){
                            var protocol = window.location.protocol;
                            var host = window.location.host;
                            //redirect to login page for wf that requires authentication
                            window.location.replace(protocol +'//'+ host +'/#/login');
                            return;
                        }else{
                            toastr.error(response.data.code)
                        }
                    }

                    return response;
                }
            };
        });

        $httpProvider.defaults.withCredentials = true;

    }]);

/**
 * @license Ulakbus-UI
 * Copyright (C) 2015 ZetaOps Inc.
 *
 * This file is licensed under the GNU General Public License v3
 * (GPLv3).  See LICENSE.txt for details.
 */

'use strict';
angular.module('ulakbusBap')
    /**
     * @memberof ulakbusBap
     * @ngdoc controller
     * @name DashboardController
     * @description DashboardController controller is the main controller for BAP main page
     * This controller play important role in sending data to its child directives
     *
     * @returns {object}
     */
    .controller('DashboardController', function ($scope, $location, Generator, $http, toastr) {
        $scope.user_ready = false;
        //this will be API call in controller load
        $scope.dashboardData = {};
        var dashboardEndpoint = 'bap_anasayfa';
        $http.post(Generator.makeUrl(dashboardEndpoint), {})
            .success(function (response, status) {
                if(status===200){
                    $scope.dashboardData = response;
                }else{
                    toastr.error('Tekrar dene');
                }
                $scope.user_ready = true;
            });

        $scope.clickAnnouncement = function (announcement) {
            $location.path("/" + announcement.wf);
        };

        $scope.clickMore = function (workFlow) {
            $location.path("/" + workFlow);
        };
    })
    /**
     * @memberof ulakbusBap
     * @ngdoc controller
     * @name BapCRUDController
     * @description CRUDController controller is base controller for crud module to redirect to related controller
     * This controller play an empty role for api calls.
     * With response data, location path change to related controller
     *
     * @returns {object}
     */
    .controller('BapCRUDController', function ($scope, $routeParams, $location, Generator) {
        // get required params by calling Generator.generateParam function
        if ($location.url().indexOf('?=') > 0) {
            return $location.url($location.url().replace('?=', ''));
        }
        // before calling get_wf parameters need to be generated with Generator.generateParam
        Generator.generateParam($scope, $routeParams);
        Generator.get_wf($scope);
    })

    /**
     * @memberof ulakbusBap
     * @ngdoc controller
     * @name BapCRUDListFormController
     * @description CRUDListFormController is the main controller for crud module
     * Based on the client_cmd parameter it generates its scope items.
     * client_cmd can be in ['show', 'list', 'form', 'reload', 'refresh']
     * There are 3 directives to manipulate controllers scope objects in crud.html
     * <br>
     * The controller works in 2 ways, with and without pageData.
     * pageData is generated by formService.Generator and it contains data to manipulate page.
     * If pageData has set, using Generator's getPageData() function, sets its scope items. After getting pageData
     * pageData must be set to `{pageData: false}` for clear scope of next job.
     * <br>
     * If pageData has not set using Generator's get_wf() function gets scope items from api call.
     *
     * @returns {object}
     */
    .controller('BapCRUDListFormController', function ($scope, $rootScope, $location, $sce, $http, $log, $uibModal, $timeout, Generator, $routeParams) {
        // below show crud and $on --> $viewContentLoaded callback is for masking the view with unrendered and ugly html
        $scope.show_crud = false;
        $scope.$on('$viewContentLoaded', function () {
            $timeout(function () {
                $scope.show_crud = true;
            }, 500);
        });

        // todo: new feature wf_step is for to start a workflow from a certain step
        $scope.wf_step = $routeParams.step;

        // pagination data is coming from api when too much results
        $scope.$watch("pagination.page", function(newVal, oldVal) {
            if (newVal === oldVal) return;
            var reloadPage= {page: $scope.pagination.page};
            $scope.form_params.cmd = $scope.reload_cmd;
            $scope.form_params = angular.extend($scope.form_params, reloadPage);
            $log.debug('reload data', $scope);
            Generator.get_wf($scope);
        });
        // reload_cmd can be broadcasted app-wide, when $on it reloadCmd is called
        $scope.$on('reload_cmd', function(event, data){
            $scope.reload_cmd = data;
            $scope.reloadCmd();
        });

        // search directive updates objects after search results
        $scope.$on('updateObjects', function ($event, data) {
            $scope.objects = data;
            Generator.listPageItems($scope, {objects: $scope.objects});
        });

        // we use form generator for generic forms. this makes form's scope to confuse on the path to generate form
        // object by its name. to manage to locate the form to controllers scope we use a directive called form locator
        // a bit dirty way to find form working on but solves our problem
        $scope.$on('formLocator', function (event) {
            $scope.formgenerated = event.targetScope.formgenerated;
        });

        // remove function removes node or listnode item from model data
        $scope.remove = function (item, type, index) {
            if(angular.isDefined($scope[type][item.title])){
                $scope[type][item.title].model.splice(index, 1);
                $scope[type][item.title].items.splice(index, 1);
            }else{
                $scope[type][item.schema.model_name].model.splice(index, 1);
                $scope[type][item.schema.model_name].items.splice(index, 1);
            }
        };

        $scope.onSubmit = function (form) {
            $scope.$broadcast('schemaFormValidate');
            if (form.$valid) {
                Generator.submit($scope);
            }
        };

        $scope.do_action = function (key, todo) {
            //indicate that the user have clicked some button like edit/delete on form
            $rootScope.isUserClicked = true;
            Generator.doItemAction($scope, key, todo, todo.mode || 'normal');
        };

        $scope.getNumber = function (num) {
            return new Array(num);
        };

        $scope.markdownWorkaround = function (value) {
            // this is new line workaround for markdown support
            // kind of ugly hack
            return typeof value === 'string' ? value.replace('\n', '<br>'): value;
        };

        // inline edit fields
        $scope.datepickerstatuses = {};

        $scope.inline_datepicker_status = function (field) {
            return ($scope.datepickerstatuses[field] || false);
        };

        $scope.openDatepicker = function (field) {
            $scope.datepickerstatuses[field] = true;
        };

        $scope.createListObjects = function () {
            if ($scope.object.constructor === Array) {
                $log.debug('new type show object')
            } else {
                if ($scope.object.type) {
                    $scope.object = [$scope.object];
                } else {
                    $scope.object = [{type: 'table', fields: angular.copy($scope.object)}];
                }
            }
        };

        $scope.showCmd = function () {
            Generator.generateParam($scope, $routeParams, $routeParams.cmd);
            // todo: refactor createListObjects func

            var pageData = Generator.getPageData();
            if (pageData.pageData === true) {
                $scope.object_title = pageData.object_title
                $scope.object = pageData.object;
                Generator.setPageData({pageData: false});
            }
            else {
                // call generator's get_single_item func
                Generator.get_wf($scope).then(function (res) {
                    $scope.object = res.data.object;
                    $scope.model = $routeParams.model;
                });
            }
            $scope.createListObjects();
        };

        // selective listing for list page todo: add to documentation
        $scope.update_selective_list = function (key) {
            $scope.objects = key["objects"];
        };
        // end of selective listing
        $scope.listFormCmd = function () {
            // function to set scope objects
            var setpageobjects = function (data) {
                Generator.listPageItems($scope, data);
                Generator.generate($scope, data);
                Generator.setPageData({pageData: false});
            };

            // get pageData from service
            var pageData = Generator.getPageData();

            // if pageData exists do not call get_wf function and manipulate page with pageData
            if (pageData.pageData === true) {
                $log.debug('pagedata', pageData.pageData);
                Generator.generateParam($scope, pageData, $routeParams.cmd);
                setpageobjects(pageData, pageData);
                if ($scope.second_client_cmd) {
                    $scope.createListObjects();
                }
            }
            // if pageData didn't defined or is {pageData: false} go get data from api with get_wf function
            if (pageData.pageData === undefined || pageData.pageData === false) {
                Generator.generateParam($scope, $routeParams, $routeParams.cmd);
                Generator.get_wf($scope);
            }

            if ($scope.object) {
                $scope.createListObjects();
            }

            // if selective listing then change objects key to its first item
            if (angular.isDefined($scope.meta) && angular.isDefined($scope.meta.selective_listing)) {
                $scope.all_objects = angular.copy($scope.objects);
                $scope.selective_list_key = $scope.all_objects[$scope.selected_key];
                $scope.objects = $scope.selective_list_key["objects"];
            }
        };
        $scope.reloadCmd = function () {
            var pageData = Generator.getPageData();
            Generator.generateParam($scope, pageData, $routeParams.cmd);
            $log.debug('reload data', $scope);
            Generator.get_wf($scope);
        };
        $scope.resetCmd = function () {
            var pageData = Generator.getPageData();
            Generator.generateParam($scope, pageData, $routeParams.cmd);
            delete $scope.token;
            delete $scope.filters;
            delete $scope.cmd;
            Generator.get_wf($scope);
        };

        var executeCmd = {
            show: $scope.showCmd,
            list: $scope.listFormCmd,
            form: $scope.listFormCmd,
            reload: $scope.reloadCmd,
            reset: $scope.resetCmd
        };

        return executeCmd[$routeParams.cmd]();

    })




/**
 * @license Ulakbus-UI
 * Copyright (C) 2015 ZetaOps Inc.
 *
 * This file is licensed under the GNU General Public License v3
 * (GPLv3).  See LICENSE.txt for details.
 */

'use strict';
angular.module('ulakbusBap')

/**
 * @memberof ulakbusBap
 * @ngdoc directive
 * @name leftMenu
 * @description Creates a left sidebar menu for the dashboard
 */
    .directive('leftMenu', function ($route) {
        return {
            templateUrl: '/components/bapComponents/left-menu.html',
            restrict: 'E',
            replace: true,
            scope: {
                menuItems:'='
            },
            controller: function ($scope) {
                $scope.selectedMenu = 0;
                //since the menuItems comes from the API call it is undefined when page load
                $scope.$watch('menuItems', function (newVal, oldVal) {
                    if(angular.isDefined(newVal)){
                        var pathParam =  $route.current.pathParams.wf;
                        for(var i=0; i<newVal.items.length; i++){
                            if(newVal.items[i].wf === pathParam){
                                $scope.selectedMenu = i;
                                break;
                            }
                        }
                    }
                });

                $scope.setActive = function (index) {
                    $scope.selectedMenu = index;
                };
            }
        };
    })
    /**
     * @memberof ulakbusBap
     * @ngdoc directive
     * @name leftMenu
     * @description Creates a left sidebar menu for the dashboard
     */
    .directive('topActionButtons', function () {
        return {
            templateUrl: '/components/bapComponents/top-action-buttons.html',
            restrict: 'E',
            replace: true,
            scope: {
                buttonList:'='
            },
            controller: function ($scope, $location) {
                $scope.setActive = function (index, button) {
                    $scope.selectedButton  = index;
                    $location.path("/"+button.wf);
                };

            }
        };
    })
    /**
     * @memberof ulakbusBap
     * @ngdoc directive
     * @name fileread
     * @description Fileread directive is responsible for reading uploaded file and replace it to related model item.
     */
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
                            //if not an image
                            var isImage = undefined;
                            if(changeEvent.target.files[0].type.indexOf('image') === -1){
                                isImage = false;
                            }else{
                                isImage = true;
                            }
                            scope.$parent.model[changeEvent.target.name] = {
                                file_name: changeEvent.target.files[0].name,
                                file_content: scope.$parent.model[changeEvent.target.name],
                                isImage :isImage
                            };
                            document.querySelector('#image-preview').src = URL.createObjectURL(changeEvent.target.files[0]);
                        });
                    };
                    reader.readAsDataURL(changeEvent.target.files[0]);
                });
            }
        }
    })
    /**
     * @memberof ulakbusBap
     * @ngdoc directive
     * @name alertBox
     * @description Triggers when `alertBox` broadcasted with alert data..
     */
    .directive('alertBox', function ($timeout) {
        return {
            templateUrl: '/shared/templates/directives/alert.html',
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
     * @memberof ulakbusBap
     * @ngdoc directive
     * @name msgbox
     * @description Holds msgbox template with related rootscope items.
     */
    .directive('msgbox', function () {
        return {
            templateUrl: '/shared/templates/directives/msgbox.html',
            restrict: 'E',
            replace: false
        };
    });


/**
 * @license Ulakbus-UI
 * Copyright (C) 2015 ZetaOps Inc.
 *
 * This file is licensed under the GNU General Public License v3
 * (GPLv3).  See LICENSE.txt for details.
 */

'use strict';
angular.module('ulakbusBap')
/**
 * @memberof ulakbusBap
 * @ngdoc factory
 * @name Generator
 * @description form service's Generator factory service handles all generic form operations
 */
.factory('Generator', function ($http, $q, $timeout, $sce, $location, $route, $compile, $log, RESTURL, $rootScope, Moment, $filter,wfMetadata) {
    var generator = {};
    /**
     * @memberof ulakbusBap
     * @ngdoc function
     * @name makeUrl
     * @description this function generates REST endpoint by combining backend url and the related wf name
     * @param wfName
     * @returns {string}
     */
    generator.makeUrl = function (wfName) {
        return RESTURL.url + wfName;
    };
    /**
     * @memberof ulakbusBap
     * @ngdoc function
     * @name generateParam
     * @description generateParam is a function to generate required params to send backend api.
     * backend needs that params to work without errors
     * @param {object} scope
     * @param {object} routeParams
     * @returns {object} scope
     */
    generator.generateParam = function (scope, routeParams) {
        scope.url = routeParams.wf;

        angular.forEach(routeParams, function (value, key) {
            if (key.indexOf('_id') > -1 && key !== 'param_id') {
                scope.param = key;
                scope.param_id = value;
            }
        });

        scope.form_params = {
            //cmd: cmd,
            // model name in ulakbus
            model: routeParams.model,
            // generic value passing by backend. would be any of these: id, personel_id, etc.
            param: scope.param || routeParams.param,
            // generic value passing by backend. would be the value of param
            id: scope.param_id || routeParams.param_id,
            wf: routeParams.wf,
            object_id: routeParams.key,
            filters: {},
            token: routeParams.token
        };

        if (scope.param_id) {
            scope.form_params.filters[scope.param] = {values: [scope.param_id], type: 'check'};
        }

        scope.model = scope.form_params.model;
        scope.wf = scope.form_params.wf;
        scope.param = scope.form_params.param;
        scope.param_id = scope.form_params.id;
        return scope;
    };

    /**
     * @memberof ulakbusBap
     * @ngdoc function
     * @name get_wf
     * @description get_wf is the main function for client_cmd based api calls
     * based on response content it redirects to related path/controller with pathDecider function
     * @param scope
     * @returns {*}
     */
    generator.get_wf = function (scope) {
        return $http.post(generator.makeUrl(scope.form_params.wf), scope.form_params)
            .success(function (response, status, headers, config) {
                wfMetadata.setWfMeta(response.wf_meta);
                return generator.pathDecider(response.client_cmd || ['list'], scope, response);
            });
    };
    /**
     * @memberof ulakbusBap
     * @ngdoc property
     * @name pageData
     * @description pageData object is moving object from response to controller
     * with this object controller will not need to call the api for response object to work on to
     * @type {{}}
     */
    generator.pageData = {};

    generator.getPageData = function () {
        return generator.pageData;
    };

    generator.setPageData = function (value) {
        generator.pageData = value;
    };

    /**
     * @memberof ulakbusBap
     * @ngdoc function
     * @name pathDecider
     * @description pathDecider is used to redirect related path by looking up the data in response
     * @param {string} client_cmd
     * @param {Object} $scope
     * @param {Object} data
     */
    generator.pathDecider = function (client_cmd, $scope, data) {
        /**
         * @memberof ulakbusBap
         * @ngdoc function
         * @name redirectTo
         * @description redirectTo function redirects to related controller and path with given data
         * before redirect setPageData must be called and pageData need to be defined
         * otherwise redirected path will call api for its data
         * @param {Object} scope
         * @param {string} page
         * @return {*}
         */
        function redirectTo(scope, page) {
            var pathUrl = '/' + scope.form_params.wf;
            if (scope.form_params.model) {
                pathUrl += '/' + scope.form_params.model + '/do/' + page;
            } else {
                pathUrl += '/do/' + page;
            }
            // todo add object url to path
            // pathUrl += '/'+scope.form_params.object_id || '';

            // if generated path url and the current path is equal route has to be reload
            if ($location.path() === pathUrl) {
                return $route.reload();
            } else {
                $location.path(pathUrl);
            }
        }

        /**
         * @memberof ulakbusBap
         * @ngdoc function
         * @name dispatchClientCmd
         * @description Sets params for scope to the related page and redirect to the page in client_cmd param.
         * client_cmd can be in ['list', 'form', 'show', 'reload', 'reset']
         */
        function dispatchClientCmd() {
            data[$scope.form_params.param] = $scope.form_params.id;
            data['model'] = $scope.form_params.model;
            data['wf'] = $scope.form_params.wf;
            data['param'] = $scope.form_params.param;
            data['param_id'] = $scope.form_params.id;
            data['pageData'] = true;
            //data['second_client_cmd'] = client_cmd[1];
            generator.setPageData(data);

            redirectTo($scope, client_cmd[0]);
        }

        dispatchClientCmd();
    };

    /**
     * @memberof ulakbusBap
     * @ngdoc function
     * @name generate
     * @description - generate function is inclusive for form generation
     * defines given scope's client_cmd, model, schema, form, token, object_id objects
     * @returns {*} scope
     * @param scope
     * @param data
     */
    generator.generate = function (scope, data) {

        $log.debug("data before generation:", data);
        // if no form in response (in case of list and single item request) return scope
        if (!data.forms) {
            return scope;
        }

        // prepare scope form, schema and model from response object
        angular.forEach(data.forms, function (value, key) {
            scope[key] = data.forms[key];
        });

        scope.client_cmd = data.client_cmd;

        scope.token = data.token;

        // initialModel will be used in formDiff when submiting the form to submit only
        scope.initialModel = angular.copy(scope.model);

        // if fieldset in form, make it collapsable with template
        //scope.listnodeform = {};
        //scope.isCollapsed = true;

        generator.prepareFormItems(scope);

        scope.object_id = scope.form_params.object_id;

        $log.debug('scope at after generate', scope);
        return scope;
    };

    /**
     * @memberof ulakbus.formService
     * @ngdoc function
     * @name submit
     * @description Submit function is generic function for submiting forms.
     * - redirectTo param is used for redirect if return value will be evaluated in a new page.
     * - In case of unformatted date object in any key recursively, it must be converted by convertDate function.
     * - ListNode and Node objects get seperated from model in
     * {@link prepareFormItems module:ulakbus.formService.function:prepareFormItems} They must be concat to model
     * key of scope first.
     * - Backend API waits form as model value. So `data.form` key must be set to `$scope.model`
     * - Other parameters we pass to backend API are shown in the example below
     * ```
     *  var data = {
                "form": $scope.model,
                "token": $scope.token,
                "model": $scope.form_params.model,
                "cmd": $scope.form_params.cmd,
                "flow": $scope.form_params.flow,
                "object_id": $scope.object_id,
                "filter": $scope.filter,
                "query": $scope.form_params.query
            };
     * ```
     *
     * Special response object process
     * -------------------------------
     *
     * - If response object is a downloadable pdf file, checking from headers `headers('content-type') ===
     * "application/pdf"` download using Blob object.
     *
     * @param {Object} $scope
     * @param {Object} redirectTo
     * @param {Boolean} dontProcessReply - used in modal forms
     * @returns {*}
     * @todo diff for all submits to recognize form change. if no change returns to view with no submit
     */
    generator.submit = function ($scope, redirectTo, dontProcessReply) {

        var checkAndReformatModel = function (model) {
            var modelKeys = Object.keys(model);
            for(var i=0; i < modelKeys.length; i++){
                if(typeof(model[modelKeys[i]]) === 'object'){
                    formatTypeaheadStructure(model[modelKeys[i]]);
                }
            }
        };
        var formatTypeaheadStructure = function (listNodeModel) {
            if(angular.isUndefined(listNodeModel) || listNodeModel === null || listNodeModel.length === 0 ){
                return;
            }
            for(var i=0; i<listNodeModel.length; i++){
                var key = Object.keys(listNodeModel[i]);
                if(key.length === 1){
                    var modelKeys = Object.keys(listNodeModel[i][key]);
                    if(modelKeys.indexOf('verbose_name') > -1 && modelKeys.indexOf('unicode') > -1 && modelKeys.indexOf('key') > -1 ){
                        var value = listNodeModel[i][key]['key'];
                        listNodeModel[i] = {};
                        listNodeModel[i][key] = value;
                    }
                }
            }
        };

        angular.forEach($scope.form, function (v, k) {
            if (typeof v === 'object' && v.templateUrl && v.templateUrl.indexOf("/select.html") != -1) {
                if ($scope.model[v.name] === "-1") {
                    delete $scope.model[v.name]
                }
            }
        });

        angular.forEach($scope.ListNode, function (value, key) {
            $scope.model[key] = value.model;
        });
        angular.forEach($scope.Node, function (value, key) {
            $scope.model[key] = value.model;
        });

        // format date without changing scopes date objects
        var model = angular.copy($scope.model);
        generator.convertDate(model);

        // todo: unused var delete
        var send_data = {
            "form": model,
            "object_key": $scope.object_key,
            "token": $scope.token,
            "model": $scope.form_params.model,
            "wf": $scope.form_params.wf,
            "cmd": $scope.form_params.cmd,
            "flow": $scope.form_params.flow,
            "object_id": $scope.object_id,
            "filter": $scope.filter,
            "query": $scope.form_params.query
        };
        //check if wf_meta is present or not
        var wf_meta_data = wfMetadata.getWfMeta();
        if (angular.isDefined(wf_meta_data) && Object.keys(wf_meta_data).length !== 0) {
            send_data.wf_meta = wf_meta_data;
        }
        //reformat typeahead data structure for listnode
        checkAndReformatModel(model);
        return $http
            .post(generator.makeUrl(send_data.wf), send_data)
            .success(function (data) {
                // if response data.cmd is 'upgrade'
                wfMetadata.setWfMeta(data.wf_meta);
                if (!dontProcessReply) {
                    return generator.pathDecider(data.client_cmd || ['list'], $scope, data);
                }
                return data;
            });
    };
    /**
     * @memberof ulakbusBap
     * @ngdoc function
     * @name prepareFormItems
     * @param scope {Object} given scope on which form items prepared
     * @description
     * It looks up fields of schema objects and changes their types to proper type for schemaform.
     * To prepare items for schemaform loop items of scope.schema.properties by checking index value's `type` key.
     *
     * If `type` is in `['file', 'select', 'submit', 'date', 'int', 'text_general', 'model', 'ListNode', 'Node']`
     * then the item must be converted into the data format which schemaform works with.
     *
     *
     * For listnode, node and model types it uses templates to generate modal. The modal is aa instance of
     * ui.bootstraps modal directive.
     *
     * @returns scope {Object}
     */

    generator.prepareFormItems = function (scope) {

        angular.forEach(scope.form, function (value, key) {

            // parse markdown for help text
            if (value.type === 'help') {
                var markdown = $filter('markdown');
                value.helpvalue = value.helpvalue ? '<div class="alert alert-info">' + markdown(value.helpvalue) + '</div>' : value.helpvalue;
            }

            if (value.type === 'select') {
                scope.schema.properties[value.key].type = 'select';
                scope.schema.properties[value.key].titleMap = value.titleMap;
                scope.form[key] = value.key;
            }
        });

        var _buttons = function (scope, v, k) {
            var buttonPositions = scope.modalElements ? scope.modalElements.buttonPositions : {
                bottom: 'move-to-bottom',
                top: 'move-to-top',
                none: ''
            };
            var workOnForm = scope.modalElements ? scope.modalElements.workOnForm : 'formgenerated';
            var workOnDiv = scope.modalElements ? scope.modalElements.workOnDiv : '';
            var buttonClass = (buttonPositions[v.position] || buttonPositions.bottom);
            var redirectTo = scope.modalElements ? false : true;

            // in case backend needs styling the buttons
            // it needs to send style key with options below
            scope.form[scope.form.indexOf(k)] = {
                type: v.type,
                title: v.title,
                style: (v.style || "btn-danger") + " hide bottom-margined " + buttonClass,
                onClick: function () {
                    //indicate that the user have clicked some button like submit/cancel on form
                    $rootScope.isUserClicked = true;
                    delete scope.form_params.cmd;
                    delete scope.form_params.flow;
                    if (v.cmd) {
                        scope.form_params["cmd"] = v.cmd;
                    }
                    if (v.flow) {
                        scope.form_params["flow"] = v.flow;
                    }
                    if (v.wf) {
                        delete scope.form_params["cmd"];
                        scope.form_params["wf"] = v.wf;
                    }
                    scope.model[k] = 1;
                    // todo: test it
                    if (scope.modalElements) {
                        scope.submitModalForm();
                    } else {
                        if (!v.form_validation && angular.isDefined(v.form_validation)) {
                            generator.submit(scope, redirectTo);
                        } else {
                            scope.$broadcast('schemaFormValidate');
                            if (scope[workOnForm].$valid) {
                                generator.submit(scope, redirectTo);
                                scope.$broadcast('disposeModal');
                            } else {
                                // focus to first input with validation error
                                $timeout(function () {
                                    var firsterror = angular.element(document.querySelectorAll('input.ng-invalid'))[0];
                                    firsterror.focus();
                                });
                            }
                        }
                    }
                }
            };
            // ADD CONSTRAINTS if cons

            // replace buttons according to their position values
            $timeout(function () {
                var selectorBottom = '.buttons-on-bottom' + workOnDiv;
                //var selectorTop = '.buttons-on-top'+workOnDiv;

                var buttonsToBottom = angular.element(document.querySelector('.' + buttonClass));
                angular.element(document.querySelector(selectorBottom)).append(buttonsToBottom);

                buttonsToBottom.removeClass('hide');
            }, 500);
        };
        var _numbers = function (scope, v, k) {
            v.type = 'number';
            v.validationMessage = {'max': 'bu alan -2147483647 ve 2147483647 arasında olmalıdır.'}
            v.$validators = {
                max: function (value) {
                    return 2147483647 > value > -2147483647;
                }
            };
            scope.model[k] = parseInt(scope.model[k]);
        };
        var _node_default = function (scope, v, k) {

            scope[v.type] = scope[v.type] || {};

            // no pass by reference
            scope[v.type][k] = angular.copy({
                title: v.title,
                form: [],
                schema: {
                    properties: {},
                    properties_list: [],
                    required: [],
                    title: v.title,
                    type: "object",
                    formType: v.type,
                    model_name: k,
                    inline_edit: scope.inline_edit
                },
                buttons: v.buttons,
                url: scope.url,
                wf: v.wf || scope.wf,
                quick_add: v.quick_add,
                quick_add_view: v.quick_add_view,
                quick_add_model: v.quick_add_model,
                quick_add_field: v.quick_add_field,
                nodeModelChange: function (item) {
                }

            });

            angular.forEach(v.schema, function (item) {
                scope[v.type][k].schema.properties[item.name] = angular.copy(item);

                // save properties order in schema
                if (item.name != 'idx') {
                    scope[v.type][k].schema.properties_list.push(scope[v.type][k].schema.properties[item.name]);
                }

                if (angular.isDefined(item.wf)) {
                    scope[v.type][k].schema.properties[item.name]['wf'] = angular.copy(item.wf);
                }

                // prepare required fields
                if (item.required === true && item.name !== 'idx') {
                    scope[v.type][k].schema.required.push(angular.copy(item.name));
                }

                // idx field must be hidden
                if (item.name !== 'idx') {
                    scope[v.type][k].form.push(item.name);
                }

                try {
                    if (item.type === 'date') {
                        //scope.model[k][item.name] = generator.dateformatter(scope.model[k][item.name]);
                    }
                } catch (e) {
                    $log.debug('Error: ', e.message);
                }


            });

            $timeout(function () {
                if (v.type != 'ListNode') return;

                // todo: needs refactor
                var list = scope[v.type][k];
                list.items = angular.copy(scope.model[k] || []);

                angular.forEach(list.items, function (node, fieldName) {

                    if (!Object.keys(node).length) return;

                    angular.forEach(node, function (prop, propName) {
                        var propInSchema = list.schema.properties[propName];
                        try {
                            if (propInSchema.type === 'date') {
                                node[propName] = generator.dateformatter(prop);
                                list.model[fieldName][propName] = generator.dateformatter(prop);
                            }
                            if (propInSchema.type === 'select') {
                                node[propName] = generator.item_from_array(prop.toString(), list.schema.properties[propName].titleMap)
                            }
                            if (propInSchema.titleMap) {
                                node[propName] = {
                                    key: prop,
                                    unicode: generator.item_from_array(prop, propInSchema.titleMap)
                                };
                            }
                        } catch (e) {
                            $log.debug('Field is not date');
                        }
                    });

                });
            });

            scope.model[k] = scope.model[k] || [];

            scope[v.type][k].model = scope.model[k];

            // lengthModels is length of the listnode models. if greater than 0 show records on template
            scope[v.type][k]['lengthModels'] = scope.model[k] ? 1 : 0;

        };
        var _node_filter_interface = function (scope, v, k) {
            var formitem = scope.form[scope.form.indexOf(k)];
            var modelScope = {
                "form_params": {
                    wf: v.wf || scope.wf || scope.form_params.wf,
                    model: v.model_name || v.schema[0].model_name,
                    cmd: v.list_cmd || 'select_list',
                    query: ''
                }
            };

            scope.generateTitleMap = function (modelScope) {
                generator.get_list(modelScope).then(function (res) {
                    formitem.titleMap = [];
                    angular.forEach(res.objects, function (item) {
                        if (item !== "-1") {
                            formitem.titleMap.push({
                                "value": item.key,
                                "name": item.value
                            });
                        }
                    });
                    formitem.filteredItems = generator.get_diff_array(angular.copy(formitem.titleMap), angular.copy(formitem.selectedFilteredItems), 1);
                })
            };

            var modelItems = [];
            var modelKeys = [];

            angular.forEach(scope.model[k], function (value, mkey) {
                modelItems.push({
                    "value": value[v.schema[0].name].key,
                    "name": value[v.schema[0].name].unicode
                });
                var modelKey = {};
                modelKey[v.schema[0].name] = value[v.schema[0].name].key;
                modelKeys.push(modelKey);
            });
            scope.model[k] = angular.copy(modelKeys);

            formitem = {
                type: "template",
                templateUrl: "/shared/templates/multiselect.html",
                title: v.title,
                // formName will be used in modal return to save item on form
                formName: k,
                wf: v.wf || scope.wf,
                add_cmd: v.add_cmd,
                name: v.model_name || v.schema[0].model_name,
                model_name: v.model_name || v.schema[0].model_name,
                filterValue: '',
                selected_item: {},
                filteredItems: [],
                selectedFilteredItems: modelItems,
                titleMap: scope.generateTitleMap(modelScope),
                appendFiltered: function (filterValue) {
                    if (filterValue.length > 2) {
                        formitem.filteredItems = [];
                        angular.forEach(formitem.titleMap, function (value, key) {
                            if (value.name.indexOf(filterValue) > -1) {
                                formitem.filteredItems.push(formitem.titleMap[key]);
                            }
                        });
                    }
                    if (filterValue <= 2) {
                        formitem.filteredItems = formitem.titleMap
                    }
                    formitem.filteredItems = generator.get_diff_array(formitem.filteredItems, formitem.selectedFilteredItems);
                },
                select: function (selectedItemsModel) {
                    if (!selectedItemsModel) {
                        return;
                    }
                    formitem.selectedFilteredItems = formitem.selectedFilteredItems.concat(selectedItemsModel);
                    formitem.appendFiltered(formitem.filterValue);
                    scope.model[k] = (scope.model[k] || []).concat(formitem.dataToModel(selectedItemsModel));
                },
                deselect: function (selectedFilteredItemsModel) {
                    if (!selectedFilteredItemsModel) {
                        return;
                    }
                    formitem.selectedFilteredItems = generator.get_diff_array(angular.copy(formitem.selectedFilteredItems), angular.copy(selectedFilteredItemsModel));
                    formitem.appendFiltered(formitem.filterValue);
                    formitem.filteredItems = formitem.filteredItems.concat(selectedFilteredItemsModel);
                    scope.model[k] = generator.get_diff_array(scope.model[k] || [], formitem.dataToModel(selectedFilteredItemsModel));
                },
                dataToModel: function (data) {
                    var dataValues = [];
                    angular.forEach(data, function (value, key) {
                        var dataKey = {};
                        dataKey[v.schema[0].name] = value.value;
                        dataValues.push(dataKey);
                    });
                    return dataValues;
                }
            };

            scope.form[scope.form.indexOf(k)] = formitem;

        };
        // generate_fields covers all field types as functions
        var generate_fields = {
            button: {default: _buttons},
            submit: {default: _buttons},
            file: {
                default: function (scope, v, k) {
                    scope.form[scope.form.indexOf(k)] = {
                        type: "template",
                        title: v.title,
                        templateUrl: "/shared/templates/filefield.html",
                        name: k,
                        key: k,
                        fileInsert: function () {
                            $scope.$broadcast('schemaForm.error.' + k, 'tv4-302', true);
                        },
                        validationMessage: {
                            'file': "Bu alan zorunludur."
                        },
                        $validators: {
                            file: function(value) {
                                // check for null value
                                if(!value){
                                    if (scope.schema.required.indexOf(k) > -1) {
                                        return false;
                                    }
                                    else{
                                        return true;
                                    }
                                }
                                return true;
                            }
                        },
                        imageSrc: scope.model[k] ? $rootScope.settings.static_url + scope.model[k] : '',
                        avatar: k === 'avatar'
                    };
                    // v.type = 'string';
                }
            },
            select: {
                default: function (scope, v, k) {
                    var nullExist = false;
                    for(var i=0; i<v.titleMap.length; i++){
                        if(v.titleMap[i].value ==='-1'){
                            nullExist = true;
                            break;
                        }
                    }
                    if(!nullExist){
                        titleMap: v.titleMap.unshift({name:"-",value:'-1'});
                    }
                    scope.form[scope.form.indexOf(k)] = {
                        type: "template",
                        title: v.title,
                        templateUrl: "/shared/templates/select.html",
                        name: k,
                        readonly: angular.isDefined(scope.forms) && scope.forms.schema.properties[k]&&scope.forms.schema.properties[k].readonly,
                        key: k,
                        titleMap: v.titleMap,
                        validationMessage: {
                            'requiredMessage': 'Bu alan zorunludur.'
                        },
                        $validators:{
                            'requiredMessage':function (value) {
                                if (scope.schema.required.indexOf(k) > -1) {
                                    {
                                        if(!value || value=='-1') {
                                            scope.model[k] = '-1';
                                            return false;
                                        }
                                        else {
                                            return true;
                                        }
                                    }
                                } else {
                                    return true;
                                }
                                return true
                            }
                        }
                    };
                }
            },
            confirm: {
                default: function (scope, v, k) {
                    scope.form[scope.form.indexOf(k)] = {
                        type: "template",
                        title: v.title,
                        confirm_message: v.confirm_message,
                        templateUrl: "/shared/templates/confirm.html",
                        name: k,
                        key: k,
                        style: v.style,
                        buttons: v.buttons,
                        modalInstance: "",
                        // buttons is an object array
                        //Example:
                        //buttons: [{
                        //  text: "Button text",
                        //  cmd: "button command",
                        //  style: "btn-warning",
                        //  dismiss: false --> this one is for deciding if the button can dismiss modal
                        //}]
                        modalFunction: function () {
                            delete scope.form_params.cmd;
                            delete scope.form_params.flow;
                            if (v.cmd) {
                                scope.form_params["cmd"] = v.cmd;
                            }
                            if (v.flow) {
                                scope.form_params["flow"] = v.flow;
                            }
                            if (v.wf) {
                                delete scope.form_params["cmd"];
                                scope.form_params["wf"] = v.wf;
                            }

                            var modalInstance = $uibModal.open({
                                animation: true,
                                templateUrl: '/shared/templates/confirmModalContent.html',
                                controller: 'ModalController',
                                resolve: {
                                    items: function () {
                                        var newscope = {
                                            form: {
                                                title: v.title,
                                                confirm_message: v.confirm_message,
                                                buttons: v.buttons,
                                                onClick: function (cmd) {
                                                    // send cmd with submit
                                                    modalInstance.dismiss();
                                                    if (cmd) generator.submit(scope, false);
                                                }
                                            }
                                        };
                                        return newscope;
                                    }
                                }

                            });
                        },
                        openModal: function () {
                            var workOnForm = scope.modalElements ? scope.modalElements.workOnForm : 'formgenerated';
                            if (!v.form_validate && angular.isDefined(v.form_validate)) {
                                this.modalFunction();
                            }
                            else {
                                scope.$broadcast('schemaFormValidate');
                                if (scope[workOnForm].$valid) {
                                    this.modalFunction();
                                } else {
                                    // focus to first input with validation error
                                    $timeout(function () {
                                        var firsterror = angular.element(document.querySelectorAll('input.ng-invalid'))[0];
                                        firsterror.focus();
                                    });
                                }
                            }
                        }
                    };
                }
            },
            date: {
                default: function (scope, v, k) {
                    $log.debug('date:', scope.model[k]);
                    scope.model[k] = Moment(scope.model[k]).toDate();
                    scope.form[scope.form.indexOf(k)] = {
                        key: k,
                        name: k,
                        title: v.title,
                        type: 'template',
                        templateUrl: '/shared/templates/datefield.html',
                        validationMessage: {
                            'date': "Girdiğiniz tarih geçerli değildir. <i>orn: '01.01.2015'<i/>",
                            'schemaForm': 'Bu alan zorunludur.'
                        },
                        $validators: {
                            date: function(value) {
                                if(!value){ // check for null value
                                    if (scope.schema.required.indexOf(k) > -1) {
                                        return false;
                                    }
                                    else{
                                        return true;
                                    }
                                } else if (Object.prototype.toString.call(value) === "[object Date]") {
                                    if ( isNaN( value.getTime() ) ) {
                                        if (scope.schema.required.indexOf(k) > -1) {
                                            return false;
                                        }
                                        else{
                                            return true;
                                        }
                                    }
                                    else {
                                        return true;
                                    }
                                } else {
                                    var dateValue = value.split('.');
                                    if (isNaN(Date.parse(value)) || dateValue.length !== 3) {
                                        return false;
                                    } else {
                                        return true;
                                    }
                                }
                                return true
                            },
                            schemaForm: function(value) {
                                if (scope.schema.required.indexOf(k) > -1) {
                                    {
                                        if(!value) {
                                            return false;
                                        }
                                        else {
                                            return true;
                                        }
                                    }
                                } else {
                                    return true;
                                }
                                return true
                            }
                        },
                        status: {opened: false},
                        open: function ($event) {
                            this.disabled = true;
                            // scope.$apply();
                            scope.model[k] = Moment(scope.model[k], "DD.MM.YYYY").toDate();
                            var that = this;
                            $timeout(function () {
                                that.status.opened = true;
                            }, 100);
                        },
                        format: 'dd.MM.yyyy',
                        onSelect: function () {
                            // causes date picker error data will be formated when submiting
                            //scope.model[k] = angular.copy(scope.model[k]);
                            return false;
                        }
                    };
                }
            },
            int: {default: _numbers},
            boolean: {
                default: function (scope, v, k) {
                }
            },
            string: {
                default: function (scope, v, k) {
                    scope.form[scope.form.indexOf(k)] = {
                        key: k,
                        name: k,
                        title: v.title,
                        validationMessage: {
                            'min': function(ctx) { return "En az "+ctx.form.schema.min_length+" karakter uzunluğunda olmalıdır."},
                            'max': function(ctx) { return "En çok "+ctx.form.schema.max_length+" karakter uzunluğunda olmalıdır."}
                        },
                        $validators: {
                            min: function(value) {
                                //check if min_length exist
                                if (angular.isDefined(scope.schema.properties[k].min_length) && scope.schema.properties[k].min_length !== null) {
                                    return (value === null || value.length >= scope.schema.properties[k].min_length);
                                }else {
                                    return true;
                                }
                            },
                            max: function(value) {
                                //check if max_length exist
                                if (angular.isDefined(scope.schema.properties[k].max_length) && scope.schema.properties[k].max_length !== null) {
                                    return (value === null || value.length <= scope.schema.properties[k].max_length);
                                }else {
                                    return true;
                                }
                            }
                        }
                    };
                }
            },
            password: {
                default: function (scope, v, k) {
                    v.type = "string";
                    v["x-schema-form"] = {
                        type: "password",
                        placeholder: "******"
                    };
                }
            },
            typeahead: {
                default: function (scope, v, k) {
                    scope.form[scope.form.indexOf(k)] = {
                        type: "template",
                        title: v.title,
                        titleMap: v.titleMap,
                        templateUrl: "/shared/templates/typeahead.html",
                        name: k,
                        key: k,
                        onDropdownSelect: function (item, inputname) {
                            scope.model[k] = item.value;
                            $timeout(function () {
                                document.querySelector('input[name=' + inputname + ']').value = item.name;
                            });
                        }
                    };
                    v.type = 'string';
                },
                custom: function (scope, v, k) {
                    scope.form[scope.form.indexOf(k)] = {
                        type: "template",
                        title: v.title,
                        widget: v.widget,
                        getTitleMap: function (viewValue) {
                            // v.view is where that value will looked up
                            var searchData = {
                                "form_params": {
                                    "url": v.wf,
                                    "wf": v.wf,
                                    "view": v.view,
                                    "query": viewValue
                                }
                            };
                            generator.get_list(searchData).then(function (res) {
                                // response must be in titleMap format
                                return res;
                            });
                        },
                        templateUrl: "/shared/templates/typeahead.html",
                        name: k,
                        key: k,
                        onDropdownSelect: function (item, inputname) {
                            scope.model[k] = item.value;
                            $timeout(function () {
                                document.querySelector('input[name=' + inputname + ']').value = item.name;
                            });
                        }
                    };
                    v.type = 'string';
                }
            },
            text_general: {
                default: function (scope, v, k) {
                    v.type = 'string';
                    v["x-schema-form"] = {
                        "type": "textarea"
                    };
                    scope.form[scope.form.indexOf(k)] = {
                        key: k,
                        name: k,
                        title: v.title,
                        validationMessage: {
                            'min': function(ctx) { return "En az "+ctx.form.schema.min_length+" karakter uzunluğunda olmalıdır."},
                            'max': function(ctx) { return "En çok "+ctx.form.schema.max_length+" karakter uzunluğunda olmalıdır."}
                        },
                        $validators: {
                            min: function(value) {
                                //check if min_length exist
                                if (angular.isDefined(scope.schema.properties[k].min_length) && scope.schema.properties[k].min_length !== null) {
                                    return (value === null || value.length >= scope.schema.properties[k].min_length);
                                }else {
                                    return true;
                                }
                            },
                            max: function(value) {
                                //check if max_length exist
                                if (angular.isDefined(scope.schema.properties[k].max_length) && scope.schema.properties[k].max_length !== null) {
                                    return (value === null || value.length <= scope.schema.properties[k].max_length);
                                }else {
                                    return true;
                                }
                            }
                        }
                    };
                }
            },
            float: {default: _numbers},
            model: {
                default: function (scope, v, k) {

                    var formitem = scope.form[scope.form.indexOf(k)];
                    var modelScope = {
                        "url": v.wf,
                        "wf": v.wf,
                        "form_params": {wf: v.wf, model: v.model_name, cmd: v.list_cmd}
                    };

                    //scope.$on('refreshTitleMap', function (event, data) {
                    // todo: write a function to refresh titleMap after new item add to linkedModel
                    //});

                    var generateTitleMap = function (modelScope) {
                        var wf_meta_data = wfMetadata.getWfMeta();
                        if (angular.isDefined(wf_meta_data) && Object.keys(wf_meta_data).length !== 0) {
                            modelScope.form_params.wf_meta = wf_meta_data;
                        }
                        return generator.get_list(modelScope).then(function (res) {
                            formitem.titleMap = [];
                            angular.forEach(res.objects, function (item) {
                                if (item !== -1) {
                                    if(item!==0){
                                        formitem.titleMap.push({
                                            "value": item.key,
                                            "name": item.value
                                        });
                                    }else{
                                        formitem.titleMap.push({
                                            "value": '',
                                            "name": ''
                                        });
                                    }
                                } else {
                                    formitem.focusToInput = true;
                                }
                            });

                            return formitem.titleMap;

                        });
                    };

                    formitem = {
                        type: "template",
                        templateUrl: "/shared/templates/foreignKey.html",
                        // formName will be used in modal return to save item on form
                        formName: k,
                        title: v.title,
                        wf: v.wf,
                        add_cmd: v.add_cmd,
                        name: k,
                        key: k,
                        model_name: v.model_name,
                        selected_item: {},
                        titleMap: [],
                        onSelect: function (item, inputname) {
                            scope.model[k] = item.value;
                            $timeout(function () {
                                document.querySelector('input[name=' + inputname + ']').value = item.name;
                            });
                        },
                        onDropdownSelect: function (item, inputname) {
                            scope.model[k] = item.value;
                            $timeout(function () {
                                document.querySelector('input[name=' + inputname + ']').value = item.name;
                            });
                        },
                        getTitleMap: function (viewValue) {
                            modelScope.form_params.query = viewValue;
                            if(modelScope.form_params.cmd === 'select_list'){
                                modelScope.form_params.wf = 'crud';
                            }
                            return generateTitleMap(modelScope);
                        },
                        getDropdownTitleMap: function () {
                            delete modelScope.form_params.query;
                            formitem.gettingTitleMap = true;
                            modelScope.form_params.wf = 'crud';
                            generateTitleMap(modelScope)
                                .then(function (data) {
                                    formitem.titleMap = data;
                                    formitem.gettingTitleMap = false;
                                });
                        }
                    };

                    scope.form[scope.form.indexOf(k)] = formitem;

                    // get selected item from titleMap using model value
                    if (scope.model[k]) {
                        var form_params = {
                            wf: v.wf,
                            model: v.model_name,
                            object_id: scope.model[k],
                            cmd: 'object_name'
                        };
                        var wf_meta_data = wfMetadata.getWfMeta();
                        if (angular.isDefined(wf_meta_data) && Object.keys(wf_meta_data).length !== 0) {
                            form_params.wf_meta = wf_meta_data;
                        }
                        generator.get_list({
                            url: 'crud',
                            form_params: form_params
                        }).then(function (data) {

                            try {
                                $timeout(function () {
                                    document.querySelector('input[name=' + k + ']').value = data.object_name;
                                }, 200);

                            }
                            catch (e) {
                                document.querySelector('input[name=' + k + ']').value = data.object_name;
                                $log.debug('exception', e);
                            }

                        });
                    }
                }
            },
            Node: {
                default: _node_default,
                filter_interface: _node_filter_interface
            },
            ListNode: {
                default: _node_default,
                filter_interface: _node_filter_interface
            }
        };

        angular.forEach(scope.schema.properties, function (v, k) {
            // generically change _id fields model value
            if ('form_params' in scope) {
                if (k == scope.form_params.param) {
                    scope.model[k] = scope.form_params.id;
                    scope.form.splice(scope.form.indexOf(k), 1);
                    return;
                }
            }
            try {
                generate_fields[v.type][v.widget || 'default'](scope, v, k);
            }
            catch (e) {
                // todo: raise not implemented
                //console.log(v.type)
            }
        });

        $log.debug('scope at after prepareformitems', scope);
        return generator.constraints(scope);
    };

    generator.constraints = function (scope) {
        angular.forEach(scope.form, function (v, k) {
            var cons = angular.isDefined(scope.forms) && angular.isDefined(scope.forms.constraints) && (scope.forms.constraints[v] || scope.forms.constraints[v.key]) || void 0;
            if (angular.isDefined(cons)) {
                if (v.constructor === String) {
                    scope.form[k] = {
                        key: v,
                        validationMessage: {'form_cons': cons.val_msg},
                        $validators: {
                            form_cons: function (value) {
                                return FormConstraints[cons.cons](value, cons.val, v);
                            }
                        }
                    };
                } else {
                    v.key = v.key;
                    v.validationMessage = angular.extend({'form_cons': cons.val_msg}, v.validationMessage);
                    v.$validators = angular.extend({
                        form_cons: function (value) {
                            return FormConstraints[cons.cons](value, cons.val, v.key);
                        }
                    }, v.$asyncValidators);
                }
            }
        });
        return generator.group(scope);
    };
    /**
     * @memberof ulakbusBap
     * @ngdoc function
     * @name group
     * @param scope
     * @description group function to group form layout by form meta data for layout
     * grouping will use an object like example below when parsing its items.
     * @example
     * @returns {*}
     * @param scope
     */
    generator.group = function (scope) {
        if (!scope.grouping) {
            return scope;
        }

        var newForm = [];

        var extractFormItem = function (itemList) {
            var extractedList = [];
            angular.forEach(itemList, function (value, key) {
                var item = getFormItem(value);
                if (item) {
                    extractedList.push(item);
                }
            });

            $log.debug('extractedList: ', extractedList);

            return extractedList;
        };

        var getFormItem = function (item) {
            var formItem;
            if (scope.form.indexOf(item) > -1) {
                formItem = scope.form[scope.form.indexOf(item)];
                scope.form.splice(scope.form.indexOf(item), 1);
                return formItem;
            } else {
                angular.forEach(scope.form, function (value, key) {
                    if (value.key === item) {
                        formItem = value;
                        scope.form.splice(key, 1);
                        return;
                    }
                });
                return formItem;
            }
        };

        var makeGroup = function (itemsToGroup) {
            var subItems = [];
            angular.forEach(itemsToGroup, function (value, key) {
                subItems.push({
                    type: 'fieldset',
                    items: extractFormItem(value.items),
                    title: value.group_title
                });
            });
            return subItems;
        };

        angular.forEach(scope.grouping, function (value, key) {
            newForm.push(
                {
                    type: 'fieldset',
                    items: makeGroup(value.groups),
                    htmlClass: 'col-md-' + value.layout,
                    title: value.group_title
                }
            )
        });

        if (newForm.length > 0) {
            $log.debug('grouped form: ', newForm);
            $log.debug('rest of form: ', scope.form);
            $log.debug('form united: ', newForm.concat(scope.form));
        }
        scope.form = newForm.concat(scope.form);
        return scope;
    };
    /**
     * @memberof ulakbusBap
     * @ngdoc function
     * @name doItemAction
     * @description `mode` could be in ['normal', 'modal', 'new'] . the default mode is 'normal' and it loads data
     * on same
     * tab without modal. 'modal' will use modal to manipulate data and do all actions in that modal. 'new'
     * will be open new page with response data
     * @param {Object} $scope
     * @param {string} key
     * @param {Object} todo
     * @param {string} mode
     * @returns {*}
     */
    generator.doItemAction = function ($scope, key, todo, mode) {
        $scope.form_params.cmd = todo.cmd;
        $scope.form_params.wf = $scope.wf;
        if (todo.wf) {
            $scope.url = todo.wf;
            $scope.form_params.wf = todo.wf;
            delete $scope.token;
            delete $scope.form_params.model;
            delete $scope.form_params.cmd
        }
        if (todo.object_key) {
            $scope.form_params[todo.object_key] = key;
        } else {
            $scope.form_params.object_id = key;
        }
        $scope.form_params.param = $scope.param;
        $scope.form_params.id = $scope.param_id;
        $scope.form_params.token = $scope.token;
        //this will execute for edit/delete buttons
        var wf_meta_data = wfMetadata.getWfMeta();
        if (angular.isDefined(wf_meta_data) && Object.keys(wf_meta_data).length !== 0) {
            $scope.form_params.wf_meta = wf_meta_data;
        }
        var _do = {
            normal: function () {
                $log.debug('normal mode starts');
                return generator.get_wf($scope);
            },
            modal: function () {
                $log.debug('modal mode starts');
                var modalInstance = $uibModal.open({
                    animation: true,
                    backdrop: 'static',
                    keyboard: false,
                    templateUrl: '/shared/templates/confirmModalContent.html',
                    controller: 'ModalController',
                    size: '',
                    resolve: {
                        items: function () {
                            var newscope = {
                                form: {
                                    buttons: [{text: "Evet", style: "btn-success", cmd: "confirm"}, {
                                        text: "Hayir",
                                        "style": "btn-warning",
                                        dismiss: true
                                    }],
                                    title: todo.name,
                                    confirm_message: "Islemi onayliyor musunuz?",
                                    onClick: function (cmd) {
                                        modalInstance.close();
                                        if (cmd === "confirm" && angular.isDefined(cmd)) {
                                            modalInstance.close();
                                            return generator.get_wf($scope);
                                        }
                                    }

                                }
                            }
                            return newscope;
                        }
                    }
                });


            },
            new: function () {
                $log.debug('new mode is not not ready');
            }
        };
        return _do[mode]();
    };

    /**
     * @memberof ulakbusBap
     * @ngdoc function
     * @name listPageItems
     * @description listPageItems is a function to prepare objects to list in the list page.
     *
     * @param {object} scope
     * @param {object} pageData
     */
    generator.listPageItems = function (scope, pageData) {
        angular.forEach(pageData, function (value, key) {
            scope[key] = value;
        });
        // when selective_list is sent with meta key it means
        // "objects" is a list of "objects"s
        if (scope.meta && scope.meta['selective_listing'] === true) {
            angular.forEach(scope.objects, function (_v, _k) {
                angular.forEach(_v.objects, function (value, key) {
                    if (_v.selected === true) {
                        scope.selected_key = _k;
                    }
                    if (key > 0) {
                        var linkIndexes = {};
                        angular.forEach(value.actions, function (v, k) {
                            if (v.show_as === 'link') {linkIndexes = v}
                        });
                        angular.forEach(value.fields, function (v, k) {
                            try {
                                if (value.actions.length > 0 && linkIndexes.fields){
                                    scope.objects[_k][key].fields[k] = {
                                        type: linkIndexes.fields.indexOf(k) > -1 ? 'link' : 'str',
                                        content: v,
                                        cmd: linkIndexes.cmd,
                                        mode: linkIndexes.mode
                                    };
                                }
                                else {
                                    scope.objects[_k]['objects'][key].fields[k] = {type: 'str', content: v};
                                }
                            } catch (e) {
                                $log.error(e);
                                scope.objects[_k]['objects'][key].fields[k] = {type: 'str', content: v};
                            }

                        });
                    }
                });
            });
        } else {
            angular.forEach(scope.objects, function (value, key) {
                if (key > 0) {
                    var linkIndexes = {};
                    angular.forEach(value.actions, function (v, k) {
                        if (v.show_as === 'link') {linkIndexes = v}
                    });
                    angular.forEach(value.fields, function (v, k) {
                        if (value.actions.length > 0 && linkIndexes.fields){
                            scope.objects[key].fields[k] = {
                                type: linkIndexes.fields.indexOf(k) > -1 ? 'link' : 'str',
                                content: v,
                                cmd: linkIndexes.cmd,
                                mode: linkIndexes.mode
                            };
                        }
                        else {
                            scope.objects[key].fields[k] = {type: 'str', content: v};
                        }
                    });
                }
            });
        }

        $log.debug(scope.objects);
    };

    /**
     * In case of unformatted date object in any key recursively, it must be converted.
     * @param model
     */
    generator.convertDate = function (model) {
        angular.forEach(model, function (value, key) {
            if (value && value.constructor === Date) {
                model[key] = generator.dateformatter(value);
            } else if (value && value.constructor === Object) {
                // check recursively
                generator.convertDate(value);
            }
        });
    };

    /**
     * @memberof ulakbusBap
     * @ngdoc function
     * @name dateformatter
     * @description dateformatter handles all date fields and returns humanized and jquery datepicker format dates
     * @param {Object} formObject
     * @returns {*}
     */
    generator.dateformatter = function (formObject) {
        var ndate = new Date(formObject);
        if (isNaN(ndate) || formObject === null) {
            return null;
        } else {
            var newdatearray = Moment(ndate).format('DD.MM.YYYY');
            $log.debug('date formatted: ', newdatearray);
            return newdatearray;
        }
    };

    generator.button_switch = function (position) {
        var buttons = angular.element(document.querySelectorAll('button'));
        var positions = {true: "enabled", false: "disabled"};
        angular.forEach(buttons, function (button, key) {
            button[positions[position]] = true;
        });
        $log.debug('buttons >> ', positions[position])
    };

    generator.get_form = function (scope) {
        return $http.post(generator.makeUrl(scope.form_params.wf), {})
            .success(function (response, status, headers, config) {
                wfMetadata.setWfMeta(response.wf_meta);
                return generator.generate(scope, response);
            });
    };

    generator.get_list = function (scope) {
        var form_params = scope.form_params;

        var isSearchResult = ((form_params.cmd === 'select_list' || form_params.cmd === 'object_name') && (form_params.wf === 'crud'))?true:false;

        return $http.post(generator.makeUrl(scope.form_params.wf), {})
            .success(function (data, status, headers, config) {
                //we need to set the wf_meta of the main wf and not from the response of typeahead
                if(!isSearchResult){
                    wfMetadata.setWfMeta(data.wf_meta);
                }
                return data;
            });
    };

    generator.get_diff = function (oldObj, newObj) {
        var result = {};
        angular.forEach(newObj, function (value, key) {
            if (oldObj[key]) {
                if ((oldObj[key].constructor === newObj[key].constructor) && (newObj[key].constructor === Object || newObj[key].constructor === Array)) {
                    angular.forEach(value, function (v, k) {
                        if (oldObj[key][k] != value[k]) {
                            result[key][k] = angular.copy(value[k]);
                        }
                    });
                } else {
                    if (oldObj[key] != newObj[key]) {
                        result[key] = angular.copy(newObj[key]);
                    }
                }
            } else {
                result[key] = angular.copy(newObj[key]);
            }
        });
        return result;
    };

    generator.get_diff_array = function (array1, array2, way) {
        var result = [];
        angular.forEach(array1, function (value, key) {
            if (way === 1) {
                if (angular.toJson(array2).indexOf(value.value) < 0) {
                    result.push(value);
                }
            } else {
                if (angular.toJson(array2).indexOf(angular.toJson(value)) < 0) {
                    result.push(value);
                }
            }
        });
        return result;
    };

    generator.item_from_array = function (item, array) {
        var result = item;
        angular.forEach(array, function (value, key) {
            if (value.value === item) {
                result = value.name;
            }
        });
        return result;
    };

    return generator;
})

.service("Utils", function($rootScope, $q) {
    var self = this;

    // check if obj1 has properties values equal to corresponding properties in obj2
    function hasEqualProperties(obj1, obj2) {
        var result = true;
        for (var prop in obj2) {
            if (obj2.hasOwnProperty(prop)) {
                result = result && obj2[prop] == obj1[prop];
            }
        }
        return result;
    }

    /**
     * @param list {Array} Array of objects to group
     * @param propName {String} property name to group array by
     * @param initialObject {Object} initial object for groups setup
     * @returns {Object}
     */

    this.groupBy = function(list, propName, initialObject) {
        if (!initialObject) initialObject = {};
        return list.reduce(function(acc, item) {
            (acc[item[propName]] = acc[item[propName]] || []).push(item);
            return acc;
        }, initialObject);
    };

    /**
     * @param list {Array} Array of objects to group
     * @param condition {Object} conditions object. If object in collection has same values as in conditions object it will be removed
     * @returns {Object}|undefined removed object or undefined
     */
    this.deleteWhere = function(list, condition) {
        for (var i = 0; i < list.length; i++) {
            if (hasEqualProperties(list[i], condition)) {
                list.splice(i, 1);
                return list[i];
            }
        }
    };

    /**
     * @param list {Array} Array of objects to group
     * @param condition {Object} conditions object. If object in collection has same values as in conditions object found object will be returned
     * @returns {Object}|undefined
     */
    this.findWhere = function(list, condition) {
        for (var i = 0; i < list.length; i++) {
            if (hasEqualProperties(list[i], condition)) {
                return list[i];
            }
        }
    }

    /**
     * @param collection {Array|Object} Array of objects to group
     * @param callback {Function} Callback to apply to every element of the collection
     * @returns None
     */
    this.iterate = function(collection, callback) {
        angular.forEach(collection, function(val, key) {
            // don't iterate over angular binding indexes
            if (key.indexOf && key.indexOf('$$') == 0) {
                return;
            }
            callback(val, key);
        })
    };

    /**
     *
     * returns date formated like   "5 Eylül 2016 - Pazartesi"
     * @param {Date} data
     * @returns {string}
     */
    this.genDate = function(date) {
        date = date.contructor == Date ? date : new Date(date);
        var months = new Array("Ocak", "Şubat", "Mart", "Nisan", "Mayıs", "Haziran", "Temmuz", "Ağustos", "Eylül", "Ekim", "Kasım", "Aralık");
        var days = new Array("Pazar", "Pazartesi", "Salı", "Çarşamba", "Perşembe", "Cuma", "Cumartesi");

        var year = date.getFullYear();
        var month = date.getMonth();
        var day = date.getDate();
        var weekly = date.getDay();
        return day + " " + months[month] + " " + year + " - " + days[weekly];
    }

    this.formatDate = function(date){
        date = date.contructor == Date ? date : new Date(date);
        var yil = date.getFullYear();
        var ay = addzero(date.getMonth()+1);
        var gun = addzero(date.getDate());
        return gun + "." + ay + "." + yil

        function addzero(number){
            var num = ""+number;
            return num.length == 1 ? "0" + num : num;
        }
    }

    // a method for saving files to disk
    this.saveToDisk = function(fileURL, fileName) {
        // for non-IE
        if (!window.ActiveXObject) {
            var save = document.createElement('a');
            save.href = fileURL;
            save.target = '_blank';
            save.download = fileName || 'unknown';

            var evt = new MouseEvent('click', {
                'view': window,
                'bubbles': true,
                'cancelable': false
            });
            save.dispatchEvent(evt);

            (window.URL || window.webkitURL).revokeObjectURL(save.href);
        }

        // for IE < 11
        else if ( !! window.ActiveXObject && document.execCommand)     {
            var _window = window.open(fileURL, '_blank');
            _window.document.close();
            _window.document.execCommand('SaveAs', true, fileName || fileURL)
            _window.close();
        }
    }
})

.service('Moment', function () {
    return window.moment;
});


/**
 * @license Ulakbus-UI
 * Copyright (C) 2015 ZetaOps Inc.
 * This file is licensed under the GNU General Public License v3
 * (GPLv3).  See LICENSE.txt for details.
 */

/**
 * @ngdoc module
 * @name ulakbus.formService
 * @module ulakbus.formService
 * @description
 * The `formService` module  provides generic services for auto generated forms.
 * @requires ui.bootstrap
 * @type {ng.$compileProvider|*}
 */
angular.module('ulakbus.formService', ['ui.bootstrap'])
/**
 * Moment.js used for date type conversions.
 * there must be no global object, so we change it into a service here.
 */
    .service('Moment', function () {
        return window.moment;
    })

    /**
     * @memberof ulakbus.formService
     * @ngdoc service
     * @name wfMetaData
     * @description wf metadata service handles the getting and setting of the wf_meta tag that is used for user tracking
     */
    .service('wfMetadata', function ($rootScope) {
        this.wf_meta = {};
        this.getWfMeta = function () {
            //creates a copy for the actual value
            if($rootScope.isUserClicked){
                var wf_meta_copy =  angular.copy(this.wf_meta);
                return wf_meta_copy;
            }
        };
        this.setWfMeta = function (wf_meta) {
            //clear previous wf_meta when setting new wf_meta
            this.wf_meta = {};
            if(angular.isDefined(wf_meta)) {
                //set the value in the service variable
                this.wf_meta = wf_meta;
            }
        }
    })

    /**
     * @memberof ulakbus.formService
     * @ngdoc factory
     * @name Generator
     * @description form service's Generator factory service handles all generic form operations
     */
    .factory('Generator', function ($http, $q, $timeout, $sce, $location, $route, $compile, $log, RESTURL, $rootScope, Moment, WSOps, FormConstraints, $uibModal, $filter, Utils, wfMetadata,$cookies) {
        var generator = {};
        /**
         * @memberof ulakbus.formService
         * @ngdoc function
         * @name makeUrl
         * @description this function generates url combining backend url and the related object properties for http requests
         * @param scope
         * @returns {string}
         * @param scope
         */
        generator.makeUrl = function (scope) {
            var getparams = scope.form_params.param ? "?" + scope.form_params.param + "=" + scope.form_params.id : "";
            return RESTURL.url + scope.url + getparams;
        };
        /**
         * @memberof ulakbus.formService
         * @ngdoc function
         * @name generate
         * @param scope
         * @param data
         * @description - generate function is inclusive for form generation
         * defines given scope's client_cmd, model, schema, form, token, object_id objects
         * @returns {*} scope
         * @param scope
         * @param data
         */
        generator.generate = function (scope, data) {

            $log.debug("data before generation:", data);
            // if no form in response (in case of list and single item request) return scope
            if (!data.forms) {
                return scope;
            }

            // prepare scope form, schema and model from response object
            angular.forEach(data.forms, function (value, key) {
                scope[key] = data.forms[key];
            });

            scope.client_cmd = data.client_cmd;

            scope.token = data.token;

            // initialModel will be used in formDiff when submiting the form to submit only
            scope.initialModel = angular.copy(scope.model);

            // if fieldset in form, make it collapsable with template
            //scope.listnodeform = {};
            //scope.isCollapsed = true;

            generator.prepareFormItems(scope);

            scope.object_id = scope.form_params.object_id;

            $log.debug('scope at after generate', scope);
            return scope;
        };
        /**
         * @memberof ulakbus.formService
         * @ngdoc function
         * @name group
         * @param scope
         * @description group function to group form layout by form meta data for layout
         * grouping will use an object like example below when parsing its items.
         * @example
         * `grouping = [
         *  {
         *      "groups": [
         *          {
         *              "group_title": "title1",
         *              "items": ["item1", "item2", "item3", "item4"],
         *          }
         *      ],
         *      "layout": "4",
         *      "collapse": False
         *  },
         *  {
         *      "groups": [
         *          {
         *              "group_title": "title2",
         *              "items": ["item5", "item6"],
         *          }
         *      ],
         *      "layout": "2",
         *      "collapse": False
         *  }]`
         *
         * @returns {*}
         * @param scope
         */
        generator.group = function (scope) {

            if (!scope.grouping) {
                return scope;
            }

            var newForm = [];

            var extractFormItem = function (itemList) {
                var extractedList = [];
                angular.forEach(itemList, function (value, key) {
                    var item = getFormItem(value);
                    if (item) {
                        extractedList.push(item);
                    }
                });

                $log.debug('extractedList: ', extractedList);

                return extractedList;
            };

            var getFormItem = function (item) {
                var formItem;
                if (scope.form.indexOf(item) > -1) {
                    formItem = scope.form[scope.form.indexOf(item)];
                    scope.form.splice(scope.form.indexOf(item), 1);
                    return formItem;
                } else {
                    angular.forEach(scope.form, function (value, key) {
                        if (value.key === item) {
                            formItem = value;
                            scope.form.splice(key, 1);
                            return;
                        }
                    });
                    return formItem;
                }
            };

            var makeGroup = function (itemsToGroup) {
                var subItems = [];
                angular.forEach(itemsToGroup, function (value, key) {
                    subItems.push({
                        type: 'fieldset',
                        items: extractFormItem(value.items),
                        title: value.group_title
                    });
                });
                return subItems;
            };

            angular.forEach(scope.grouping, function (value, key) {
                newForm.push(
                    {
                        type: 'fieldset',
                        items: makeGroup(value.groups),
                        htmlClass: 'col-md-' + value.layout,
                        title: value.group_title
                    }
                )
            });

            if (newForm.length > 0) {
                $log.debug('grouped form: ', newForm);
                $log.debug('rest of form: ', scope.form);
                $log.debug('form united: ', newForm.concat(scope.form));
            }
            scope.form = newForm.concat(scope.form);
            return scope;
        };
        /**
         * @description generates form constraints as async validators
         * async validators defined in form-constraints.js
         * keys are input names
         * @example
         * `
         * forms.constraints = {
         *
         *      // date field type constraint to greater than certain date
         *      'birth_date': {
         *          cons: 'gt_date',
         *          val: '22.10.1988',
         *          val_msg: 'Birthdate must be greater than 22.10.1988'
         *      },
         *      // a number field lesser than a certain number
         *      'number': {
         *          cons: 'lt',
         *          val: 50,
         *          val_msg: 'number must be lesser than 50'
         *      },
         *      // a field lesser than multiple fields' values
         *      'some_input': {
         *          cons: 'lt_m',
         *          val: ['this', 'and', 'that', 'inputs'],
         *          val_msg: 'some_input must be lesser than this, and, that, inputs'
         *      },
         *      // a field shows some other fields
         *      'some_input2': {
         *          cons: 'selectbox_fields',
         *          val: [
         *              {'val1': ['this', 'and']},
         *              {'val2': ['this2', 'and2']}]
         *          val_msg: 'some_input2 disables this, and, this, inputs'
         *      },
         *      // a field hides some other fields
         *      'some_input3': {
         *          cons: 'checkbox_fields',
         *          val: [
         *              {'val1': ['this', 'and']},
         *              {'val2': ['this2', 'and2']}]
         *          val_msg: 'some_input2 disables this, and, this, inputs'
         *      },
         *      // todo: a field change changes other field or fields values
         * }
         * `
         * @param scope
         */
        generator.constraints = function (scope) {
            angular.forEach(scope.form, function (v, k) {
                var cons = angular.isDefined(scope.forms) && angular.isDefined(scope.forms.constraints) && (scope.forms.constraints[v] || scope.forms.constraints[v.key]) || void 0;
                if (angular.isDefined(cons)) {
                    if (v.constructor === String) {
                        scope.form[k] = {
                            key: v,
                            validationMessage: {'form_cons': cons.val_msg},
                            $validators: {
                                form_cons: function (value) {
                                    return FormConstraints[cons.cons](value, cons.val, v);
                                }
                            }
                        };
                    } else {
                        v.key = v.key;
                        v.validationMessage = angular.extend({'form_cons': cons.val_msg}, v.validationMessage);
                        v.$validators = angular.extend({
                            form_cons: function (value) {
                                return FormConstraints[cons.cons](value, cons.val, v.key);
                            }
                        }, v.$asyncValidators);
                    }
                }
            });
            return generator.group(scope);
        };
        /**
         * @memberof ulakbus.formService
         * @ngdoc function
         * @name prepareFormItems
         * @param scope {Object} given scope on which form items prepared
         * @description
         * It looks up fields of schema objects and changes their types to proper type for schemaform.
         * To prepare items for schemaform loop items of scope.schema.properties by checking index value's `type` key.
         *
         * If `type` is in `['file', 'select', 'submit', 'date', 'int', 'text_general', 'model', 'ListNode', 'Node']`
         * then the item must be converted into the data format which schemaform works with.
         *
         *
         * For listnode, node and model types it uses templates to generate modal. The modal is aa instance of
         * ui.bootstraps modal directive.
         *
         * @returns scope {Object}
         */

        generator.prepareFormItems = function (scope) {

            angular.forEach(scope.form, function (value, key) {

                // parse markdown for help text
                if (value.type === 'help') {
                    var markdown = $filter('markdown');
                    value.helpvalue = value.helpvalue ? '<div class="alert alert-info">' + markdown(value.helpvalue) + '</div>' : value.helpvalue;
                }

                if (value.type === 'select') {
                    scope.schema.properties[value.key].type = 'select';
                    scope.schema.properties[value.key].titleMap = value.titleMap;
                    scope.form[key] = value.key;
                }
            });

            var _buttons = function (scope, v, k) {
                var buttonPositions = scope.modalElements ? scope.modalElements.buttonPositions : {
                    bottom: 'move-to-bottom',
                    top: 'move-to-top',
                    none: ''
                };
                var workOnForm = scope.modalElements ? scope.modalElements.workOnForm : 'formgenerated';
                var workOnDiv = scope.modalElements ? scope.modalElements.workOnDiv : '';
                var buttonClass = (buttonPositions[v.position] || buttonPositions.bottom);
                var redirectTo = scope.modalElements ? false : true;

                // in case backend needs styling the buttons
                // it needs to send style key with options below
                // btn-default btn-primary btn-success btn-info btn warning
                // btn-danger is default
                scope.form[scope.form.indexOf(k)] = {
                    type: v.type,
                    title: v.title,
                    style: (v.style || "btn-danger") + " hide bottom-margined " + buttonClass,
                    onClick: function () {
                        //indicate that the user have clicked some button like submit/cancel on form
                        generator.button_switch(false);
                        $rootScope.isUserClicked = true;
                        delete scope.form_params.cmd;
                        delete scope.form_params.flow;
                        if (v.cmd) {
                            scope.form_params["cmd"] = v.cmd;
                        }
                        if (v.flow) {
                            scope.form_params["flow"] = v.flow;
                        }
                        if (v.wf) {
                            delete scope.form_params["cmd"];
                            scope.form_params["wf"] = v.wf;
                        }
                        scope.model[k] = 1;
                        // todo: test it
                        if (scope.modalElements) {
                            scope.submitModalForm();
                        } else {
                            if (!v.form_validation && angular.isDefined(v.form_validation)) {
                                generator.submit(scope, redirectTo);
                            } else {
                                scope.$broadcast('schemaFormValidate');
                                if (scope[workOnForm].$valid) {
                                    generator.submit(scope, redirectTo);
                                    scope.$broadcast('disposeModal');
                                } else {
                                    // focus to first input with validation error
                                    $timeout(function () {
                                        var firsterror = angular.element(document.querySelectorAll('input.ng-invalid'))[0];
                                        if(firsterror){firsterror.focus()}
                                    });
                                }
                            }
                        }
                    }
                };
                // ADD CONSTRAINTS if cons

                // replace buttons according to their position values
                $timeout(function () {
                    var selectorBottom = '.buttons-on-bottom' + workOnDiv;
                    //var selectorTop = '.buttons-on-top'+workOnDiv;

                    var buttonsToBottom = angular.element(document.querySelector('.' + buttonClass));
                    angular.element(document.querySelector(selectorBottom)).append(buttonsToBottom);
                    //var buttonsToTop = angular.element(document.querySelector('.' + buttonClass));
                    //angular.element(document.querySelector(selectorTop)).append(buttonsToTop);

                    buttonsToBottom.removeClass('hide');
                    //buttonsToTop.removeClass('hide');
                }, 500);
            };
            var _numbers = function (scope, v, k) {
                v.type = 'number';
                v.validationMessage = {'max': 'bu alan -2147483647 ve 2147483647 arasında olmalıdır.'}
                v.$validators = {
                    max: function (value) {
                        return 2147483647 > value > -2147483647;
                    }
                };
                scope.model[k] = parseInt(scope.model[k]);
            };
            var _node_default = function (scope, v, k) {

                scope[v.type] = scope[v.type] || {};

                // no pass by reference
                scope[v.type][k] = angular.copy({
                    title: v.title,
                    form: [],
                    schema: {
                        properties: {},
                        properties_list: [],
                        required: [],
                        title: v.title,
                        type: "object",
                        formType: v.type,
                        model_name: k,
                        inline_edit: scope.inline_edit
                    },
                    buttons: v.buttons,
                    url: scope.url,
                    wf: v.wf || scope.wf,
                    quick_add: v.quick_add,
                    quick_add_view: v.quick_add_view,
                    quick_add_model: v.quick_add_model,
                    quick_add_field: v.quick_add_field,
                    nodeModelChange: function (item) {
                    }

                });

                angular.forEach(v.schema, function (item) {
                    scope[v.type][k].schema.properties[item.name] = angular.copy(item);

                    // save properties order in schema
                    if (item.name != 'idx') {
                        scope[v.type][k].schema.properties_list.push(scope[v.type][k].schema.properties[item.name]);
                    }

                    if (angular.isDefined(item.wf)) {
                        scope[v.type][k].schema.properties[item.name]['wf'] = angular.copy(item.wf);
                    }

                    // prepare required fields
                    if (item.required === true && item.name !== 'idx') {
                        scope[v.type][k].schema.required.push(angular.copy(item.name));
                    }

                    // idx field must be hidden
                    if (item.name !== 'idx') {
                        scope[v.type][k].form.push(item.name);
                    }

                    try {
                        if (item.type === 'date') {
                           // scope.model[k][item.name] = generator.dateformatter(scope.model[k][item.name]);
                        }
                    } catch (e) {
                        $log.debug('Error: ', e.message);
                    }


                });

                $timeout(function () {
                    if (v.type != 'ListNode') return;

                    // todo: needs refactor
                    var list = scope[v.type][k];
                    list.items = angular.copy(scope.model[k] || []);
                    angular.forEach(list.items, function (node, fieldName) {

                        if (!Object.keys(node).length) return;

                        angular.forEach(node, function (prop, propName) {

                            var propInSchema = list.schema.properties[propName];
                            try {

                                if (propInSchema.type === 'date') {
                                    node[propName] = moment(prop).format('DD.MM.YYYY');
                                    list.model[fieldName][propName] = moment(prop).format('DD.MM.YYYY');
                                }
                                if (propInSchema.type === 'select') {
                                    node[propName] = generator.item_from_array(prop.toString(), list.schema.properties[propName].titleMap)
                                }
                                if (propInSchema.titleMap) {
                                    node[propName] = {
                                        key: prop,
                                        unicode: generator.item_from_array(prop, propInSchema.titleMap)
                                    };
                                }
                            } catch (e) {
                                $log.debug('Field is not date');
                            }
                        });

                    });
                });

                scope.model[k] = scope.model[k] || [];

                scope[v.type][k].model = scope.model[k];

                // lengthModels is length of the listnode models. if greater than 0 show records on template
                scope[v.type][k]['lengthModels'] = scope.model[k] ? 1 : 0;

            };
            var _node_filter_interface = function (scope, v, k) {
                var formitem = scope.form[scope.form.indexOf(k)];
                var modelScope = {
                    "form_params": {
                        wf: v.wf || scope.wf || scope.form_params.wf,
                        model: v.model_name || v.schema[0].model_name,
                        cmd: v.list_cmd || 'select_list',
                        query: ''
                    }
                };

                scope.generateTitleMap = function (modelScope) {
                    generator.get_list(modelScope).then(function (res) {
                        formitem.titleMap = [];
                        angular.forEach(res.objects, function (item) {
                            if (item !== "-1") {
                                formitem.titleMap.push({
                                    "value": item.key,
                                    "name": item.value
                                });
                            }
                        });
                        formitem.filteredItems = generator.get_diff_array(angular.copy(formitem.titleMap), angular.copy(formitem.selectedFilteredItems), 1);
                    })
                };

                var modelItems = [];
                var modelKeys = [];

                angular.forEach(scope.model[k], function (value, mkey) {
                    modelItems.push({
                        "value": value[v.schema[0].name].key,
                        "name": value[v.schema[0].name].unicode
                    });
                    var modelKey = {};
                    modelKey[v.schema[0].name] = value[v.schema[0].name].key;
                    modelKeys.push(modelKey);
                });
                scope.model[k] = angular.copy(modelKeys);

                formitem = {
                    type: "template",
                    templateUrl: "/shared/templates/multiselect.html",
                    title: v.title,
                    // formName will be used in modal return to save item on form
                    formName: k,
                    wf: v.wf || scope.wf,
                    add_cmd: v.add_cmd,
                    name: v.model_name || v.schema[0].model_name,
                    model_name: v.model_name || v.schema[0].model_name,
                    filterValue: '',
                    selected_item: {},
                    filteredItems: [],
                    selectedFilteredItems: modelItems,
                    titleMap: scope.generateTitleMap(modelScope),
                    appendFiltered: function (filterValue) {
                        if (filterValue.length > 2) {
                            formitem.filteredItems = [];
                            angular.forEach(formitem.titleMap, function (value, key) {
                                if (value.name.indexOf(filterValue) > -1) {
                                    formitem.filteredItems.push(formitem.titleMap[key]);
                                }
                            });
                        }
                        if (filterValue <= 2) {
                            formitem.filteredItems = formitem.titleMap
                        }
                        formitem.filteredItems = generator.get_diff_array(formitem.filteredItems, formitem.selectedFilteredItems);
                    },
                    select: function (selectedItemsModel) {
                        if (!selectedItemsModel) {
                            return;
                        }
                        formitem.selectedFilteredItems = formitem.selectedFilteredItems.concat(selectedItemsModel);
                        formitem.appendFiltered(formitem.filterValue);
                        scope.model[k] = (scope.model[k] || []).concat(formitem.dataToModel(selectedItemsModel));
                    },
                    deselect: function (selectedFilteredItemsModel) {
                        if (!selectedFilteredItemsModel) {
                            return;
                        }
                        formitem.selectedFilteredItems = generator.get_diff_array(angular.copy(formitem.selectedFilteredItems), angular.copy(selectedFilteredItemsModel));
                        formitem.appendFiltered(formitem.filterValue);
                        formitem.filteredItems = formitem.filteredItems.concat(selectedFilteredItemsModel);
                        scope.model[k] = generator.get_diff_array(scope.model[k] || [], formitem.dataToModel(selectedFilteredItemsModel));
                    },
                    dataToModel: function (data) {
                        var dataValues = [];
                        angular.forEach(data, function (value, key) {
                            var dataKey = {};
                            dataKey[v.schema[0].name] = value.value;
                            dataValues.push(dataKey);
                        });
                        return dataValues;
                    }
                };

                scope.form[scope.form.indexOf(k)] = formitem;

            };
            // generate_fields covers all field types as functions
            var generate_fields = {
                button: {default: _buttons},
                submit: {default: _buttons},
                file: {
                    default: function (scope, v, k) {
                        scope.form[scope.form.indexOf(k)] = {
                            type: "template",
                            title: v.title,
                            templateUrl: "/shared/templates/filefield.html",
                            name: k,
                            key: k,
                            fileInsert: function () {
                                $scope.$broadcast('schemaForm.error.' + k, 'tv4-302', true);
                            },
                            validationMessage: {
                                'file': "Bu alan zorunludur."
                            },
                            $validators: {
                                file: function(value) {
                                    // check for null value
                                    if(!value){
                                        if (scope.schema.required.indexOf(k) > -1) {
                                            return false;
                                        }
                                        else{
                                            return true;
                                        }
                                    }
                                    return true;
                                }
                            },
                            imageSrc: scope.model[k] ? $rootScope.settings.static_url + scope.model[k] : '',
                            avatar: k === 'avatar'
                        };
                        // v.type = 'string';
                    }
                },
                select: {
                    default: function (scope, v, k) {
                        var nullExist = false;
                        for(var i=0; i<v.titleMap.length; i++){
                            if(v.titleMap[i].value ==='-1'){
                                nullExist = true;
                                break;
                            }
                        }
                        if(!nullExist){
                            titleMap: v.titleMap.unshift({name:"-",value:'-1'});
                        }
                        scope.form[scope.form.indexOf(k)] = {
                            type: "template",
                            title: v.title,
                            templateUrl: "/shared/templates/select.html",
                            name: k,
                            readonly: angular.isDefined(scope.forms)&&scope.forms.schema.properties[k].readonly,
                            key: k,
                            titleMap: v.titleMap,
                            validationMessage: {
                                'requiredMessage': 'Bu alan zorunludur.'
                            },
                            $validators:{
                                'requiredMessage':function (value) {
                                    if (scope.schema.required.indexOf(k) > -1) {
                                        {
                                            if(!value || value=='-1') {
                                                scope.model[k] = '-1';
                                                return false;
                                            }
                                            else {
                                                return true;
                                            }
                                        }
                                    } else {
                                        return true;
                                    }
                                    return true
                                }
                            }
                        };
                    }
                },
                confirm: {
                    default: function (scope, v, k) {
                        scope.form[scope.form.indexOf(k)] = {
                            type: "template",
                            title: v.title,
                            confirm_message: v.confirm_message,
                            templateUrl: "/shared/templates/confirm.html",
                            name: k,
                            key: k,
                            style: v.style,
                            buttons: v.buttons,
                            modalInstance: "",
                            // buttons is an object array
                            //Example:
                            //buttons: [{
                            //  text: "Button text",
                            //  cmd: "button command",
                            //  style: "btn-warning",
                            //  dismiss: false --> this one is for deciding if the button can dismiss modal
                            //}]
                            modalFunction: function () {
                                delete scope.form_params.cmd;
                                delete scope.form_params.flow;
                                if (v.cmd) {
                                    scope.form_params["cmd"] = v.cmd;
                                }
                                if (v.flow) {
                                    scope.form_params["flow"] = v.flow;
                                }
                                if (v.wf) {
                                    delete scope.form_params["cmd"];
                                    scope.form_params["wf"] = v.wf;
                                }

                                var modalInstance = $uibModal.open({
                                    animation: true,
                                    templateUrl: '/shared/templates/confirmModalContent.html',
                                    controller: 'ModalController',
                                    resolve: {
                                        items: function () {
                                            var newscope = {
                                                form: {
                                                    title: v.title,
                                                    confirm_message: v.confirm_message,
                                                    buttons: v.buttons,
                                                    onClick: function (cmd) {
                                                        // send cmd with submit
                                                        modalInstance.dismiss();
                                                        if (cmd) generator.submit(scope, false);
                                                    }
                                                }
                                            };
                                            return newscope;
                                        }
                                    }

                                });
                            },
                            openModal: function () {
                                var workOnForm = scope.modalElements ? scope.modalElements.workOnForm : 'formgenerated';
                                if (!v.form_validate && angular.isDefined(v.form_validate)) {
                                    this.modalFunction();
                                }
                                else {
                                    scope.$broadcast('schemaFormValidate');
                                    if (scope[workOnForm].$valid) {
                                        this.modalFunction();
                                    } else {
                                        // focus to first input with validation error
                                        $timeout(function () {
                                            var firsterror = angular.element(document.querySelectorAll('input.ng-invalid'))[0];
                                            firsterror.focus();
                                        });
                                    }
                                }
                            }
                        };
                    }
                },
                date: {
                    default: function (scope, v, k) {
                        $log.debug('date:', scope.model[k]);
                        scope.model[k] = Moment(scope.model[k]).toDate();

                        scope.form[scope.form.indexOf(k)] = {
                            key: k,
                            name: k,
                            readonly: angular.isDefined(scope.forms) && scope.forms.schema.properties[k]&&scope.forms.schema.properties[k].readonly,
                            title: v.title,
                            type: 'template',
                            templateUrl: '/shared/templates/datefield.html',
                            validationMessage: {
                                'date': "Girdiğiniz tarih geçerli değildir. <i>orn: '01.01.2015'<i/>",
                                'schemaForm': 'Bu alan zorunludur.'
                            },
                            $validators: {
                                date: function(value) {
                                    if(!value){ // check for null value
                                        if (scope.schema.required.indexOf(k) > -1) {
                                            return false;
                                        }
                                        else{
                                            return true;
                                        }
                                    } else if (Object.prototype.toString.call(value) === "[object Date]") {
                                        if ( isNaN( value.getTime() ) ) {
                                            if (scope.schema.required.indexOf(k) > -1) {
                                                return false;
                                            }
                                            else{
                                                return true;
                                            }
                                        }
                                        else {
                                            return true;
                                        }
                                    } else {
                                        if (isNaN(Date.parse(value))) {
                                            return false;
                                        } else {
                                            return true;
                                        }
                                    }
                                    return true
                                },
                                schemaForm: function(value) {
                                    if (scope.schema.required.indexOf(k) > -1) {
                                        {
                                            if(!value) {
                                                return false;
                                            }
                                            else {
                                                return true;
                                            }
                                        }
                                    } else {
                                        return true;
                                    }
                                    return true
                                }
                            },
                            status: {opened: false},
                            open: function ($event) {
                                this.disabled = true;
                                // scope.$apply();
                                scope.model[k] = angular.copy(scope.model[k]);
                                var that = this;
                                $timeout(function () {
                                    that.status.opened = true;
                                }, 100);
                            },
                            format: 'dd.MM.yyyy',
                            onSelect: function () {
                                // causes date picker error data will be formated when submiting
                                scope.model[k] = angular.copy(scope.model[k]);
                                return false;
                            }
                        };
                    }
                },
                int: {
                    default: function (scope, v, k) {
                        scope.form[scope.form.indexOf(k)] = {
                            type: "number",
                            title: v.title,
                            name: k,
                            key: k,
                            fieldHtmlClass: "integerField"
                        }
                    }
                },
                boolean: {
                    default: function (scope, v, k) {
                    }
                },
                string: {
                    default: function (scope, v, k) {
                        scope.form[scope.form.indexOf(k)] = {
                            key: k,
                            name: k,
                            title: v.title,
                            validationMessage: {
                                'min': function(ctx) { return "En az "+ctx.form.schema.min_length+" karakter uzunluğunda olmalıdır."},
                                'max': function(ctx) { return "En çok "+ctx.form.schema.max_length+" karakter uzunluğunda olmalıdır."}
                            },
                            $validators: {
                                min: function(value) {
                                    //check if min_length exist
                                    if (angular.isDefined(scope.schema.properties[k].min_length) && scope.schema.properties[k].min_length !== null) {
                                        return (value === null || value.length >= scope.schema.properties[k].min_length);
                                    }else {
                                        return true;
                                    }
                                },
                                max: function(value) {
                                    //check if max_length exist
                                    if (angular.isDefined(scope.schema.properties[k].max_length) && scope.schema.properties[k].max_length !== null) {
                                        return (value === null || value.length <= scope.schema.properties[k].max_length);
                                    }else {
                                        return true;
                                    }
                                }
                            }
                        };
                    }
                },
                password: {
                    default: function (scope, v, k) {
                        v.type = "string";
                        v["x-schema-form"] = {
                            type: "password",
                            placeholder: "******"
                        };
                    }
                },
                typeahead: {
                    default: function (scope, v, k) {
                        scope.form[scope.form.indexOf(k)] = {
                            type: "template",
                            title: v.title,
                            titleMap: v.titleMap,
                            templateUrl: "/shared/templates/typeahead.html",
                            name: k,
                            key: k,
                            onDropdownSelect: function (item, inputname) {
                                scope.model[k] = item.value;
                                $timeout(function () {
                                    document.querySelector('input[name=' + inputname + ']').value = item.name;
                                });
                            }
                        };
                        v.type = 'string';
                    },
                    custom: function (scope, v, k) {
                        scope.form[scope.form.indexOf(k)] = {
                            type: "template",
                            title: v.title,
                            widget: v.widget,
                            getTitleMap: function (viewValue) {
                                // v.view is where that value will looked up
                                var searchData = {
                                    "form_params": {
                                        "url": v.wf,
                                        "wf": v.wf,
                                        "view": v.view,
                                        "query": viewValue
                                    }
                                };
                                generator.get_list(searchData).then(function (res) {
                                    // response must be in titleMap format
                                    return res;
                                });
                            },
                            templateUrl: "/shared/templates/typeahead.html",
                            name: k,
                            key: k,
                            onDropdownSelect: function (item, inputname) {
                                scope.model[k] = item.value;
                                $timeout(function () {
                                    document.querySelector('input[name=' + inputname + ']').value = item.name;
                                });
                            }
                        };
                        v.type = 'string';
                    }
                },
                text_general: {
                    default: function (scope, v, k) {
                        v.type = 'string';
                        v["x-schema-form"] = {
                            "type": "textarea"
                        };
                        scope.form[scope.form.indexOf(k)] = {
                            key: k,
                            name: k,
                            title: v.title,
                            validationMessage: {
                                'min': function(ctx) { return "En az "+ctx.form.schema.min_length+" karakter uzunluğunda olmalıdır."},
                                'max': function(ctx) { return "En çok "+ctx.form.schema.max_length+" karakter uzunluğunda olmalıdır."}
                            },
                            $validators: {
                                min: function(value) {
                                    //check if min_length exist
                                    if (angular.isDefined(scope.schema.properties[k].min_length) && scope.schema.properties[k].min_length !== null) {
                                        return (value === null || value.length >= scope.schema.properties[k].min_length);
                                    }else {
                                        return true;
                                    }
                                },
                                max: function(value) {
                                    //check if max_length exist
                                    if (angular.isDefined(scope.schema.properties[k].max_length) && scope.schema.properties[k].max_length !== null) {
                                        return (value === null || value.length <= scope.schema.properties[k].max_length);
                                    }else {
                                        return true;
                                    }
                                }
                            }
                        };
                    }
                },
                float:  {
                    default: function (scope, v, k) {
                        scope.form[scope.form.indexOf(k)] = {
                            type: "number",
                            title: v.title,
                            name: k,
                            key: k
                        }
                    }
                },
                model: {
                    default: function (scope, v, k) {

                        var formitem = scope.form[scope.form.indexOf(k)];
                        var modelScope = {
                            "url": v.wf,
                            "wf": v.wf,
                            "form_params": {wf: v.wf, model: v.model_name, cmd: v.list_cmd}
                        };

                        //scope.$on('refreshTitleMap', function (event, data) {
                        // todo: write a function to refresh titleMap after new item add to linkedModel
                        //});

                        var generateTitleMap = function (modelScope) {
                            var wf_meta_data = wfMetadata.getWfMeta();
                            if (angular.isDefined(wf_meta_data) && Object.keys(wf_meta_data).length !== 0) {
                                modelScope.form_params.wf_meta = wf_meta_data;
                            }
                            return generator.get_list(modelScope).then(function (res) {
                                formitem.titleMap = [];
                                angular.forEach(res.objects, function (item) {
                                    if (item !== -1) {
                                        if(item!==0){
                                            formitem.titleMap.push({
                                                "value": item.key,
                                                "name": item.value
                                            });
                                        }else{
                                            formitem.titleMap.push({
                                                "value": '',
                                                "name": ''
                                            });
                                        }
                                    } else {
                                        formitem.focusToInput = true;
                                    }
                                });

                                return formitem.titleMap;

                            });
                        };

                        formitem = {
                            type: "template",
                            templateUrl: "/shared/templates/foreignKey.html",
                            // formName will be used in modal return to save item on form
                            formName: k,
                            title: v.title,
                            wf: v.wf,
                            add_cmd: v.add_cmd,
                            name: k,
                            key: k,
                            model_name: v.model_name,
                            selected_item: {},
                            titleMap: [],
                            onSelect: function (item, inputname) {
                                scope.model[k] = item.value;
                                $timeout(function () {
                                    document.querySelector('input[name=' + inputname + ']').value = item.name;
                                });
                            },
                            onDropdownSelect: function (item, inputname) {
                                scope.model[k] = item.value;
                                $timeout(function () {
                                    document.querySelector('input[name=' + inputname + ']').value = item.name;
                                });
                            },
                            getTitleMap: function (viewValue) {
                                modelScope.form_params.query = viewValue;
                                if(modelScope.form_params.cmd === 'select_list'){
                                    modelScope.form_params.wf = 'crud';
                                }
                                return generateTitleMap(modelScope);
                            },
                            getDropdownTitleMap: function () {
                                delete modelScope.form_params.query;
                                formitem.gettingTitleMap = true;
                                modelScope.form_params.wf = 'crud';
                                generateTitleMap(modelScope)
                                    .then(function (data) {
                                        formitem.titleMap = data;
                                        formitem.gettingTitleMap = false;
                                    });
                            }
                        };

                        scope.form[scope.form.indexOf(k)] = formitem;

                        // get selected item from titleMap using model value
                        if (scope.model[k]) {
                            var form_params = {
                                wf: v.wf,
                                model: v.model_name,
                                object_id: scope.model[k],
                                cmd: 'object_name'
                            };
                            var wf_meta_data = wfMetadata.getWfMeta();
                            if (angular.isDefined(wf_meta_data) && Object.keys(wf_meta_data).length !== 0) {
                                form_params.wf_meta = wf_meta_data;
                            }

                            generator.get_list({
                                url: 'crud',
                                form_params: form_params
                            }).then(function (data) {

                                try {
                                    $timeout(function () {
                                        document.querySelector('input[name=' + k + ']').value = data.object_name;
                                    }, 200);

                                }
                                catch (e) {
                                    document.querySelector('input[name=' + k + ']').value = data.object_name;
                                    $log.debug('exception', e);
                                }

                            });
                        }
                    }
                },
                Node: {
                    default: _node_default,
                    filter_interface: _node_filter_interface
                },
                ListNode: {
                    default: _node_default,
                    filter_interface: _node_filter_interface
                }
            };

            // todo: delete after constraints done
            // scope.forms = scope.forms || {};
            // scope.forms.constraints = {
            //     "cinsiyet": {
            //         "cons": "selectbox_fields",
            //         "val":
            //            {'1': ["kiz_kardes_sayisi"], '2': ["erkek_kardes_sayisi"]},
            //         "val_msg": "Erkek kardes sayisi kiz kardes sayisindan az olamaz."
            //     }
            // };

            angular.forEach(scope.schema.properties, function (v, k) {
                // generically change _id fields model value
                if ('form_params' in scope) {
                    if (k == scope.form_params.param) {
                        scope.model[k] = scope.form_params.id;
                        scope.form.splice(scope.form.indexOf(k), 1);
                        return;
                    }
                }
                try {
                    generate_fields[v.type][v.widget || 'default'](scope, v, k);
                }
                catch (e) {
                    // todo: raise not implemented
                }
            });

            $log.debug('scope at after prepareformitems', scope);
            return generator.constraints(scope);
        };
        /**
         * @memberof ulakbus.formService
         * @ngdoc function
         * @name dateformatter
         * @description dateformatter handles all date fields and returns humanized and jquery datepicker format dates
         * @param {Object} formObject
         * @returns {*}
         */
        generator.dateformatter = function (formObject) {


            var ndate = new Date(formObject);
            //var newdate = ndate.toString.call(ndate);
            if (isNaN(ndate)) {
                return null;
            } else {

                var newdatearray = Moment(ndate).format('DD.MM.YYYY');
                $log.debug('date formatted: ', newdatearray);
                return newdatearray;
            }
        };
        /**
         * @memberof ulakbus.formService
         * @ngdoc function
         * @name doItemAction
         * @description `mode` could be in ['normal', 'modal', 'new'] . the default mode is 'normal' and it loads data
         * on same
         * tab without modal. 'modal' will use modal to manipulate data and do all actions in that modal. 'new'
         * will be open new page with response data
         * @param {Object} $scope
         * @param {string} key
         * @param {Object} todo
         * @param {string} mode
         * @returns {*}
         */
        generator.doItemAction = function ($scope, key, todo, mode) {
            $scope.form_params.cmd = todo.cmd;
            $scope.form_params.wf = $scope.wf;
            if (todo.wf) {
                $scope.url = todo.wf;
                $scope.form_params.wf = todo.wf;
                delete $scope.token;
                delete $scope.form_params.model;
                delete $scope.form_params.cmd
            }
            if (todo.object_key) {
                $scope.form_params[todo.object_key] = key;
            } else {
                $scope.form_params.object_id = key;
            }
            $scope.form_params.param = $scope.param;
            $scope.form_params.id = $scope.param_id;
            $scope.form_params.token = $scope.token;
            //this will execute for edit/delete buttons
            var wf_meta_data = wfMetadata.getWfMeta();
            if (angular.isDefined(wf_meta_data) && Object.keys(wf_meta_data).length !== 0) {
                $scope.form_params.wf_meta = wf_meta_data;
            }

            var _do = {
                normal: function () {
                    $log.debug('normal mode starts');
                    return generator.get_wf($scope);
                },
                modal: function () {
                    $log.debug('modal mode starts');
                    var modalInstance = $uibModal.open({
                        animation: true,
                        backdrop: 'static',
                        keyboard: false,
                        templateUrl: '/shared/templates/confirmModalContent.html',
                        controller: 'ModalController',
                        size: '',
                        resolve: {
                            items: function () {
                                var newscope = {
                                    form: {
                                        buttons: [{text: "Evet", style: "btn-success", cmd: "confirm"}, {
                                            text: "Hayir",
                                            "style": "btn-warning",
                                            dismiss: true
                                        }],
                                        title: todo.name,
                                        confirm_message: "Islemi onayliyor musunuz?",
                                        onClick: function (cmd) {
                                            modalInstance.close();
                                            if (cmd === "confirm" && angular.isDefined(cmd)) {
                                                modalInstance.close();
                                                return generator.get_wf($scope);
                                            }
                                        }

                                    }
                                }
                                return newscope;
                            }
                        }
                    });


                },
                new: function () {
                    $log.debug('new mode is not not ready');
                }
            };
            return _do[mode]();
        };
        /**
         * @memberof ulakbus.formService
         * @ngdoc function
         * @name button_switch
         * @description Changes html disabled and enabled attributes of all buttons on current page.
         * @param {boolean} position
         */
        // todo: remove
        generator.button_switch = function (position) {
            var buttons = angular.element(document.querySelectorAll('button'));
            var positions = {true: "enabled", false: "disabled"};
            angular.forEach(buttons, function (button, key) {
                button[positions[position]] = true;
            });
            $log.debug('buttons >> ', positions[position])
        };
        /**
         * @memberof ulakbus.formService
         * @ngdoc function
         * @name get_form
         * @description Communicates with api with given scope object.
         * @param {Object} scope
         * @returns {*}
         */
        generator.get_form = function (scope) {
            return WSOps.request(scope.form_params)
                .then(function (data) {
                    wfMetadata.setWfMeta(data.wf_meta);
                    return generator.generate(scope, data);
                })
        };
        /**
         * @memberof ulakbus.formService
         * @ngdoc function
         * @name get_list
         * @description gets list of related wf/model
         * @param scope
         * @returns {*}
         */
        generator.get_list = function (scope) {
            var form_params = scope.form_params;

            var isSearchResult = ((form_params.cmd === 'select_list' || form_params.cmd === 'object_name') && (form_params.wf === 'crud'))?true:false;

            return WSOps.request(form_params)
                .then(function (data) {
                    //we need to set the wf_meta of the main wf and not from the response of typeahead
                    if(!isSearchResult){
                        wfMetadata.setWfMeta(data.wf_meta);
                    }
                    return data;
                });
        };
        /**
         * @memberof ulakbus.formService
         * @ngdoc function
         * @name get_wf
         * @description get_wf is the main function for client_cmd based api calls
         * based on response content it redirects to related path/controller with pathDecider function
         * @param scope
         * @returns {*}
         */
        generator.get_wf = function (scope) {
            if(scope.isPublicAccess){
                var obj = {
                    form_params : {
                        param:null
                    },
                    url : scope.wf
                };
                return $http
                    .post(generator.makeUrl(obj), scope.form_params)
                    .success(function (data) {
                        wfMetadata.setWfMeta(data.wf_meta);
                        return generator.pathDecider(data.client_cmd || ['list'], scope, data);
                    });
            }else{
                return WSOps.request(scope.form_params)
                    .then(function (data) {
                        wfMetadata.setWfMeta(data.wf_meta);
                        return generator.pathDecider(data.client_cmd || ['list'], scope, data);
                    });
            }
        };
        /**
         * @memberof ulakbus.formService
         * @ngdoc property
         * @name pageData
         * @description pageData object is moving object from response to controller
         * with this object controller will not need to call the api for response object to work on to
         * @type {{}}
         */
        generator.pageData = {};
        generator.getPageData = function () {
            return generator.pageData;
        };
        generator.setPageData = function (value) {
            generator.pageData = value;
        };
        /**
         * @memberof ulakbus.formService
         * @ngdoc function
         * @name pathDecider
         * @description pathDecider is used to redirect related path by looking up the data in response
         * @param {string} client_cmd
         * @param {Object} $scope
         * @param {Object} data
         */
        generator.pathDecider = function (client_cmd, $scope, data) {

            /**
             * @memberof ulakbus.formService
             * @ngdoc function
             * @name redirectTo
             * @description redirectTo function redirects to related controller and path with given data
             * before redirect setPageData must be called and pageData need to be defined
             * otherwise redirected path will call api for its data
             * @param {Object} scope
             * @param {string} page
             * @return {*}
             */
            function redirectTo(scope, page) {
                var pathUrl;
                if(angular.isDefined($route.current.$$route.isPublic) && $route.current.$$route.isPublic){
                    pathUrl= '/pub/' + scope.form_params.wf;
                    $rootScope.$broadcast("setPublicWf", true);
                }else{
                    pathUrl= '/' + scope.form_params.wf;
                }
                if (scope.form_params.model) {
                    pathUrl += '/' + scope.form_params.model + '/do/' + page;
                } else {
                    pathUrl += '/do/' + page;
                }
                $timeout(function () {
                    $rootScope.$broadcast("hide_main_loader");
                });
                // todo add object url to path
                // pathUrl += '/'+scope.form_params.object_id || '';

                // if generated path url and the current path is equal route has to be reload
                if ($location.path() === pathUrl) {
                    return $route.reload();
                } else {
                    $location.path(pathUrl);
                }
            }

            /**
             * @memberof ulakbus.formService
             * @ngdoc function
             * @name dispatchClientCmd
             * @description Sets params for scope to the related page and redirect to the page in client_cmd param.
             * client_cmd can be in ['list', 'form', 'show', 'reload', 'reset']
             */
            function dispatchClientCmd() {
                data[$scope.form_params.param] = $scope.form_params.id;
                data['model'] = $scope.form_params.model;
                data['wf'] = $scope.form_params.wf;
                data['param'] = $scope.form_params.param;
                data['param_id'] = $scope.form_params.id;
                data['pageData'] = true;
                //data['second_client_cmd'] = client_cmd[1];
                generator.setPageData(data);

                redirectTo($scope, client_cmd[0]);
            }

            dispatchClientCmd();
        };
        /**
         * @memberof ulakbus.formService
         * @ngdoc function
         * @name get_diff
         * @description returns diff of the second param to first param
         * @param {Object} obj1
         * @param {Object} obj2
         * @returns {Object} diff object of two given objects
         */
        generator.get_diff = function (oldObj, newObj) {
            var result = {};
            angular.forEach(newObj, function (value, key) {
                if (oldObj[key]) {
                    if ((oldObj[key].constructor === newObj[key].constructor) && (newObj[key].constructor === Object || newObj[key].constructor === Array)) {
                        angular.forEach(value, function (v, k) {
                            if (oldObj[key][k] != value[k]) {
                                result[key][k] = angular.copy(value[k]);
                            }
                        });
                    } else {
                        if (oldObj[key] != newObj[key]) {
                            result[key] = angular.copy(newObj[key]);
                        }
                    }
                } else {
                    result[key] = angular.copy(newObj[key]);
                }
            });
            return result;
        };
        /**
         * @memberof ulakbus.formService
         * @ngdoc function
         * @name get_diff_array
         * @description extracts items of second array from the first array
         * @param {Array} array1
         * @param {Array} array2
         * @param {Number} way
         * @returns {Array} diff of arrays
         */
        generator.get_diff_array = function (array1, array2, way) {
            var result = [];
            angular.forEach(array1, function (value, key) {
                if (way === 1) {
                    if (angular.toJson(array2).indexOf(value.value) < 0) {
                        result.push(value);
                    }
                } else {
                    if (angular.toJson(array2).indexOf(angular.toJson(value)) < 0) {
                        result.push(value);
                    }
                }
            });
            return result;
        };
        /**
         * @memberof ulakbus.formService
         * @ngdoc function
         * @name item_from_array
         * @description gets item unicode name from titleMap
         * @param {Object} item
         * @param {Array} array
         * @returns {*}
         */
        generator.item_from_array = function (item, array) {
            var result = item;
            angular.forEach(array, function (value, key) {
                if (value.value === item) {
                    result = value.name;
                }
            });
            return result;
        };

        /**
         * @memberof ulakbus.formService
         * @ngdoc function
         * @name submit
         * @description Submit function is generic function for submiting forms.
         * - redirectTo param is used for redirect if return value will be evaluated in a new page.
         * - In case of unformatted date object in any key recursively, it must be converted by convertDate function.
         * - ListNode and Node objects get seperated from model in
         * {@link prepareFormItems module:ulakbus.formService.function:prepareFormItems} They must be concat to model
         * key of scope first.
         * - Backend API waits form as model value. So `data.form` key must be set to `$scope.model`
         * - Other parameters we pass to backend API are shown in the example below
         * ```
         *  var data = {
                "form": $scope.model,
                "token": $scope.token,
                "model": $scope.form_params.model,
                "cmd": $scope.form_params.cmd,
                "flow": $scope.form_params.flow,
                "object_id": $scope.object_id,
                "filter": $scope.filter,
                "query": $scope.form_params.query
            };
         * ```
         *
         * Special response object process
         * -------------------------------
         *
         * - If response object is a downloadable pdf file, checking from headers `headers('content-type') ===
         * "application/pdf"` download using Blob object.
         *
         * @param {Object} $scope
         * @param {Object} redirectTo
         * @param {Boolean} dontProcessReply - used in modal forms
         * @returns {*}
         * @todo diff for all submits to recognize form change. if no change returns to view with no submit
         */
        generator.submit = function ($scope, redirectTo, dontProcessReply) {

            var checkAndReformatModel = function (model) {
                var modelKeys = Object.keys(model);
                for(var i=0; i < modelKeys.length; i++){
                    if(typeof(model[modelKeys[i]]) === 'object'){
                        formatTypeaheadStructure(model[modelKeys[i]]);
                    }

                }
            };

            var formatTypeaheadStructure = function (listNodeModel) {
                if(angular.isUndefined(listNodeModel) || listNodeModel === null || listNodeModel.length === 0 ){
                    return;
                }
                for(var i=0; i<listNodeModel.length; i++){
                    var key = Object.keys(listNodeModel[i]);
                    if(key.length === 1){
                        var modelKeys = Object.keys(listNodeModel[i][key]);
                        if(modelKeys.indexOf('verbose_name') > -1 && modelKeys.indexOf('unicode') > -1 && modelKeys.indexOf('key') > -1 ){
                            var value = listNodeModel[i][key]['key'];
                            listNodeModel[i] = {};
                            listNodeModel[i][key] = value;

                        }
                    }
                }
            };

            angular.forEach($scope.form, function (v, k) {
                if (typeof v === 'object' && v.templateUrl && v.templateUrl.indexOf("/select.html") != -1) {
                    if ($scope.model[v.name] === "-1") {
                        delete $scope.model[v.name]
                    }
                }
            });

            angular.forEach($scope.ListNode, function (value, key) {
                $scope.model[key] = value.model;
            });
            angular.forEach($scope.Node, function (value, key) {
                $scope.model[key] = value.model;
            });

            //format date without changing scopes date objects
            var model = angular.copy($scope.model);
            generator.convertDate(model);

            // todo: unused var delete
            var send_data = {
                "form": model,
                "object_key": $scope.object_key,
                "token": $scope.token,
                "model": $scope.form_params.model,
                "wf": $scope.form_params.wf,
                "cmd": $scope.form_params.cmd,
                "flow": $scope.form_params.flow,
                "object_id": $scope.object_id,
                "filter": $scope.filter,
                "query": $scope.form_params.query
            };
            //check if wf_meta is present or not
            var wf_meta_data = wfMetadata.getWfMeta();
            if (angular.isDefined(wf_meta_data) && Object.keys(wf_meta_data).length !== 0) {
                send_data.wf_meta = wf_meta_data;
            }
            //reformat typeahead data structure for listnode
            checkAndReformatModel(model);
            if($scope.isPublicAccess){
                var obj = {
                    form_params : {
                        param:null
                    },
                    url : send_data.wf
                };
                return $http
                    .post(generator.makeUrl(obj), send_data)
                    .success(function (data) {
                        // if response data.cmd is 'upgrade'
                        wfMetadata.setWfMeta(data.wf_meta);
                        if (!dontProcessReply) {
                            return generator.pathDecider(data.client_cmd || ['list'], $scope, data);
                        }

                        return data;
                    });
            }else{
                return WSOps.request(send_data)
                    .then(function (data) {
                        if (data.cmd === "logout") {
                            $cookies.put("logoutmsg",angular.toJson({title:data.title,msg:data.msg,type:"warning"}));
                            $log.debug("loggedout");
                            WSOps.close('loggedout');
                            $location.path("/login");
                            window.location.reload();
                            return;
                        }

                        wfMetadata.setWfMeta(data.wf_meta);

                        if (!dontProcessReply) {
                            return generator.pathDecider(data.client_cmd || ['list'], $scope, data);
                        }
                        return data;
                    });
            }

        };

        /**
         * In case of unformatted date object in any key recursively, it must be converted.
         * @param model
         */
        generator.convertDate = function (model) {
            angular.forEach(model, function (value, key) {
                if (value && value.constructor === Date) {
                    model[key] = generator.dateformatter(value);
                } else if (value && value.constructor === Object) {
                    // check recursively
                    generator.convertDate(value);
                }
            });
        };
        return generator;
    })
    /**
     * @memberof ulakbus.formService
     * @ngdoc controller
     * @name ModalController
     * @description controller for listnode, node and linkedmodel modal and save data of it
     * @param {Object} items
     * @param {Object} $scope
     * @param {Object} $uibModalInstance
     * @param {Object} $route
     * @returns {Object} returns value for modal
     */
    .controller('ModalController', function ($scope, $uibModalInstance, Generator, items, $timeout, Utils) {
        angular.forEach(items, function (value, key) {
            $scope[key] = items[key];
        });

        $scope.$on('disposeModal', function () {
            $scope.cancel();
        });

        $scope.$on('modalFormLocator', function (event) {
            // fix default model with unicode assign
            $timeout(function () {
                Utils.iterate($scope.model, function (modelValue, k) {
                    if (angular.isUndefined($scope.edit)) return;
                    var unicode = $scope.items[$scope.edit][k];
                    //unicode will be undefined if edit is done after saving the parent record
                    if(angular.isUndefined(unicode) || unicode === null){
                        unicode = $scope.items[$scope.edit][k].unicode;

                    }
                    if (unicode) {
                        //if the value is a date object then format the date
                        if(Object.prototype.toString.call(unicode) === '[object Date]'){
                            unicode = moment(unicode).format('DD.MM.YYYY');
                        }
                        document.querySelector('input[name=' + k + ']').value = unicode;
                    }
                })
            },100);  //to make sure that the modal is loaded first and then the values are assigned to its html controls
            $scope.linkedModelForm = event.targetScope.linkedModelForm;
        });

        $scope.$on('submitModalForm', function () {
            $scope.onSubmit($scope.linkedModelForm);
        });

        $scope.$on('validateModalDate', function (event, field) {
            $scope.$broadcast('schemaForm.error.' + field, 'tv4-302', true);
        });

        $scope.onSubmit = function (form) {
            $scope.$broadcast('schemaFormValidate');
            if (form.$valid) {
                // send form to modalinstance result function
                $uibModalInstance.close($scope);
            }
        };

        $scope.onNodeSubmit = function () {
            $scope.$broadcast('schemaFormValidate');
            if ($scope.modalForm.$valid) {
                $uibModalInstance.close($scope);
            }
        };

        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };
    })

    /**
     * @memberof ulakbus.formService
     * @ngdoc directive
     * @name modalForNodes
     * @description add modal directive for nodes
     * @param {Module} $uibModal
     * @param {Service} Generator
     * @returns {Object} openmodal directive
     */

    .directive('modalForNodes', function ($uibModal, Generator, Utils) {
        return {
            link: function (scope, element, attributes) {
                element.on('click', function () {
                    var modalInstance = $uibModal.open({
                        animation: true,
                        backdrop: 'static',
                        keyboard: false,
                        templateUrl: '/shared/templates/listnodeModalContent.html',
                        controller: 'ModalController',
                        size: 'lg',
                        resolve: {
                            items: function () {
                                var attribs = attributes.modalForNodes.split(',');
                                // get node from parent scope catch with attribute
                                var node = angular.copy(scope.$parent[attribs[1]][attribs[0]]);

                                if (attribs[2] === 'add') {
                                    node.model = {};
                                }

                                if (attribs[3]) {
                                    // if listnode catch edit object with index
                                    node.model = node.model[attribs[3]];
                                }

                                // tell result.then function which item to edit
                                node.edit = attribs[3];

                                scope.node.schema.wf = scope.node.url;

                                angular.forEach(scope.node.schema.properties, function (value, key) {
                                    if (angular.isDefined(scope.node.schema.properties[key].wf)) {
                                    }
                                    else {
                                        scope.node.schema.properties[key].wf = scope.node.url;
                                    }
                                    scope.node.schema.properties[key].list_cmd = 'select_list';
                                });

                                // scope.node.schema.footerButtons = [
                                //     {type: "submit", text:"Onayla", style:"btn-success" },
                                //     {type: "button", text:"Vazgec", style:"btn-danger" },
                                // ]

                                var newscope = {
                                    wf: scope.node.wf,
                                    url: scope.node.url,
                                    form_params: {model: scope.node.schema.model_name},
                                    edit: attribs[3]
                                };

                                Generator.generate(newscope, {forms: scope.node});
                                // modal will add only one item to listNode, so just need one model (not array)
                                newscope.model = newscope.model[node.edit] || {};
                                return newscope;
                            }
                        }
                    });

                    modalInstance.result.then(function (childmodel, key) {

                        var listNodeItem = scope.$parent[childmodel.schema.formType][childmodel.schema.model_name];
                        if (childmodel.schema.formType === 'Node') {
                            listNodeItem.model = angular.copy(childmodel.model);
                            listNodeItem.lengthModels += 1;
                        }

                        if (childmodel.schema.formType === 'ListNode') {
                            // reformat listnode model
                            var reformattedModel = {};

                            angular.forEach(childmodel.model, function (value, key) {


                                  if(key === 'baslama_tarihi' || key === 'bitis_tarihi'){

                                        childmodel.model[key] = moment(value).format('DD.MM.YYYY');
                                        console.log('----------------------\n',childmodel.model);

                                   }

                                if (key.indexOf('_id') > -1) {

                                    // todo: understand why we got object here!
                                    // hack to fix bug with value as object
                                    if (angular.isObject(value) && value.value) {
                                        value = value.value;
                                        childmodel.model[key] = value;
                                    }

                                    angular.forEach(childmodel.form, function (v, k) {
                                        if (v.formName === key) {
                                            //if (!childmodel.model[key].key) {
                                            var unicodeValue = v.titleMap.find(function (element, index, array) {
                                                if (element['value'] === value) {
                                                    return element;
                                                }
                                            });
                                            if (unicodeValue) {
                                                unicodeValue = unicodeValue.name;
                                                reformattedModel[key] = {
                                                    "key": value,
                                                    "unicode": unicodeValue
                                                }
                                            }

                                            //}
                                        } 
                                    });
                                }


                               // childmodel.model[key] = Generator.dateformatter(value);
                                // console.log('----------------------\n',childmodel.model);

                                reformattedModel[key] = {
                                        "key": key,
                                        "unicode": Generator.item_from_array(value, childmodel.schema.properties[key].titleMap)
                                    };


                            });


                            if (childmodel.edit) {

                                listNodeItem.model[childmodel.edit] = childmodel.model;
                                //Generator.convertDate(reformattedModel);
                                if (Object.keys(reformattedModel).length > 0) {
                                    listNodeItem.items[childmodel.edit] = reformattedModel;
                                } else {
                                    listNodeItem.items[childmodel.edit] = angular.copy(childmodel.model);
                                }
                            } else {

                                 listNodeItem.model.push(angular.copy(childmodel.model));
                                 Generator.convertDate(reformattedModel);
                                if (Object.keys(reformattedModel).length > 0) {
                                    listNodeItem.items.push(reformattedModel);
                                } else {
                                    listNodeItem.items.push(angular.copy(childmodel.model));

                                }
                            }
                            listNodeItem.lengthModels += 1;
                        }
                    });
                });
            }
        };
    })


    /**
     * @memberof ulakbus.formService
     * @ngdoc directive
     * @name addModalForLinkedModel
     * @description add modal directive for linked models
     * @param {Module} $uibModal
     * @param {Object} $rootScope
     * @param {Module} $route
     * @param {Service} Generator
     * @returns {Object} openmodal directive
     */
    .directive('addModalForLinkedModel', function ($uibModal, $rootScope, $route, Generator) {
        return {
            link: function (scope, element, attributes) {
                element.on('click', function () {
                    var modalInstance = $uibModal.open({
                        animation: true,
                        backdrop: 'static',
                        keyboard: false,
                        templateUrl: '/shared/templates/linkedModelModalContent.html',
                        controller: 'ModalController',
                        size: 'lg',
                        resolve: {
                            items: function () {
                                var formName = attributes.addModalForLinkedModel;
                                return Generator.get_form({
                                    form_params: {
                                        wf: scope.form.wf,
                                        model: scope.form.model_name,
                                        cmd: scope.form.add_cmd
                                    },
                                    modalElements: {
                                        // define button position properties
                                        buttonPositions: {
                                            bottom: 'move-to-bottom-modal',
                                            top: 'move-to-top-modal',
                                            none: ''
                                        },
                                        workOnForm: 'linkedModelForm',
                                        workOnDiv: '-modal' + formName
                                    },
                                    submitModalForm: function () {
                                        $rootScope.$broadcast('submitModalForm');
                                    },
                                    validateModalDate: function (field) {
                                        $rootScope.$broadcast('validateModalDate', field);
                                    },
                                    formName: formName
                                });
                            }
                        }
                    });

                    modalInstance.result.then(function (childscope, key) {
                        var formName = childscope.formName;
                        Generator.submit(childscope, false, true).then(
                            function (data) {
                                // response data contains object_id and unicode
                                // scope.form can be reached via prototype chain
                                var item = {
                                    value: data.forms.model.object_key,
                                    name: data.forms.model.unicode
                                };
                                scope.form.titleMap.push(item);
                                scope.form.onSelect(item, formName);

                            });
                    });
                });
            }
        };
    })

    /**
     * @memberof ulakbus.formService
     * @ngdoc directive
     * @name modalFormLocator
     * @description This directive helps to locate form object in modal.
     * @returns {Object} form object
     */
    .directive('modalFormLocator', function () {
        return {
            link: function (scope) {
                scope.$emit('modalFormLocator');
            }
        }
    });


/**
 * @license Ulakbus-UI
 * Copyright (C) 2015 ZetaOps Inc.
 *
 * This file is licensed under the GNU General Public License v3
 * (GPLv3).  See LICENSE.txt for details.
 */

'use strict';
/**
 * @ngdoc module
 * @name ulakbus.crud
 * @module ulakbus.crud
 * @description
 * ulakbus.crud module is the main module for ui. It interacts with backend and manipulate data to screen
 * generically.
 *
 * @requires ui.bootstrap
 * @requires schemaForm
 * @requires ulakbus.formService
 * @type {ng.$compileProvider|*}
 */
angular.module('ulakbus.crud', ['schemaForm', 'ui.bootstrap', 'ulakbus.formService'])
    .config(function (sfErrorMessageProvider) {
        sfErrorMessageProvider.setDefaultMessage(302, 'Bu alan zorunludur.');
        sfErrorMessageProvider.setDefaultMessage(200, 'En az {{schema.minLength}} değer giriniz.');
        sfErrorMessageProvider.setDefaultMessage(201, 'En fazla {{schema.minLength}} değer giriniz.');
    })

    /**
     * @memberof ulakbus.crud
     * @ngdoc service
     * @name CrudUtility
     * @description Crud Utility is a service to provide generic functions for Crud controllers to format data and
     * scope object.
     * @returns {service}
     */
    .service('CrudUtility', function ($log, $rootScope) {
        return {
            /**
             * @memberof ulakbus.crud
             * @ngdoc function
             * @name generateParam
             * @description generateParam is a function to generate required params to send backend api.
             * backend needs that params to work without errors
             * @param {object} scope
             * @param {object} routeParams
             * @param {string} cmd
             * @returns {object} scope
             */
            generateParam: function (scope, routeParams, cmd) {
                scope.url = routeParams.wf;

                angular.forEach(routeParams, function (value, key) {
                    if (key.indexOf('_id') > -1 && key !== 'param_id') {
                        scope.param = key;
                        scope.param_id = value;
                    }
                });

                scope.form_params = {
                    //cmd: cmd,
                    // model name in ulakbus
                    model: routeParams.model,
                    // generic value passing by backend. would be any of these: id, personel_id, etc.
                    param: scope.param || routeParams.param,
                    // generic value passing by backend. would be the value of param
                    id: scope.param_id || routeParams.param_id,
                    wf: routeParams.wf,
                    object_id: routeParams.key,
                    filters: {},
                    token: routeParams.token
                };

                if (scope.param_id) {
                    scope.form_params.filters[scope.param] = {values: [scope.param_id], type: 'check'};
                    // do not use selected user, get and broadcast data of user in param_id
                    //$rootScope.$broadcast('selectedUserTrigger', [scope.param, scope.param_id]);
                }

                scope.model = scope.form_params.model;
                scope.wf = scope.form_params.wf;
                scope.param = scope.form_params.param;
                scope.param_id = scope.form_params.id;
                return scope;
            },
            /**
             * @memberof ulakbus.crud
             * @ngdoc function
             * @name listPageItems
             * @description listPageItems is a function to prepare objects to list in the list page.
             *
             * @param {object} scope
             * @param {object} pageData
             */
            listPageItems: function (scope, pageData) {
                angular.forEach(pageData, function (value, key) {
                    scope[key] = value;
                });
                // when selective_list is sent with meta key it means
                // "objects" is a list of "objects"s
                if (scope.meta && scope.meta['selective_listing'] === true) {
                    angular.forEach(scope.objects, function (_v, _k) {
                        angular.forEach(_v.objects, function (value, key) {
                            if (_v.selected === true) {
                                scope.selected_key = _k;
                            }
                            if (key > 0) {
                                var linkIndexes = {};
                                angular.forEach(value.actions, function (v, k) {
                                    if (v.show_as === 'link') {linkIndexes = v}
                                });
                                angular.forEach(value.fields, function (v, k) {
                                    try {
                                        if (value.actions.length > 0 && linkIndexes.fields){
                                            scope.objects[_k][key].fields[k] = {
                                                type: linkIndexes.fields.indexOf(k) > -1 ? 'link' : 'str',
                                                content: v,
                                                cmd: linkIndexes.cmd,
                                                mode: linkIndexes.mode
                                            };
                                        }
                                        else {
                                            scope.objects[_k]['objects'][key].fields[k] = {type: 'str', content: v};
                                        }
                                    } catch (e) {
                                        $log.error(e);
                                        scope.objects[_k]['objects'][key].fields[k] = {type: 'str', content: v};
                                    }

                                });
                            }
                        });
                    });
                } else {
                    angular.forEach(scope.objects, function (value, key) {
                        if (key > 0) {
                            var linkIndexes = {};
                            angular.forEach(value.actions, function (v, k) {
                                if (v.show_as === 'link') {linkIndexes = v}
                            });
                            angular.forEach(value.fields, function (v, k) {
                                if (value.actions.length > 0 && linkIndexes.fields){
                                    scope.objects[key].fields[k] = {
                                        type: linkIndexes.fields.indexOf(k) > -1 ? 'link' : 'str',
                                        content: v,
                                        cmd: linkIndexes.cmd,
                                        mode: linkIndexes.mode
                                    };
                                }
                                else {
                                    scope.objects[key].fields[k] = {type: 'str', content: v};
                                }
                            });
                        }
                    });
                }

                $log.debug(scope.objects);
            }
        }
    })

    /**
     * @memberof ulakbus.crud
     * @ngdoc controller
     * @name CRUDCtrl
     * @description CRUDCtrl controller is base controller for crud module to redirect to related controller
     * This controller play an empty role for api calls.
     * With response data, location path change to related controller
     *
     * @returns {object}
     */
    .controller('CRUDController', function ($scope, $routeParams, $location, Generator, CrudUtility) {
        // get required params by calling CrudUtility.generateParam function
        if ($location.url().indexOf('?=') > 0) {
            return $location.url($location.url().replace('?=', ''));
        }
        // before calling get_wf parameters need to be generated with CrudUtility.generateParam
        CrudUtility.generateParam($scope, $routeParams);
        Generator.get_wf($scope);
    })

    /**
     * @memberof ulakbus.crud
     * @ngdoc controller
     * @name CRUDListFormController
     * @description CRUDListFormController is the main controller for crud module
     * Based on the client_cmd parameter it generates its scope items.
     * client_cmd can be in ['show', 'list', 'form', 'reload', 'refresh']
     * There are 3 directives to manipulate controllers scope objects in crud.html
     * <br>
     * The controller works in 2 ways, with and without pageData.
     * pageData is generated by formService.Generator and it contains data to manipulate page.
     * If pageData has set, using Generator's getPageData() function, sets its scope items. After getting pageData
     * pageData must be set to `{pageData: false}` for clear scope of next job.
     * <br>
     * If pageData has not set using Generator's get_wf() function gets scope items from api call.
     *
     * @returns {object}
     */
    .controller('CRUDListFormController', function ($scope, $rootScope, $location, $sce, $http, $log, $uibModal, $timeout, Generator, $routeParams, CrudUtility) {
        // below show crud and $on --> $viewContentLoaded callback is for masking the view with unrendered and ugly html
        $scope.show_crud = false;
        $scope.$on('$viewContentLoaded', function () {
            $timeout(function () {
                $scope.show_crud = true;
            }, 500);
        });

        // todo: new feature wf_step is for to start a workflow from a certain step
        $scope.wf_step = $routeParams.step;

        // pagination data is coming from api when too much results
        $scope.$watch("pagination.page", function(newVal, oldVal) {
            if (newVal === oldVal) return;
            var reloadPage= {page: $scope.pagination.page};
            $scope.form_params.cmd = $scope.reload_cmd;
            $scope.form_params = angular.extend($scope.form_params, reloadPage);
            $log.debug('reload data', $scope);
            Generator.get_wf($scope);
        });
        // reload_cmd can be broadcasted app-wide, when $on it reloadCmd is called
        $scope.$on('reload_cmd', function(event, data){
            $scope.reload_cmd = data;
            $scope.reloadCmd();
        });

        // search directive updates objects after search results
        $scope.$on('updateObjects', function ($event, data) {
            $scope.objects = data;
            CrudUtility.listPageItems($scope, {objects: $scope.objects});
        });

        // we use form generator for generic forms. this makes form's scope to confuse on the path to generate form
        // object by its name. to manage to locate the form to controllers scope we use a directive called form locator
        // a bit dirty way to find form working on but solves our problem
        $scope.$on('formLocator', function (event) {
            $scope.formgenerated = event.targetScope.formgenerated;
        });

        // remove function removes node or listnode item from model data
        $scope.remove = function (item, type, index) {
            if(angular.isDefined($scope[type][item.title])){
                $scope[type][item.title].model.splice(index, 1);
                $scope[type][item.title].items.splice(index, 1);
            }else{
                $scope[type][item.schema.model_name].model.splice(index, 1);
                $scope[type][item.schema.model_name].items.splice(index, 1);
            }
        };

        $scope.onSubmit = function (form) {
            $scope.$broadcast('schemaFormValidate');
            if (form.$valid) {
                Generator.submit($scope);
            }
        };

        $scope.do_action = function (key, todo) {
            //indicate that the user have clicked some button like edit/delete on form
            $rootScope.isUserClicked = true;
            Generator.doItemAction($scope, key, todo, todo.mode || 'normal');
        };

        $scope.getNumber = function (num) {
            return new Array(num);
        };

        $scope.markdownWorkaround = function (value) {
            // this is new line workaround for markdown support
            // kind of ugly hack

            return typeof value === 'string' ? value.replace('\n', '<br>'): value;
        };

        // inline edit fields
        $scope.datepickerstatuses = {};

        $scope.inline_datepicker_status = function (field) {
            return ($scope.datepickerstatuses[field] || false);
        };

        $scope.openDatepicker = function (field) {
            $scope.datepickerstatuses[field] = true;
        };

        $scope.createListObjects = function () {
            if ($scope.object.constructor === Array) {
                $log.debug('new type show object')
            } else {
                if ($scope.object.type) {
                    $scope.object = [$scope.object];
                } else {
                    $scope.object = [{type: 'table', fields: angular.copy($scope.object)}];
                }
            }
        };

        $scope.showCmd = function () {
            CrudUtility.generateParam($scope, $routeParams, $routeParams.cmd);
            // todo: refactor createListObjects func

            var pageData = Generator.getPageData();
            if (pageData.pageData === true) {
                $scope.object_title = pageData.object_title
                $scope.object = pageData.object;
                Generator.setPageData({pageData: false});
            }
            else {
                // call generator's get_single_item func
                Generator.get_wf($scope).then(function (res) {
                    $scope.object = res.data.object;
                    $scope.model = $routeParams.model;
                });
            }
            $scope.createListObjects();
        };

        // selective listing for list page todo: add to documentation
        $scope.update_selective_list = function (key) {
            $scope.objects = key["objects"];
        };
        // end of selective listing
        $scope.listFormCmd = function () {
            // function to set scope objects
            var setpageobjects = function (data) {
                CrudUtility.listPageItems($scope, data);
                Generator.generate($scope, data);
                Generator.setPageData({pageData: false});
            };

            // get pageData from service
            var pageData = Generator.getPageData();

            // if pageData exists do not call get_wf function and manipulate page with pageData
            if (pageData.pageData === true) {
                $log.debug('pagedata', pageData.pageData);
                CrudUtility.generateParam($scope, pageData, $routeParams.cmd);
                setpageobjects(pageData, pageData);
                if ($scope.second_client_cmd) {
                    $scope.createListObjects();
                }
            }
            // if pageData didn't defined or is {pageData: false} go get data from api with get_wf function
            if (pageData.pageData === undefined || pageData.pageData === false) {
                CrudUtility.generateParam($scope, $routeParams, $routeParams.cmd);
                Generator.get_wf($scope);
            }

            if ($scope.object) {
                $scope.createListObjects();
            }

            // if selective listing then change objects key to its first item
            if (angular.isDefined($scope.meta) && angular.isDefined($scope.meta.selective_listing)) {
                $scope.all_objects = angular.copy($scope.objects);
                $scope.selective_list_key = $scope.all_objects[$scope.selected_key];
                $scope.objects = $scope.selective_list_key["objects"];
            }
        };
        $scope.reloadCmd = function () {
            var pageData = Generator.getPageData();
            CrudUtility.generateParam($scope, pageData, $routeParams.cmd);
            $log.debug('reload data', $scope);
            Generator.get_wf($scope);
        };
        $scope.resetCmd = function () {
            var pageData = Generator.getPageData();
            CrudUtility.generateParam($scope, pageData, $routeParams.cmd);
            delete $scope.token;
            delete $scope.filters;
            delete $scope.cmd;
            Generator.get_wf($scope);
        };
        var executeCmd = {
            show: $scope.showCmd,
            list: $scope.listFormCmd,
            form: $scope.listFormCmd,
            reload: $scope.reloadCmd,
            reset: $scope.resetCmd
        };

        return executeCmd[$routeParams.cmd]();

    })

    /**
     * @memberof ulakbus.crud
     * @ngdoc directive
     * @name crudListDirective
     * @description directive for listing objects.
     * provides template for `scope.objects` object.
     */
    .directive('crudListDirective', function () {
        return {
            templateUrl: '/components/crud/templates/list.html',
            restrict: 'E',
            replace: true
        };
    })
    /**
     * @memberof ulakbus.crud
     * @ngdoc directive
     * @name crudFormDirective
     * @description directive for form generation.
     * provides template for `scope.forms` object.
     */
    .directive('crudFormDirective', function () {
        return {
            templateUrl: '/components/crud/templates/form.html',
            restrict: 'E',
            replace: true
        };
    })
    /**
     * @memberof ulakbus.crud
     * @ngdoc directive
     * @name crudShowDirective
     * @description directive for single object or detail of an object.
     * provides template for `scope.object` object.
     */
    .directive('crudShowDirective', function () {
        return {
            templateUrl: '/components/crud/templates/show.html',
            restrict: 'E',
            replace: true
        };
    })
    /**
     * @memberof ulakbus.crud
     * @ngdoc directive
     * @name formLocator
     * @description directive for finding form element. we use this directive because when form dynamically generated using
     * schemaform it belongs to a scope which is hard to reach. This makes it easy to locate form object.
     */
    .directive('formLocator', function () {
        return {
            link: function (scope) {
                scope.$emit('formLocator');
            }
        }
    })

    /**
     * @memberof ulakbus.crud
     * @ngdoc directive
     * @name crudFilters
     * @description directive for filtering functionality. There are three types of filters; `check`, `select`, and `date`.
     * @todo filter items returns unselected in response object
     */
    .directive('crudFilters', function(Generator) {
        return {
            templateUrl: '/components/crud/templates/filter.html',
            restrict: 'E',
            replace: true,
            link: function ($scope) {
                $scope.form_params.filters = $scope.form_params.filters || {};
                $scope.form_params.token = $scope.token;
                $scope.filterList = {};
                $scope.filterCollapsed = {};
                $scope.$watch('list_filters', function () {
                    angular.forEach($scope.list_filters, function (value, key) {
                        $scope.filterList[value.field] = {model : {}, values: value.values || [], type: value.type};
                        $scope.filterCollapsed[value.field] = Object.keys($scope.filterCollapsed).length > 0 ? true : false;
                        angular.forEach(value.values, function(val,key){
                            if (val.selected) $scope.filterList[value.field].model[val.value] = val.selected;
                        });
                    });
                });
                $scope.collapseFilter = function (field) {
                    $scope.filterCollapsed[field] = !$scope.filterCollapsed[field];
                };
                $scope.status = {startOpened: false, endOpened: false};
                $scope.dateFilterOpen = function ($event, which) {
                    this.status[which] = true;
                };
                $scope.format = 'dd.MM.yyyy';
                $scope.filterSubmit = function () {
                    angular.forEach($scope.filterList, function (value, key) {
                        var filters = value;
                        angular.forEach(value.model, function(value, key) {
                            if(!value) {
                                delete filters.model[key];
                            }
                        })
                        if (Object.keys(value.model).length) {
                            if (value.type === 'date') {
                                var dateValues = [null, null];
                                angular.forEach(value.model, function (v, k) {
                                    dateValues[k] = Generator.dateformatter(v);
                                });
                                $scope.form_params.filters[key] = {values: dateValues, type: value.type};
                            } else {
                                $scope.form_params.filters[key] = {values: Object.keys(value.model), type: value.type || 'check'};
                            }
                        }
                    });
                    Generator.get_wf($scope);
                }
            }
        };
    })

    .controller("crudTimetableDirectiveCtrl", function($scope, WSOps, $q){
        // todo: replace with utils service method
        function groupBy (list, propName) {
            return list.reduce(function(acc, item) {
                (acc[item[propName]] = acc[item[propName]] || []).push(item);
                return acc;
            }, {});
        };
        $scope.groupBy = groupBy;

        $scope.get_wf = function get_wf(data){
            var fieldName = $scope.mainFieldName || 'ogretim_elemani_zt';
            data.token = $scope.token;
            data.wf = $scope.wf;
            return WSOps.request(data).then(function(result){
                if (result[fieldName]){
                    return result;
                }
                Generator.pathDecider(result.client_cmd || ['list'], $scope, result);
                // prevent result processing
                return $q.reject();
            }).then(function(result){
                $scope.message = result.notification;
                return result[fieldName]
            })
        };

        $scope.prepareTimetable = function prepareTimetable(timetable){
            var grouped = groupBy(timetable, "saat");
            for (var day in grouped){
                if (!grouped.hasOwnProperty(day)) continue;
                var dayItems = grouped[day];
                grouped[day] = dayItems.sort(function(a, b){
                    return a.gun < b.gun ? -1 : 1;
                });
            }
            var acc = [];
            for (var t in grouped){
                if (grouped.hasOwnProperty(t)){
                    acc.push([t, grouped[t]]);
                }
            }
            return  acc.sort(function(a, b){
                return a[0] > b[0] ? 1 : -1;
            });
        }
    })

    .directive("crudTimetableDirective", function(){
        return {
            templateUrl: '/components/crud/templates/timetable.html',
            restrict: 'E',
            replace: true,
            controller: 'crudTimetableDirectiveCtrl',
            link: function(iScope, iElem, iAtrrs){
                var mainFieldName = 'ogretim_elemani_zt';
                iScope.mainFieldName = mainFieldName;
                iScope.tablesList = iScope[mainFieldName].ogretim_elemanlari;
                iScope.widgetTitle = "Öğretim Elemanı Zaman Tablosu"

                initLecturer(iScope[mainFieldName]);

                function initLecturer(data){
                    iScope.currentTable = {
                        key: data.oe_key,
                        name: data.name,
                        avatar_url: data.avatar_url,
                        totalHours: data.toplam_ders_saati,
                        readonly: data.readonly
                    };
                    iScope.timetable = iScope.prepareTimetable(data.uygunluk_durumu);
                };

                iScope.selectTable = function(lecturer){
                    iScope.loadingTable = true;
                    iScope.get_wf({
                        cmd: 'personel_sec',
                        secili_og_elemani: {key: lecturer.key}
                    }).then(function(response){
                        initLecturer(response);
                    }).finally(function(){
                        iScope.loadingTable = false;
                    })
                };

                iScope.changeValue = function(time){
                    iScope.loadingAction = true;
                    iScope.get_wf({
                        cmd: 'degistir',
                        change: {
                            'key': time.key,
                            'durum': time.durum
                        }
                    }).then(function(table){
                        var days = table.uygunluk_durumu;
                        // update durum value from the response
                        for (var i=0; i<days.length; i++){
                            if (days[i].key == time.key){
                                time.durum = days[i].durum;
                                break;
                            }
                        }
                    }).finally(function(){
                        iScope.loadingAction = false;
                    })
                }
            }
        }
    })

    .directive("crudTimetableDirective2", function(){
        return {
            templateUrl: '/components/crud/templates/timetable.html',
            restrict: 'E',
            replace: true,
            controller: 'crudTimetableDirectiveCtrl',
            link: function(iScope, iElem, iAtrrs){
                var mainFieldName = 'derslik_zaman_tablosu';
                iScope.mainFieldName = mainFieldName;
                iScope.tablesList = iScope[mainFieldName].derslikler;
                iScope.widgetTitle = "Derslik Zaman Tablosu";

                initTable(iScope[mainFieldName]);

                function initTable(data){
                    iScope.currentTable = {
                        key: data.oe_key,
                        name: data.name,
                        avatar_url: data.avatar_url,
                        readonly: data.readonly
                    };
                    iScope.timetable = iScope.prepareTimetable(data.zaman_plani);
                };

                iScope.selectTable = function(table){
                    iScope.loadingTable = true;
                    iScope.get_wf({
                        cmd: 'derslik_degistir',
                        secili_derslik: {key: table.key}
                    }).then(function(response){
                        initTable(response);
                    }).finally(function(){
                        iScope.loadingTable = false;
                    })
                };

                iScope.changeValue = function(time){
                    iScope.loadingAction = true;
                    iScope.get_wf({
                        cmd: 'degistir',
                        change: {
                            'key': time.key,
                            'durum': time.durum
                        }
                    }).then(function(table){
                        var days = table.uygunluk_durumu;
                        // update durum value from the response
                        for (var i=0; i<days.length; i++){
                            if (days[i].key == time.key){
                                time.durum = days[i].durum;
                                break;
                            }
                        }
                    }).finally(function(){
                        iScope.loadingAction = false;
                    })
                }
            }
        }
    });
$(document).ready(function () {
    //validate the integer field
    $(document).on('keypress','.integerField', function (evt) {
        evt = (evt) ? evt : window.event;
        var charCode = (evt.which) ? evt.which : evt.keyCode;
        if (charCode > 31 && (charCode < 48 || charCode > 57)) {
            return false;
        }
        return true;
    });
});

