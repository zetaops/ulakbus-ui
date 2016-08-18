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
 * @name ulakbus
 * @module ulakbus
 * @description Ulakbus module is the main module of ulakbus-ui.
 * All application-wide configurations and definings of constants handled in this module.
 *
 * There are two scripts on `app/` root; `main.js` and `app.js`. And `main.html`, `index.html`.
 * `main.*` files are contains both production and development requirements or configurations/necessities for relative environment.
 * Tagged with `NODE_ENV='PRODUCTION'` in commented line and configured in Gruntfile.js with package `preprocess` and `env`, related grunt command generates index.* for given file.
 *
 */
angular.module(
    'ulakbus', [
        //'ui.bootstrap',
        'angular-loading-bar',
        'ngRoute',
        'ngSanitize',
        'ngCookies',
        'ulakbus.formService',
        'ulakbus.messaging',
        'ulakbus.dashboard',
        'ulakbus.auth',
        'ulakbus.error_pages',
        'ulakbus.crud',
        'ulakbus.debug',
        'ulakbus.devSettings',
        'ulakbus.version',
        'gettext',
        'markdown',
        'templates-prod',
    ])
    /**
     * @memberof ulakbus
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

        return {url: backendurl};
    })())
    .factory('IsOnline', function ($window, $document, $rootScope) {

        var isOnlineService = {};
        isOnlineService.status = true;

        var offlineMask = angular.element(
            '<div class="body-mask" style="z-index: 2010; opacity: 0.6">' +
            '<div class="alert alert-danger text-center" role="alert" style="z-index: 2011; position: relative">' +
            'İnternet bağlantınız kesilmiştir. Bağlantı sağlandığında kaldığınız yerden devam edebilirsiniz.' +
            '</div>' +
            '</div>'
        );
        var body = $document.find('body').eq(0);

        isOnlineService.set_status = function (state) {
            // status changed
            if (state != isOnlineService.status){
                // online
                if (state){
                    offlineMask.remove();
                    // is user is set, reload page to init
                    if ($rootScope.current_user === true){
                        window.location.reload();
                    }
                }
                // offline
                else {
                    body.append(offlineMask);
                }
            }
            isOnlineService.status = state;
        };

        isOnlineService.get_status = function () {
            return isOnlineService.status;
        };

        isOnlineService.status = navigator.onLine;
        $window.addEventListener("offline", function(){
            isOnlineService.set_status(false);
        });

        $window.addEventListener("online", function(){
            isOnlineService.set_status(true);
        });

        return isOnlineService;
    })
    // .service('DESIGN', function ($routeParams, $cookies, $log) {
    //     // use route param to change cookie for design
    //     // this is a config as a service added for designer can work without backend
    //     try {
    //         if (angular.isDefined($routeParams.design) || location.hash.split('?')[1].split('=')[1]) {
    //             $cookies.put('design', $routeParams.design || location.hash.split('?')[1].split('=')[1]);
    //         }
    //     } catch (e){
    //         $log.error("Error for design parameter", e);
    //     }
    //     return $cookies.get('design') === 'true' ? {switch: true} : {switch: false};
    // })
    .constant('toastr', window.toastr)
    .constant('WS', window.WebSocket)
    .config(function ($logProvider) {
        $logProvider.debugEnabled(false);
    })
    .config(function(markdownProvider) {
        //markdownProvider.config({
        //    extensions: ['table']
        //});
    });


'use strict';

angular.module('ulakbus')
    .config(['$routeProvider', function ($routeProvider, $route) {
        $routeProvider
            .when('/login', {
                templateUrl: 'components/auth/login.html',
                controller: 'LoginController'
            })
            .when('/dashboard', {
                templateUrl: 'components/dashboard/dashboard.html',
                controller: 'DashController'
            })
            .when('/dev/settings', {
                templateUrl: 'components/devSettings/devSettings.html',
                controller: 'DevSettingsController'
            })
            .when('/debug/list', {
                templateUrl: 'components/debug/debug.html',
                controller: 'DebugController'
            })
            .when('/admin/bpmnmanager', {
                templateUrl: 'components/admin/bpmn_manager.html',
                controller: 'BpmnManagerController'
            })
            .when('/newdesigns', {
                templateUrl: 'components/uitemplates/base.html',
                controller: 'NewDesignsCtrl'
            })
            .when('/formservicepg', {
                templateUrl: 'components/uitemplates/form_service_pg.html',
                controller: 'FormServicePg'
            })
            // use crud without selected user
            // important: regex urls must be defined later than static ones
            .when('/:wf/', {
                templateUrl: 'components/crud/templates/crud-preload.html',
                controller: 'CRUDController'
            })
            .when('/cwf/:wf/:token', {
                templateUrl: 'components/crud/templates/crud.html',
                controller: 'CRUDController'
            })
            .when('/:wf/do/:cmd', {
                templateUrl: 'components/crud/templates/crud.html',
                controller: 'CRUDListFormController'
            })
            .when('/:wf/do/:cmd/:key', {
                templateUrl: 'components/crud/templates/crud.html',
                controller: 'CRUDListFormController'
            })
            .when('/:wf/:model', {
                templateUrl: 'components/crud/templates/crud-preload.html',
                controller: 'CRUDController'
            })
            .when('/:wf/:model/do/:cmd', {
                templateUrl: 'components/crud/templates/crud.html',
                controller: 'CRUDListFormController'
            })
            .when('/:wf/:model/do/:cmd/:key', {
                templateUrl: 'components/crud/templates/crud.html',
                controller: 'CRUDListFormController'
            })
            .otherwise({redirectTo: '/dashboard'});
    }])

    .run(function ($rootScope, AuthService) {

        AuthService.check_auth();

        $rootScope.loggedInUser = false;
        $rootScope.loginAttempt = 0;
        $rootScope.websocketIsOpen = false;
        $rootScope.current_user = true;
        $rootScope.$on("$routeChangeStart", function (event, next, current) {
            // will be used when needed
        });
    })
    .config(['$httpProvider', function ($httpProvider) {
        // to send cookies CORS
        $httpProvider.defaults.withCredentials = true;
    }])
    .run(function (gettextCatalog) {
        gettextCatalog.setCurrentLanguage('tr');
        gettextCatalog.debug = true;
    })
    .config(['cfpLoadingBarProvider', function (cfpLoadingBarProvider) {
        // no need bar on top of the page, set to false
        cfpLoadingBarProvider.includeBar = false;
        // loaderdiv is a placeholder tag for loader in header-sub-menu.html
        cfpLoadingBarProvider.parentSelector = "loaderdiv";
        // loader template will be used when loader initialized
        cfpLoadingBarProvider.spinnerTemplate = '<div class="loader">Loading...</div>';
    }]);


/**
 * @license Ulakbus-UI
 * Copyright (C) 2015 ZetaOps Inc.
 *
 * This file is licensed under the GNU General Public License v3
 * (GPLv3).  See LICENSE.txt for details.
 */

angular.module('ulakbus')
    .config(['$httpProvider', function ($httpProvider) {
        /**
         * @memberof ulakbus.formService
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
        $httpProvider.interceptors.push(function (ErrorService, $q, $rootScope, $location, $timeout, $log, toastr) {
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

                    if (response.data.is_login === false) {
                        $rootScope.loggedInUser = response.data.is_login;
                        $location.path("/login");
                    }
                    if (response.data.is_login === true) {
                        $rootScope.loggedInUser = true;
                        $rootScope.loginAttempt = 1; // this needs for popup errors
                        if ($location.path() === "/login") {
                            $location.path("/dashboard");
                        }
                    }

                    // handle toast notifications here

                    if (response.data.notify) {toastr.info(response.data.notify)}

                    return response;
                },
                'responseError': function (rejection) {
                    ErrorService.handle(rejection, 'http');

                    return $q.reject(rejection);
                }
            };
        });
    }]);

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
     * @ngdoc factory
     * @name Generator
     * @description form service's Generator factory service handles all generic form operations
     */
    .factory('Generator', function ($http, $q, $timeout, $sce, $location, $route, $compile, $log, RESTURL, $rootScope, Moment, WSOps, FormConstraints, $uibModal, $filter, Utils) {
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
         * async validators defined in form_constraints.js
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
                try {
                    var cons = scope.forms.constraints[v] || scope.forms.constraints[v.key];
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
                } catch (e) {
                    $log.error(e.message);
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
                if (value.type === 'help'){
                    var markdown = $filter('markdown');
                    value.helpvalue = markdown(value.helpvalue);
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
                            if (!v.form_validate && angular.isDefined(v.form_validate)) {
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
                    max: function(value){
                        return 2147483647>value>-2147483647;
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
                    if (item.name != 'idx'){
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
                                if (propInSchema.titleMap){
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
                    templateUrl: "shared/templates/multiselect.html",
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
                            templateUrl: "shared/templates/filefield.html",
                            name: k,
                            key: k,
                            fileInsert: function () {
                                $scope.$broadcast('schemaForm.error.' + k, 'tv4-302', true);
                            },
                            imageSrc: scope.model[k] ? $rootScope.settings.static_url + scope.model[k] : '',
                            avatar: k === 'avatar'
                        };
                        v.type = 'string';
                    }
                },
                select: {
                    default: function (scope, v, k) {
                        scope.form[scope.form.indexOf(k)] = {
                            type: "template",
                            title: v.title,
                            templateUrl: "shared/templates/select.html",
                            name: k,
                            key: k,
                            titleMap: v.titleMap
                        };
                    }
                },
                confirm: {
                    default: function (scope, v, k) {
                        scope.form[scope.form.indexOf(k)] = {
                            type: "template",
                            title: v.title,
                            confirm_message: v.confirm_message,
                            templateUrl: "shared/templates/confirm.html",
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
                            modalFunction: function(){
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
                                    templateUrl: 'shared/templates/confirmModalContent.html',
                                    controller: 'ModalController',
                                    resolve: {
                                        items: function(){
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
                            openModal: function(){
                                var workOnForm = scope.modalElements ? scope.modalElements.workOnForm : 'formgenerated';
                                if (!v.form_validate && angular.isDefined(v.form_validate)){
                                    this.modalFunction();
                                }
                                else{
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
                        scope.model[k] = generator.dateformatter(scope.model[k]);
                        scope.form[scope.form.indexOf(k)] = {
                            key: k, name: k, title: v.title,
                            type: 'template',
                            templateUrl: 'shared/templates/datefield.html',
                            validationMessage: {
                                'dateNotValid': "Girdiğiniz tarih geçerli değildir. <i>orn: '01.01.2015'<i/>",
                                302: 'Bu alan zorunludur.'
                            },
                            $asyncValidators: {
                                'dateNotValid': function (value) {
                                    var deferred = $q.defer();
                                    $timeout(function () {
                                        scope.model[k] = angular.copy(generator.dateformatter(value));
                                        if (scope.schema.required.indexOf(k) > -1) {
                                            deferred.resolve();
                                        }
                                        if (value.constructor === Date) {
                                            deferred.resolve();
                                        }
                                        else {
                                            var dateValue = d = value.split('.');
                                            if (isNaN(Date.parse(value)) || dateValue.length !== 3) {
                                                deferred.reject();
                                            } else {
                                                deferred.resolve();
                                            }
                                        }
                                    });
                                    return deferred.promise;
                                }
                            },
                            disabled: false,
                            is_disabled: function () {
                                return this.disabled;
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
                                this.disabled = false;
                                scope.model[k] = angular.copy(generator.dateformatter(scope.model[k]));
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
                    }
                },
                typeahead: {
                    default: function (scope, v, k) {
                        scope.form[scope.form.indexOf(k)] = {
                            type: "template",
                            title: v.title,
                            titleMap: v.titleMap,
                            templateUrl: "shared/templates/typeahead.html",
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
                            templateUrl: "shared/templates/typeahead.html",
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
                        v.type = 'string',
                            v["x-schema-form"] = {
                                "type": "textarea"
                            }
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
                            return generator.get_list(modelScope).then(function (res) {
                                formitem.titleMap = [];
                                angular.forEach(res.objects, function (item) {
                                    if (item !== -1) {
                                        formitem.titleMap.push({
                                            "value": item.key,
                                            "name": item.value
                                        });
                                    } else {
                                        formitem.focusToInput = true;
                                    }
                                });

                                return formitem.titleMap;

                            });
                        };

                        formitem = {
                            type: "template",
                            templateUrl: "shared/templates/foreignKey.html",
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
                                return generateTitleMap(modelScope);
                            },
                            getDropdownTitleMap: function () {
                                delete modelScope.form_params.query;
                                formitem.gettingTitleMap = true;
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
                            generator.get_list({
                                url: 'crud',
                                form_params: {
                                    wf: v.wf,
                                    model: v.model_name,
                                    object_id: scope.model[k],
                                    cmd: 'object_name'
                                }
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
                    console.log(v.type)
                }
            });

            $log.debug('scope at after prepareformitems', scope);
            generator.constraints(scope);
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
            if (isNaN(ndate)) {
                return '';
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
                        templateUrl: 'shared/templates/confirmModalContent.html',
                        controller: 'ModalController',
                        size: '',
                        resolve: {
                            items: function () {
                                var newscope = {
                                    form: {
                                        buttons: [ { text: "Evet", style: "btn-success", cmd:"confirm" }, { text: "Hayir", "style": "btn-warning", dismiss: true } ],
                                        title: todo.name,
                                        confirm_message: "Islemi onayliyor musunuz?",
                                        onClick: function(cmd){
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
            if ($rootScope.websocketIsOpen === true) {
                return WSOps.request(scope.form_params)
                    .then(function (data) {
                        return generator.generate(scope, data);
                    });
            } else {
                $timeout(function () {
                    generator.get_form(scope);
                }, 500);
            }
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

            if ($rootScope.websocketIsOpen === true) {
                return WSOps.request(scope.form_params)
                    .then(function (data) {
                        return data;
                    });
            } else {
                $timeout(function () {
                    generator.get_list(scope);
                }, 500);
            }
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
            // todo: remove this condition
            if ($rootScope.websocketIsOpen === true) {
                WSOps.request(scope.form_params)
                    .then(function (data) {
                        return generator.pathDecider(data.client_cmd || ['list'], scope, data);
                    });
            } else {
                $timeout(function () {
                    // todo: loop restrict listen ws open
                    generator.get_wf(scope);
                }, 500);
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
            //if (client_cmd[0] === 'reload' || client_cmd[0] === 'reset') {
            //    $rootScope.$broadcast('reload_cmd', $scope.reload_cmd);
            //    //return;
            //}

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
                }
                else {
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
            /**
             * In case of unformatted date object in any key recursively, it must be converted.
             * @param model
             */
            var convertDate = function (model) {
                angular.forEach(model, function (value, key) {
                    if (value && value.constructor === Date) {
                        model[key] = generator.dateformatter(value);
                    }
                    if (value && value.constructor === Object) {
                        convertDate(value);
                    }
                });
            };

            angular.forEach($scope.ListNode, function (value, key) {
                $scope.model[key] = value.model;
            });
            angular.forEach($scope.Node, function (value, key) {
                $scope.model[key] = value.model;
            });
            // todo: unused var delete
            var send_data = {
                "form": $scope.model,
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

            if ($rootScope.websocketIsOpen === true) {
                return WSOps.request(send_data)
                    .then(function (data) {
                        if (!dontProcessReply){
                            return generator.pathDecider(data.client_cmd || ['list'], $scope, data);
                        }
                        return data;
                    });
            } else {
                $timeout(function () {
                    generator.scope($scope, redirectTo);
                }, 500);
            }
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
                Utils.iterate($scope.model, function(modelValue, k){
                    if (angular.isUndefined($scope.edit)) return;

                    var unicode = $scope.items[$scope.edit][k].unicode;
                    if (unicode){
                        document.querySelector('input[name=' + k + ']').value = unicode;
                    }
                })
            });
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
                        templateUrl: 'shared/templates/listnodeModalContent.html',
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
                                if (key.indexOf('_id') > -1) {

                                    // todo: understand why we got object here!
                                    // hack to fix bug with value as object
                                    if (angular.isObject(value) && value.value){
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
                                            if (unicodeValue){
                                                unicodeValue = unicodeValue.name;
                                                reformattedModel[key] = {
                                                    "key": value,
                                                    "unicode": unicodeValue
                                                }
                                            }

                                            //}
                                        }
                                    });
                                } else {
                                    reformattedModel[key] = {
                                        "key": key,
                                        "unicode": Generator.item_from_array(value, childmodel.schema.properties[key].titleMap)
                                    };
                                }
                            });
                            if (childmodel.edit) {
                                listNodeItem.model[childmodel.edit] = childmodel.model;
                                if (Object.keys(reformattedModel).length > 0) {
                                    listNodeItem.items[childmodel.edit] = reformattedModel;
                                } else {
                                    listNodeItem.items[childmodel.edit] = angular.copy(childmodel.model);
                                }
                            } else {
                                listNodeItem.model.push(angular.copy(childmodel.model));
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
                        templateUrl: 'shared/templates/linkedModelModalContent.html',
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
 * Copyright (C) 2015 ZetaOps Inc.
 *
 * This file is licensed under the GNU General Public License v3
 * (GPLv3).  See LICENSE.txt for details.
 *
 * @author Evren Kutar
 */
angular.module('ulakbus')
    .factory('FormConstraints', function ($q, $log, $timeout) {
        // Generic functions
        /**
         * gets expression and returns reject/resolve promise
         * @param condition {Expression}
         * @returns {Promise}
         */
        var cond = function (condition) {
            return !condition;
        };
        var cond_generator = function () {
            return {
                lt: function (a, b) {
                    return !(a < b);
                },
                gt: function (a, b) {
                    return !(a > b);
                }
            }
        };
        /**
         *
         * @param va1 {String} value of input
         * @param val2 {Array} values of other inputs
         * @param condition {String}
         */
        var cond_multiple = function (val1, val2, condition) {
            var valid = true;
            angular.forEach(val2, function (value, key) {
                inputval = angular.element(document.querySelector('#' + value)).val();
                if (cond_generator()[condition](val1, inputval)) {
                    valid = false;
                }
            });
            return valid;
        };

        var fo_co = {};
        /**
         * lesser than
         * @param value {String,Number}
         * @param ref_val {String,Number}
         * @param type {String}
         * @returns {Promise}
         */
        fo_co.lt = function (value, ref_val, input_name) {
            return cond(value > ref_val);
        };
        /**
         * lesser than date
         * @param value {String,Number}
         * @param ref_val {String,Number}
         * @param type {String}
         * @returns {Promise}
         */
        fo_co.lt_date = function (value, ref_val, input_name) {
            return cond(value > ref_val);
        };
        /**
         * lesser than multiple
         * @param value {String,Number}
         * @param ref_vals {Array}
         * @param type {String}
         * @returns {Promise}
         */
        fo_co.ltm = function (value, ref_vals, input_name) {
            return cond_multiple(value, ref_vals, 'lt');
        };
        /**
         * greater than
         * @param value {String,Number}
         * @param ref_val {String,Number}
         * @param type {String}
         * @returns {Promise}
         */
        fo_co.gt = function (value, ref_val, input_name) {
            return cond(value < ref_val);
        };
        /**
         * greater than date
         * @param value {String,Number}
         * @param ref_val {String,Number}
         * @param type {String}
         * @returns {Promise}
         */
        fo_co.gt_date = function (value, ref_val, input_name) {
            return cond(value < ref_val);
        };
        /**
         * greater than multiple
         * @param value {String,Number}
         * @param ref_vals {Array}
         * @param type {String}
         * @returns {Promise}
         */
        fo_co.gtm = function (value, ref_vals, input_name) {
            return cond_multiple(value, ref_vals, 'gt');
        };
        /**
         * disable fields when input has value
         * @param value {String,Number}
         * @param fields {Array} they must be schemaform schema property items
         * @param type {String}
         */
        fo_co.selectbox_fields = function (value, fields, input_name) {
            // use disableErrorState to disable hidden field validations

            var form_items = angular.element(document.querySelectorAll('bootstrap-decorator'));
            angular.forEach(form_items, function (v, k) {
                angular.element(v).removeClass('hide');
                var checkpoint;
                try{
                    if (angular.isDefined(v.querySelector('input')) && v.querySelector('input') !== null ) {
                        checkpoint = v.querySelector('input').name
                    } else {
                        checkpoint = v.querySelector('select').name;
                    }
                    if (checkpoint !== input_name[0] && checkpoint !== fields[value][0]) {
                        angular.element(v).addClass('hide');
                        $log.debug(checkpoint, fields[value], angular.isDefined(fields[checkpoint]));
                    }
                } catch(e){
                    $log.error(e.message);
                }
            });
        };
        return fo_co;
    });

/**
 * Copyright (C) 2015 ZetaOps Inc.
 *
 * This file is licensed under the GNU General Public License v3
 * (GPLv3).  See LICENSE.txt for details.
 *
 * @author Evren Kutar
 */

angular.module('ulakbus')
    .factory('ErrorService', function (toastr, $rootScope, $location, $log) {
        var error_service = {};

        error_service.handle = function (rejection, prtcl) {
            var errorInModal;
            if (prtcl === 'http') {
                if (rejection.data) {
                    errorInModal = ('error' in rejection.data);
                } else {
                    errorInModal = false;
                }
            }
            if (prtcl === 'ws') {
                rejection.status = rejection.status || rejection.code;
                rejection.data = {error: rejection.error, title: rejection.title};
                errorInModal = true;
            }

            var errorModal = function () {
                if ($rootScope.loginAttempt === 0 && prtcl === 'http') {
                    $log.debug('not logged in, no alert message triggered');
                    return;
                }
                var codefield = "";
                if (rejection.data.error) {
                    codefield = '<p><pre>' +
                        rejection.data.error +
                        '</pre></p>';
                }

                $('<div class="modal">' +
                    '<div class="modal-dialog" style="width:100%;" role="document">' +
                    '<div class="modal-content">' +
                    '<div class="modal-header">' +
                    '<button type="button" class="close" data-dismiss="modal" aria-label="Close"><span' +
                    ' aria-hidden="true">&times;</span></button>' +
                    '<h4 class="modal-title" id="exampleModalLabel">' +
                    "Error Status: " + rejection.status + "<br>Error Title: " + rejection.data.title +
                    '</h4>' +
                    '</div>' +
                    '<div class="modal-body">' +
                    '<div class="alert alert-danger">' +
                    '<strong>' +
                    rejection.data.description +
                    '</strong>' +
                    codefield +
                    '</div>' +
                    '</div>' +
                    '<div class="modal-footer">' +
                    '<button type="button" class="btn btn-default" data-dismiss="modal">Kapat</button>' +
                    '</div>' +
                    '</div>' +
                    '</div>' +
                    '</div>').modal();
                // use no_highlight to display pure html
                if (!rejection.no_highlight) {
                    try {
                        $('pre:not(.hljs)').each(function (i, block) {
                            hljs.highlightBlock(block);
                        });
                    }
                    catch (e) {
                        $log.debug('Exception: ', e.message);
                    }
                }
            };

            var errorInAlertBox = function (alertContent) {
                if (errorInModal) {
                    errorModal();
                } else {
                    if ($rootScope.loginAttempt > 0) {
                        toastr.error(alertContent.msg, alertContent.title);
                    }
                }
            };

            var errorForAlertBox = {
                title: rejection.status,
                msg: rejection.data ? rejection.data.description : 'Error',
                type: 'error'
            };

            var errorDispatch = {
                "-1": function () {
                    $log.error('-1 returned:', rejection);
                },
                "400": function () {
                    $location.reload();
                },
                "401": function () {
                    if ($location.path() === "/login") {
                        $log.debug("show errors on login form");
                    } else {
                        return window.location.reload();
                    }
                },
                "403": function () {
                    if (rejection.data.is_login === true) {
                        $rootScope.loggedInUser = true;
                        if ($location.path() === "/login") {
                            $location.path("/dashboard");
                        }
                    }
                },
                "404": function () {
                    errorInAlertBox(errorForAlertBox);
                },
                "500": function () {
                    errorInAlertBox(errorForAlertBox);
                },
                "503": function () {
                    rejection.data = {description: "Servise erişilemiyor."};
                    errorInAlertBox(errorForAlertBox);
                }
            };

            errorDispatch[rejection.status || rejection.code]();
        };

        return error_service;
    });


/**
 * Copyright (C) 2015 ZetaOps Inc.
 *
 * This file is licensed under the GNU General Public License v3
 * (GPLv3).  See LICENSE.txt for details.
 *
 * @author Evren Kutar
 */

angular.module('ulakbus')
    .controller('KeyListenController', function ($scope, action_service) {
        $scope.keylog = [0,1];
        $scope.down = function(e) {
            angular.forEach(action_service.combinations, function (value, key) {
                if (action_service.equal(value, $scope.keylog.concat([e.keyCode]))) {
                    action_service.acts[key]();
                }
            });
            $scope.keylog.shift();
            $scope.keylog.push(e.keyCode);
        };

        // when user_ready broadcasted then change value of user_ready=true to display view
        $scope.$on('user_ready', function () {
            $scope.user_ready = true;
        });
        $scope.user_ready = false;
    })
    .factory('action_service', function ($uibModal, $log) {
        var actions = {};
        actions.equal = function (a,b) { return !(a<b || b<a); };
        actions.combinations = {
            'open_inspector': [91,16,75] // ctrl + k
        };
        actions.acts = {
            // opens a modal dialog full of menu items with typeahead
            'open_inspector': function () {
                var modalInstance = $uibModal.open({
                    animation: true,
                    templateUrl: 'shared/templates/actionsModalContent.html',
                    controller: 'ActionsModalController',
                    resolve: {
                        items: function () {
                            return document.querySelectorAll('.navbar-collapse a, #side-user-menu a, .dropdown-menu li a');
                        }
                    }
                });

                modalInstance.result.then(function (selectedItem) {
                    $log.info('resirect to:', selectedItem);
                    location.hash = selectedItem.value;
                });
            }
        };
        return actions;
    })
    .controller('ActionsModalController', function ($scope, $uibModalInstance, items) {
        $scope.actions = [];
        angular.forEach(items, function (value, key) {
            if (!value.children[1]) {
                $scope.actions.push({ name: value.innerHTML, value: value.hash});
            }
        });
        $scope.doThis = function (item) {
            $uibModalInstance.close(item);
        };

        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };
    });

/**
 * Copyright (C) 2015 ZetaOps Inc.
 *
 * This file is licensed under the GNU General Public License v3
 * (GPLv3).  See LICENSE.txt for details.
 *
 * @author Evren Kutar
 */

angular.module('ulakbus')
    /**
     * WSUri returns websocket uri
     */
    .service('WSUri', function (RESTURL) {
        var base = RESTURL.url.replace('http', 'ws');
        return {url: base + 'ws'}
    })
    /**
     * WSOps operates all websocket interactions
     */
    .factory('WSOps', function (WSUri, $q, $log, $rootScope, $timeout, $document, ErrorService, WS, IsOnline, DevSettings) {
        $rootScope.$on('ws_turn_on', function () {
            generate_ws();
        });
        // websocket object
        var websocket;
        // when websocket tries to reconnect it counts
        var refresh_count = 0;
        // an interval integer in miliseconds depending on refresh_count
        var refresh_websocket = refresh_count < 5 ? 1000 : 5000;
        // check and return if browser supports websocket
        var isSupported = function () {
            return "WebSocket" in window;
        };
        /**
         * generate_ws generates web socket with necessary functions to configure
         */
        var generate_ws = function () {
            if (isSupported()) {
                $log.info('Openning web socket...');
                websocket = new WS(WSUri.url);
                websocket.onopen = function (evt) {
                    wsOps.onOpen(evt);
                    refresh_count = 0;
                };
                websocket.onclose = function (evt) {
                    wsOps.onClose(evt);
                    if (wsOps.loggedOut === true) {
                        return;
                    }
                    $timeout(function () {
                        generate_ws();
                        refresh_count += 1;
                    }, refresh_websocket);
                };
                websocket.onmessage = function (evt) {
                    wsOps.onMessage(evt)
                };
                websocket.onerror = function (evt) {
                    wsOps.onError(evt)
                };
            } else {
                var error = {
                    error: "Tarayıcınız websocket desteklememektedir. Lütfen güncel bir tarayıcı kullanınız.",
                    code: 500,
                    title: "Uyumsuz Tarayıcı",
                    no_highlight: true
                };
                ErrorService.handle(error, "ws");
            }

        };

        // wsOps is service object when WSOps called
        var wsOps = {};
        var pingCounter = 0;
        // ping is to keep alive websocket session when ui is open and used
        // backend needs it to refresh session in order to not timeout
        // checkPing is control function if 3 ping sent without response 'pong' refresh websocket object by closing it
        // keepAlivePing is a function sends ping data when socket opens
        var checkPing = function () {
            if (pingCounter > 2) {
                websocket.close();
                $log.debug("websocket not pong");
                pingCounter = 0;
            }
        };
        var keepAlivePing = function (interval) {
            return setInterval(function () {
                if ($rootScope.websocketIsOpen && IsOnline.get_status() && DevSettings.settings.keepAlive === 'on') {
                    wsOps.doSend(angular.toJson({data: {view: "ping"}}));
                    pingCounter += 1;
                    checkPing();
                }
            }, interval);
        };
        wsOps.onOpen = function (evt) {
            $rootScope.websocketIsOpen = true;
            $log.info("CONNECTED", evt);
            keepAlivePing(20000);
            wsOps.loggedOut = false;
        };
        wsOps.onClose = function (event) {
            $rootScope.websocketIsOpen = false;
            $log.info("DISCONNECTED", event);
        };
        // two types of data can be come from websocket: with and without callback
        // if callback in callbacks list it will run the callback and delete it
        wsOps.callbacks = {};
        wsOps.onMessage = function (event) {
            // msg_methods are dispatch methods for incoming events. init is the default method to run
            var msg_methods = {
                init: function (data) {
                    if (angular.isDefined(wsOps.callbacks[data.callbackID])) {
                        var callback = wsOps.callbacks[data.callbackID];
                        delete wsOps.callbacks[data.callbackID];
                        callback.resolve(data);
                    } else {
                        if (data.msg != 'pong') {
                            $log.info("Data without callback: %o", data);
                        };
                        // if pong in msg reduce pingCounter
                        if (msg_data.msg === 'pong') {
                            pingCounter -= 1;
                        }
                    }
                },
                error: function () {
                    // when error in message redirect to ErrorService with error data
                    return ErrorService.handle(msg_data, 'ws');
                },
                message: function () {
                    // broadcast notifications data to notifications directive
                    // parse messages by type
                    // (1, "Info Notification"),
                    // (11, "Error Notification"),
                    // (111, "Success Notification"),
                    // (2, "Direct Message"),
                    // (3, "Broadcast Message"),
                    // (4, "Channel Message")
                    var type = {
                        1: "notifications",
                        11: "notifications",
                        111: "notifications",
                        2: "message",
                        3: "message",
                        4: "message"
                    };
                    // this way it broadcasts to relevant listener
                    // i group messages and notifications into 2 groups
                    // necessary actions will taken where it is listened
                    $timeout(function(){
                        $rootScope.$broadcast(type[msg_data["type"]], msg_data);
                    });
                },
                dashboard: function () {
                    // dashboard consists of menu and user specifications
                    var callback = wsOps.callbacks[msg_data.callbackID];
                    delete wsOps.callbacks[msg_data.callbackID];
                    callback.resolve(msg_data);
                },
                task_list: function () {
                    // broadcast task list to task_list directive in dashboard_widget_directives.js
                    $rootScope.$broadcast('task_list', msg_data["task_list"]);
                },
                channel_subscription: function(){
                    $timeout(function(){
                        $rootScope.$broadcast('channel_change', 'add', msg_data);
                    })
                },
                user_status: function(){
                    $timeout(function(){
                        $rootScope.$broadcast('channel_change', 'status', msg_data);
                    })
                }
            };
            // do_action is the dispatcher function for incoming events
            var do_action = function (options) {
                // remove mask from crud here
                // togglePageReadyMask(0);
                // $log.info("togglePageReadyMask off");
                var args = [].slice.call(arguments, 0),
                    initialized = false,
                    action = 'init';
                if (typeof msg_methods[args[1]] === 'function') {
                    action = args[1];
                    args.shift();
                }
                return msg_methods[action](args[0]);
            };
            var msg_data = angular.fromJson(event.data);
            if (msg_data.error) {
                msg_data.cmd = 'error';
            }
            do_action(msg_data, msg_data.cmd);
            if (msg_data.msg != "pong"){
                $log.info("MESSAGE:", event, "Data:", angular.copy(msg_data));
            }
        };
        wsOps.onError = function (evt) {
            $log.error("ERROR :: " + evt);
        };
        wsOps.doSend = function (data) {
            websocket.send(data);
            $log.info('SENT:', data);
        };
        // reactor with promise
        wsOps.request = function (data) {
            if ($rootScope.websocketIsOpen) {
                var request = {
                    callbackID: Math.random().toString(36).substring(7),
                    data: data
                };
                var deferred = $q.defer();
                wsOps.callbacks[request.callbackID] = deferred;
                websocket.send(angular.toJson(request));
                $log.info('SENT:', data);
                // togglePageReadyMask(1);
                // $log.info("togglePageReadyMask on");
                //
                // todo: add success & error promises
                return deferred.promise.then(function (response) {
                        request.response = response;
                        return response;
                    }
                );
            } else {
                // is $rootScope.websocketIsOpen is not true try again in one second
                $timeout(function () {
                    wsOps.request(data);
                }, 1000);
            }
        };

        wsOps.close = function () {
            wsOps.loggedOut = true;
            websocket.close();
            $log.info("CLOSED");
        };
        /**
         * below elements used by togglePageReadyMask function
         * when data with callback function sent to websocket it toggles on the mask
         * so the user not able to interact with interface
         */
        var pageReady;
        var mask = angular.element('<div class="body-mask"><div class="loader"></div>' +
            '</div>');
        mask.css({zIndex: '2010', opacity: '0.6'});
        var body = $document.find('body').eq(0);
        var togglePageReadyMask = function (st) {
            var toggle = [
                function () {
                    if (pageReady === 0) {
                        return;
                    }
                    $timeout(function () {
                        mask.remove();
                        pageReady = 0;
                    }, 1000);
                },
                function () {
                    if (pageReady === 1) {
                        return;
                    }
                    body.append(mask);
                    pageReady = 1;
                }
            ];
            toggle[st]();
        };

        return wsOps;
    });


/**
 * Copyright (C) 2015 ZetaOps Inc.
 *
 * This file is licensed under the GNU General Public License v3
 * (GPLv3).  See LICENSE.txt for details.
 *
 * @author Vladimir Baranov
 */

angular.module("ulakbus")

    .service("Utils", function(){
        var self = this;

        // check if obj1 has properties values equal to corresponding properties in obj2
        function hasEqualProperties(obj1, obj2){
            var result = true;
            for (var prop in obj2){
                if(obj2.hasOwnProperty(prop)){
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

        this.groupBy = function (list, propName,  initialObject) {
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
        this.deleteWhere = function(list, condition){
            for (var i = 0; i < list.length; i++){
                if (hasEqualProperties(list[i], condition)){
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
        this.findWhere = function(list, condition){
            for (var i = 0; i < list.length; i++){
                if (hasEqualProperties(list[i], condition)){
                    return list[i];
                }
            }
        }

        /**
         * @param collection {Array|Object} Array of objects to group
         * @param callback {Function} Callback to apply to every element of the collection
         * @returns None
         */
        this.iterate = function(collection, callback){
            angular.forEach(collection, function(val, key){
                // don't iterate over angular binding indexes
                if (key.indexOf && key.indexOf('$$') == 0){
                    return;
                }
                callback(val, key);
            })
        }
    })


    .filter("formatJson", function(){
        return function(val){
            try {
                return JSON.stringify(val, null, 4);
            } catch(e){
                return val;
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

angular.module('ulakbus')
    /**
     * @memberof ulakbus
     * @ngdoc directive
     * @name logout
     * @description logout directive provides a button with click event. When triggered it post to
     * '/logout' path of the API.
     */
    .directive('logout', function ($http, $location, RESTURL, AuthService) {
        return {
            link: function ($scope, $element, $rootScope) {
                $element.on('click', function () {
                    AuthService.logout();
                    //$http.post(RESTURL.url + 'logout', {}).then(function () {
                    //    $rootScope.loggedInUser = false;
                    //    $location.path("/login");
                    //});
                });
            }
        };
    })
    /**
     * @memberof ulakbus
     * @ngdoc directive
     * @name headerNotification
     * @description This directive is responsible to get and show notification.
     * It calls API's '_zops_unread_count' view to init its state and updates state when 'message' or 'notifications' broadcast message received     *
     * - Notifications can be disabled in /dev/settings page
     */
    .directive('headerNotification', function ($rootScope, $uibModal, MessagingService) {
        return {
            templateUrl: 'shared/templates/directives/header-notification.html',
            restrict: 'E',
            replace: true,
            scope: {},
            controller: function ($scope, $log) {
                $scope.count = MessagingService.get_unread_counters();

                $scope.showMessagesWindow = function(type){
                    if (type == 'notifications'){
                        return MessagingService.get_notifications_channel_key()
                            .then(function(channelKey){
                                return MessagingService.show_messaging_window(channelKey);
                            })
                    }
                    MessagingService.show_messaging_window();
                }
            }
        };
    })
    /**
     * @memberof ulakbus
     * @ngdoc directive
     * @name searchDirective
     * @description This directive provides reusable search form application-wide.
     * When search form submitted and response returns, it broadcasts the result with key `updateObjects`.
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
                            token: $scope.$parent.token,
                            object_id: $scope.$parent.object_id,
                            form_params: {
                                wf: $scope.$parent.wf,
                                model: $scope.$parent.form_params.model,
                                cmd: $scope.$parent.reload_cmd,
                                flow: $scope.$parent.form_params.flow,
                                query: $scope.searchModel.searchbox
                            }
                        };

                        Generator.submit(searchparams);
                    }
                };
            }
        };
    })
    /**
     * @memberof ulakbus
     * @ngdoc directive
     * @name sortDirective
     * @description Sort directive is responsible to post sorting params to API and process the response to the screen.
     * @todo test and implement when backend ready
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
     * @memberof ulakbus
     * @ngdoc directive
     * @name collapseMenu
     * @description Toggle collapses sidebar menu when clicked menu button
     */
    .directive('collapseMenu', function ($timeout, $window, $cookies) {
        return {
            templateUrl: 'shared/templates/directives/menuCollapse.html',
            restrict: 'E',
            replace: true,
            scope: {},
            controller: function ($scope, $rootScope) {
                $rootScope.collapsed = false;
                $rootScope.sidebarPinned = $cookies.get('sidebarPinned') || 1;

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
     * @memberof ulakbus
     * @ngdoc directive
     * @name headerSubmenu
     * @description Contains breadcrumb elements and loading animation
     */
    .directive('headerSubMenu', function ($location) {
        return {
            templateUrl: 'shared/templates/directives/header-sub-menu.html',
            restrict: 'E',
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
     * @memberof ulakbus
     * @ngdoc directive
     * @name breadcrumb
     * @description Produces breadcrumb with related links
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
     * @memberof ulakbus
     * @ngdoc directive
     * @name sidebar
     * @description Changes breadcrumb when an item selected consists of menu items of related user or transaction
     * controller communicates with dashboard controller to shape menu items and authz.
     */
    .directive('sidebar', ['$location', function () {
        return {
            templateUrl: 'shared/templates/directives/sidebar.html',
            restrict: 'E',
            replace: true,
            scope: {},
            controller: function ($scope, $rootScope, $cookies, $route, AuthService, WSOps, RESTURL, $log, $location, $window, $timeout) {
                $scope.prepareMenu = function (menuItems) {
                    var newMenuItems = {};
                    angular.forEach(menuItems, function (value, key) {
                        angular.forEach(value, function (v, k) {
                            newMenuItems[k] = v;
                        });
                    });
                    return newMenuItems;
                };

                // check login status
                // AuthService.check_auth();

                var generate_dashboard = function () {
                    if ($rootScope.current_user !== true){
                        return;
                    }
                    if ($rootScope.websocketIsOpen) {
                        var sidebarmenu = $('#side-menu');
                        sidebarmenu.metisMenu();
                        WSOps.request({view: 'dashboard'})
                            .then(function (data) {
                                $scope.allMenuItems = angular.copy(data);

                                // regroup menu items based on their category
                                function reGroupMenuItems(items, baseCategory) {
                                    var newItems = {};
                                    angular.forEach(items, function (value, key) {
                                        newItems[value.kategori] = newItems[value.kategori] || [];
                                        // value['baseCategory'] = baseCategory;
                                        newItems[value.kategori].push(value);
                                    });
                                    return newItems;
                                }

                                angular.forEach($scope.allMenuItems, function (value, key) {
                                    if (key !== 'current_user' && key !== 'settings') {
                                        $scope.allMenuItems[key] = reGroupMenuItems(value, key);
                                    }
                                });

                                // quick menus to dashboard via rootscope

                                $rootScope.quick_menu = reGroupMenuItems(data.quick_menu, 'quick_menus');
                                $rootScope.quick_menu = data.quick_menu;
                                delete data.quick_menu;
                                $log.debug('quick menu', $rootScope.quick_menu);

                                // broadcast for authorized menu items, consume in dashboard to show search inputs and/or
                                // related items
                                $rootScope.$broadcast("authz", data);
                                $rootScope.searchInputs = data;

                                if (data.current_user) {
                                    // $rootScope.$broadcast("ws_turn_on");
                                    // to display main view without flickering
                                    // $rootScope.$broadcast("user_ready");
                                }

                                $rootScope.current_user = data.current_user;
                                if (data.ogrenci || data.personel) {
                                    $rootScope.current_user.can_search = true;
                                }
                                $rootScope.settings = data.settings;

                                $scope.menuItems = $scope.prepareMenu({other: $scope.allMenuItems.other});

                                $timeout(function () {
                                    sidebarmenu.metisMenu();
                                });
                            });
                            // .error(function (data, status, headers, config) {
                            //     $log.error('menu not retrieved', data);
                            //     $log.info('design switch', DESIGN.switch);
                            //     if (!DESIGN.switch) {
                            //         $location.path('/login');
                            //     }
                            // });
                    } else {
                        $timeout(function () {
                            generate_dashboard();
                        }, 500);
                    }
                };
                $scope.$on("generate_dashboard", function () {
                    generate_dashboard();
                });
                // generate_menu();

                // changing menu items by listening for broadcast
                $scope.$on("menuitems", function (event, data) {
                    var menu = {};
                    menu[data] = $scope.allMenuItems[data];
                    $rootScope.$broadcast("usermenuitems", $scope.prepareMenu(menu));
                });

                $scope.$on('selectedUser', function ($event, data) {
                    $scope.selectedUser = data;
                });

                $scope.deselectUser = function () {
                    delete $scope.selectedUser;
                    delete $scope.selectedMenuItems;
                };

                // $scope.openSidebar = function () {
                //     if ($window.innerWidth > '768') {
                //         if ($rootScope.sidebarPinned === 0) {
                //             jQuery("span.menu-text, span.arrow, .sidebar footer, #side-menu").fadeIn(400);
                //             jQuery(".sidebar").css("width", "250px");
                //             jQuery(".manager-view").css("width", "calc(100% - 250px)");
                //             $rootScope.collapsed = false;
                //         }
                //     }
                // };
                //
                // $scope.closeSidebar = function () {
                //     if ($window.innerWidth > '768') {
                //         if ($rootScope.sidebarPinned === 0) {
                //             jQuery(".sidebar").css("width", "62px");
                //             jQuery(".manager-view").css("width", "calc(100% - 62px)");
                //             $rootScope.collapsed = true;
                //         }
                //     }
                // };

                $rootScope.$watch(function ($rootScope) {
                        return $rootScope.section;
                    },
                    function (newindex, oldindex) {
                        if (newindex > -1) {
                            $scope.menuItems = [$scope.allMenuItems[newindex]];
                            $scope.collapseVar = 0;
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
    /**
     * @memberof ulakbus
     * @ngdoc directive
     * @name rightSidebar
     * @description placeholder
     */
    .directive('rightSidebar', ['$location', function () {
        return {
            templateUrl: 'shared/templates/directives/right-sidebar.html',
            restrict: 'E',
            replace: true,
            scope: {},
            controller: function ($scope, $rootScope, $cookies, $route, $http, RESTURL, $log, $location, $window, $timeout) {
                var sidebarUserMenu = $('#side-user-menu');
                sidebarUserMenu.metisMenu();

                $scope.$on("usermenuitems", function (event, data) {
                    $scope.selectedMenuItems = data;
                    $timeout(function () {
                        sidebarUserMenu.metisMenu();
                    });
                    jQuery(".right-sidebar").css("width", "300px");
                    jQuery(".manager-view-inner").css("width", "calc(100% - 300px)");
                });

                $scope.$on('selectedUser', function ($event, data) {
                    $scope.selectedUser = data;
                });

                $scope.deselectUser = function () {
                    jQuery(".right-sidebar").css("width", "0px");
                    jQuery(".manager-view-inner").css("width", "");
                    delete $scope.selectedUser;
                    delete $scope.selectedMenuItems;
                };

                $rootScope.$watch(function ($rootScope) {
                        return $rootScope.section;
                    },
                    function (newindex, oldindex) {
                        if (newindex > -1) {
                            $scope.menuItems = [$scope.allMenuItems[newindex]];
                            $scope.collapseVar = 0;
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

                $scope.multiCheck = function (y) {
                    if (y === $scope.multiCollapseVar) {
                        $scope.multiCollapseVar = 0;
                    } else {
                        $scope.multiCollapseVar = y;
                    }
                };
            }
        }
    }])
    /**
     * @memberof ulakbus
     * @ngdoc directive
     * @name stats
     * @description Statistical data directive.
     * @todo unused for now
     */
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
     * @memberof ulakbus
     * @ngdoc directive
     * @name notifications
     * @description Holds notifications template with related rootscope items.
     */
    .directive('notifications', function () {
        return {
            templateUrl: 'shared/templates/directives/notifications.html',
            restrict: 'E',
            replace: true
        };
    })
    /**
     * @memberof ulakbus
     * @ngdoc directive
     * @name msgbox
     * @description Holds msgbox template with related rootscope items.
     */
    .directive('msgbox', function () {
        return {
            templateUrl: 'shared/templates/directives/msgbox.html',
            restrict: 'E',
            replace: false
        };
    })
    /**
     * @memberof ulakbus
     * @ngdoc directive
     * @name alertBox
     * @description Triggers when `alertBox` broadcasted with alert data..
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
     * @memberof ulakbus
     * @ngdoc directive
     * @name sidebarSearch
     * @description unused for now
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
    /**
     * @memberof ulakbus
     * @ngdoc directive
     * @name fileread
     * @description Fileread directive is responsible for reading uploaded file and replace it to related model item.
     * @todo implement preview only for images
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
                            scope.$parent.model[changeEvent.target.name] = {
                                file_name: changeEvent.target.files[0].name,
                                file_content: scope.$parent.model[changeEvent.target.name]
                            };
                            document.querySelector('#image-preview').src = URL.createObjectURL(changeEvent.target.files[0]);
                        });
                    };
                    reader.readAsDataURL(changeEvent.target.files[0]);
                });
            }
        }
    })
    .directive('timetableActionSelector', function($timeout) {
        // Display/hide popover with actions
        // global listener used to close popover when user clicks outside of the popover
        $('html').on('click', function (e) {
            var target = $(e.target);
            if (target.parents().is('.action-selector')) {
                target.parents('.action-selector').children('.popover').toggleClass('ng-hide');
                return;
            }
            if (target.hasClass('action-selector')) {
                target.children('.popover').toggleClass('ng-hide');
                return;
            }
            ;
            $('.course-prg-scheduler .action-selector>.popover').toggleClass('ng-hide', true);
        });

        return {
            templateUrl: 'shared/templates/directives/timetable-action-selector.html',
            scope: {
                externalModel: '=ngModel',
                onChange: "&ngChange"
            },
            link: function (iScope, iElem, iAttrs) {
                var valueToClassMap = {
                    1: 'action-indicator_appropriate',
                    2: 'action-indicator_uncertain',
                    3: 'action-indicator_busy'
                };

                if (iAttrs.hasOwnProperty('readonly')) {
                    iAttrs.$observe('readonly', function (v) {
                        if (v && v == 'false') v = false;
                        iScope.readonly = v;
                    });
                }

                iScope.$watch('externalModel', function (value) {
                    iScope.value = valueToClassMap[value];
                });

                iScope.setModelValue = function (value) {
                    var oldValue = iScope.externalModel;
                    iScope.externalModel = value;
                    // call change in next digest
                    $timeout(function () {
                        if (iScope.onChange && value != oldValue) {
                            iScope.onChange();
                        }
                    });

                }
            }
        }
    })

    /**
     * @memberof ulakbus
     * @ngdoc directive
     * @name onEnterPressed
     * @description Fire action when enter pressed on element
     */
    .directive("onEnterPressed", function () {
        return {
            link: function (scope, element, attrs) {
                element.bind("keydown keypress", function (event) {
                    if(event.which === 13 && !event.ctrlKey) {
                        scope.$apply(function (){
                            scope.$eval(attrs.onEnterPressed);
                        });
                        event.preventDefault();
                    }
                });

                scope.$on('$destroy', function(){
                    element.unbind('keydown keypress');
                })
            }
        }
    })

    /**
     * @memberof ulakbus
     * @ngdoc directive
     * @name onEscPressed
     * @description Fire action when ESC pressed on element
     */
    .directive("onEscPressed", function () {
        return {
            link: function (scope, element, attrs) {
                element.bind("keydown keypress", function (event) {
                    if(event.which === 27 ) {
                        scope.$apply(function (){
                            scope.$eval(attrs.onEscPressed);
                        });
                        event.preventDefault();
                    }
                });

                scope.$on('$destroy', function(){
                    element.unbind('keydown keypress');
                })
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
 * @name ulakbus.auth
 * @module ulakbus.auth
 * @description ulakbus.auth module handles authorization process of ulakbus-ui.
 *
 * @requires ngRoute
 * @requires ngCookies
 */
angular.module('ulakbus.auth', ['ngRoute', 'ngCookies'])
    /**
     * @memberof ulakbus.auth
     * @ngdoc controller
     * @name LoginCtrl
     * @description LoginCtrl responsible to handle login process.<br>
     * Using 'ulakbus.formService.get_form' function generates the login form and post it to the API with input datas.
     */
    .controller('LoginController', function ($scope, $q, $timeout, $location, $routeParams, $rootScope, $log, WSOps, Generator, AuthService) {
        $scope.url = 'login';
        $scope.form_params = {};
        $scope.form_params['clear_wf'] = 1;
        // if websocket status is open ---> ws close
        try {WSOps.close()}
        catch (e) {$log.error(e.message)}
        AuthService.get_form($scope).then(function (data) {
            if (data.login) { $location.path('/'); }
            $scope.form = [
                {key: "username", type: "string", title: "Kullanıcı Adı"},
                {key: "password", type: "password", title: "Şifre"},
                {type: 'submit', title: 'Giriş Yap'}
            ];
        });
        $scope.loggingIn = false;
        $scope.onSubmit = function (form) {
            $scope.$broadcast('schemaFormValidate');
            if (form.$valid) {
                $scope.loggingIn = true;
                $rootScope.loginAttempt = 1;
                Generator.button_switch(false);
                AuthService.login($scope.url, $scope.model)
                    .success(function (data) {
                        $scope.message = data.title;
                        $scope.loggingIn = false;
                    })
                    .error(function (data) {
                        $scope.message = data.title;
                        $scope.loggingIn = false;
                    })
                    .then(function () {
                        $scope.loggingIn = false;
                        Generator.button_switch(true);
                    })
            }
            else {
                $log.debug("not valid");
            }
        };
        $log.debug('login attempt: ', $rootScope.loginAttempt);

    });

/**
 * @license Ulakbus-UI
 * Copyright (C) 2015 ZetaOps Inc.
 *
 * This file is licensed under the GNU General Public License v3
 * (GPLv3).  See LICENSE.txt for details.
 */

"use strict";

angular.module('ulakbus.auth')
    /**
     * @memberof ulakbus.auth
     * @ngdoc service
     * @name AuthService
     * @description  provides generic functions for authorization process.
     */
    .factory('AuthService', function ($http, $rootScope, $location, $log, $route, Generator, RESTURL, WSOps) {
        var authService = {};

        authService.get_form = function (scope) {
            return $http
                .post(Generator.makeUrl(scope), scope.form_params)
                .success(function (data, status, headers, config) {
                    // if response data.cmd is 'upgrade'
                    if (data.cmd === 'upgrade') {
                        $rootScope.loggedInUser = true;
                        $rootScope.$broadcast("user_ready");
                        $rootScope.$broadcast("ws_turn_on");
                        return $location.path('/dashboard');
                    }
                    if (data.cmd === 'retry') {
                        $location.path('/login');
                    } else{
                        if (angular.isDefined(data.forms) && $location.path() !== '/login'){
                            $location.path('/login');
                        }
                        return Generator.generate(scope, data);
                    }
                });
        };

        /**
         * @memberof ulakbus.auth
         * @ngdoc function
         * @function login
         * @description login function post credentials to API and handles login.
         * If login req returns success then interceptor will redirects to related path.
         *
         * @param url
         * @param credentials
         * @returns {*}
         */
        authService.login = function (url, credentials) {
            credentials['cmd'] = "do";
            return $http
                .post(RESTURL.url + url, credentials)
                .success(function (data, status, headers, config) {
                    //$window.sessionStorage.token = data.token;
                    Generator.button_switch(true);
                    if (data.cmd === 'upgrade') {
                        $rootScope.loggedInUser = true;
                        // $rootScope.$broadcast("regenerate_menu");
                        // to display main view without flickering
                        $rootScope.$broadcast("user_ready");
                        $rootScope.$broadcast("ws_turn_on");
                        $location.path('/dashboard');
                    }
                    if (data.status_code === 403) {
                        data.title = "İşlem başarısız oldu. Lütfen girdiğiniz bilgileri kontrol ediniz.";
                        return data;
                    }
                })
                .error(function (data, status, headers, config) {
                    // Handle login errors here
                    data.title = "İşlem başarısız oldu. Lütfen girdiğiniz bilgileri kontrol ediniz.";
                    return data;
                });
        };

        /**
         * @memberof ulakbus.auth
         * @ngdoc controller
         * @function logout
         * @description logout function posts logout request to API and redirects to login path
         *
         * @returns {*}
         */
        authService.logout = function () {

            $rootScope.loginAttempt = 0;
            WSOps.request({wf: 'logout'}).then(function (data) {
                $rootScope.loggedInUser = false;
                $rootScope.current_user = true;
                $log.debug("loggedout");
                $location.path("/login");
                WSOps.close();
            });
        };

        authService.check_auth = function () {
            var post_data = {url: 'login', form_params:{}};
            return authService.get_form(post_data);
        };

        return authService;
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
 * @name ulakbus.dashboard
 * @module ulakbus.dashboard
 * @description ulakbus.dashboard module is holding dashboard's controller, directives and other components.
 *
 * @type {ng.$compileProvider|*}
 */
angular.module('ulakbus.dashboard', [])
    .config(function ($uibTooltipProvider) {
        $uibTooltipProvider.setTriggers({'click': 'mouseleave'});
    })

    .controller('DashController', function ($scope, $rootScope, $routeParams, $route, $timeout, $http, $cookies, RESTURL, Generator, WSOps) {
        // first generate_dashboard broadcasted to get menu and dashboard items
        // sidebar directive listens for "generate_dashboard"
        $rootScope.$broadcast("generate_dashboard");

        $scope.section = function (section_index) {
            $rootScope.section = section_index;
        };

        // to show search box based on authz
        $scope.$on("authz", function (event, data) {
            $rootScope.searchInputs = data;
        });

        $scope.keyword = {student: "", staff: ""};

        $scope.students = [];
        $scope.staffs = [];

        /**
         * this function is for searchin student or personel
         * uses $scope.keyword objects
         * @param where
         */
        $scope.search = function (where) {
            if ($scope.keyword.staff.length > 2 || $scope.keyword.student.length > 2) {
                $timeout(function () {
                    if (where === 'personel') {
                        // if input length greater than 2 search for the value

                        $scope.getItems(where, $scope.keyword.staff).then(function (data) {
                            $scope.staffs = data.results;
                        });
                    }
                    if (where === 'ogrenci') {
                        $scope.getItems(where, $scope.keyword.student).then(function (data) {
                            $scope.students = data.results;
                        })
                    }
                }, 500);
            }
        };

        $scope.getItems = function (where, what) {
            $scope.showResults = true;
            return WSOps.request({view: where + '_ara', query: what});
        };

        $scope.userPopover = {templateUrl: 'components/dashboard/user-info.html'};

        /**
         * when student or personel search results appear,
         * user can see the sample info of student/personel before to select it
         * this function triggered onhover the item
         * @param type
         * @param key
         */
        $scope.get_info = function (type, key) {
            Generator.get_list({url: 'crud', form_params: {wf: 'crud', model: type, object_id: key, cmd: 'show'}})
                .then(function (data) {
                    $scope.userPopover.name = data.object['Ad'] + " " + data.object['Soyad'];
                    $scope.userPopover.tcno = data.object['TC Kimlik No'];
                    $scope.userPopover.image = data.object['Avatar'] || 'img/sample-profile-pic.jpg';
                })
        };

        /**
         * @description selecting  
         * @param who - who is the data of selected person in search results
         * @param type - type can be 'ogrenci' or 'personel'
         */
        $scope.select = function (who, type) {
            $rootScope.$broadcast('selectedUser', {name: who[0], tcno: who[1], key: who[2]});
            // get 'who's related transactions and manipulate sidebar menu
            $rootScope.$broadcast("menuitems", type);
            $scope.showResults = false;

        };

        /**
         * dashboard also catches notifications to use in widgets
         */
        $scope.$on("notifications", function (event, data) {
            $scope.notifications = data;
        });

        $scope.$on('selectedUser', function ($event, data) {
            $scope.selectedUser = data;
        });

        /**
         * removes selected user
         */
        $scope.deselectUser = function () {
            delete $scope.selectedUser;
            delete $scope.selectedMenuItems;
        };

        // this function needed by tasks widget
        // if a user wants to dismiss a task it broadcasts the item to markasread
        $scope.markAsRead = function (items) {
            $rootScope.$broadcast("markasread", items);
        };

        //if ($routeParams.cmd = 'reload') {
        //    $route.reload();
        //}

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
                if (scope.meta['selective_listing'] === true) {
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
        $scope.paginate = function (reloadData) {
                       $scope.form_params.cmd = $scope.reload_cmd;
                        $scope.form_params = angular.extend($scope.form_params, reloadData);
                        $log.debug('reload data', $scope);
                        Generator.get_wf($scope);
                    };

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
            $scope[type][item.title].model.splice(index, 1);
            $scope[type][item.title].items.splice(index, 1);
        };

        $scope.onSubmit = function (form) {
            $scope.$broadcast('schemaFormValidate');
            if (form.$valid) {
                Generator.submit($scope);
            }
        };

        $scope.do_action = function (key, todo) {
            Generator.doItemAction($scope, key, todo, todo.mode || 'normal');
        };

        $scope.getNumber = function (num) {
            return new Array(num);
        };

        $scope.markdownWorkaround = function (value) {
            // this is new line workaround for markdown support
            // kind of ugly hack
            return value.replace('\n', '<br>');
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
            if (angular.isDefined($scope.meta.selective_listing)) {
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
            templateUrl: 'components/crud/templates/list.html',
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
            templateUrl: 'components/crud/templates/form.html',
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
            templateUrl: 'components/crud/templates/show.html',
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
            templateUrl: 'components/crud/templates/filter.html',
            restrict: 'E',
            replace: true,
            link: function ($scope) {
                $scope.form_params.filters = $scope.form_params.filters || {};
                $scope.form_params.token = $scope.token;
                $scope.filterList = {};
                $scope.filterCollapsed = {};
                $scope.$watch('list_filters', function () {
                    angular.forEach($scope.list_filters, function (value, key) {
                        $scope.filterList[value.field] = {values: value.values || [], type: value.type};
                        $scope.filterCollapsed[value.field] = Object.keys($scope.filterCollapsed).length > 0 ? true : false;
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
                        if (value.model) {
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
        }

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
            templateUrl: 'components/crud/templates/timetable.html',
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
            templateUrl: 'components/crud/templates/timetable.html',
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


/**
 * Copyright (C) 2015 ZetaOps Inc.
 *
 * This file is licensed under the GNU General Public License v3
 * (GPLv3).  See LICENSE.txt for details.
 *
 * @author Evren Kutar
 */

angular.module('ulakbus.crud')
    /**
     * this is a directive for quick add widget of listnodes
     * quick add widget does simply that; no need to add listnode item with model,
     * simply add an item to listnode searching related ulakbus model
     * needs that keys in listnode schema:
     * quick_add: true
     * quick_add_view: <viewname>
     * quick_add_model: <modelname>
     * quick_add_field: to which field the data found will be added
     * thanks u.u
     */
    .directive('quickAdd', function (Generator) {
        return {
            templateUrl: 'components/crud/templates/quick_add.html',
            restrict: 'E',
            replace: true,
            scope: {
               node: '='
            },
            controller: function ($scope) {
                $scope.kw = '';
                $scope.getTitleMap = function () {
                    return $scope.generateTitleMap($scope.kw);
                };
                $scope.generateTitleMap = function (kw) {
                    var searchData = {
                        form_params: {
                            view: $scope.node.quick_add_view,
                            model: $scope.node.quick_add_model,
                            query: kw
                        }
                    };
                    if (angular.isDefined($scope.$parent.form_params.param)){
                        searchData.form_params['id'] = $scope.$parent.form_params.id;
                    }
                    return Generator.get_list(searchData).then(function (res) {
                        var titleMap = [];
                        angular.forEach(res.objects, function (item) {
                            titleMap.push({
                                    "value": item[0],
                                    "name": item[1]
                                });
                        });
                        return titleMap;

                    });
                };
                $scope.onSelect = function (item) {
                    // add to listnode here
                    // field default is node schema properties first index
                    var get_first_key = function () {
                        return Object.keys($scope.node.schema.properties)[0];
                    };
                    var field = $scope.node.quick_add_field || get_first_key();
                    var f = { key: item.value};
                    f[field] = item.name;
                    // loop item keys and if a key not found in f add it with no value
                    angular.forEach($scope.node.items[0], function (value, key) {
                        if (!angular.isDefined(f[key])) {
                            f[key] = undefined;
                        }
                    });
                    try {
                        angular.forEach($scope.node.items, function (value, key) {
                            if (value['key'] === item.value) {
                                throw Error();
                            }
                        });
                        $scope.node.model.push(f);
                        $scope.node.items.push(f);
                    } catch (e) {
                        alert('bu öğe listede zaten mevcut!!');
                    }
                }
            }}
    });

/**
 * @license Ulakbus-UI
 * Copyright (C) 2015 ZetaOps Inc.
 *
 * This file is licensed under the GNU General Public License v3
 * (GPLv3).  See LICENSE.txt for details.
 */

'use strict';

angular.module('ulakbus.debug', ['ngRoute'])
    .controller('DebugController', function ($scope, $rootScope, $location) {

        $scope.debug_queries = $rootScope.debug_queries;

    });

/**
 * @license Ulakbus-UI
 * Copyright (C) 2015 ZetaOps Inc.
 *
 * This file is licensed under the GNU General Public License v3
 * (GPLv3).  See LICENSE.txt for details.
 */

'use strict';
angular.module('ulakbus')
    .factory('DevSettings', function ($cookies) {
        var devSettings = {};
        devSettings.settings = {
            keepAlive: $cookies.get("keepAlive") || 'on'
        };
        return devSettings;
    });

angular.module('ulakbus.devSettings', ['ngRoute'])

    .controller('DevSettingsController', function ($scope, $cookies, $rootScope, RESTURL, DevSettings) {
        $scope.backendurl = $cookies.get("backendurl");
        $scope.keepAlive = $cookies.get("keepAlive") || "on";
        //$scope.querydebug = $cookies.get("querydebug") || "on";

        $scope.changeSettings = function (what, set) {
            document.cookie = what+"="+set;
            $scope[what] = set;
            $rootScope.$broadcast(what, set);
        };

        $scope.switchOnOff = function (pinn) {
            return pinn=="on" ? "off" : "on"
        };

        $scope.setbackendurl = function () {
            $scope.changeSettings("backendurl", $scope.backendurl);
            RESTURL.url = $scope.backendurl;
        };

        $scope.setKeepAlive = function () {
            $scope.changeSettings("keepAlive", $scope.switchOnOff($scope.keepAlive));
            DevSettings.settings.keepAlive = $cookies.get("keepAlive");
        };

        //$scope.setquerydebug = function () {
        //    $scope.changeSettings("querydebug", $scope.switchOnOff($scope.querydebug));
        //};

    });

/**
 * @license Ulakbus-UI
 * Copyright (C) 2015 ZetaOps Inc.
 *
 * This file is licensed under the GNU General Public License v3
 * (GPLv3).  See LICENSE.txt for details.
 */

'use strict';

angular.module('ulakbus').config(['$routeProvider', function ($routeProvider) {
    $routeProvider
        .when('/error/500', {
            templateUrl: 'components/error_pages/500.html',
            controller: '500Controller'
        })
        .when('/error/404', {
            templateUrl: 'components/error_pages/404.html',
            controller: '404Controller'
        });
}]);

angular.module('ulakbus.error_pages', ['ngRoute'])

    .controller('500Controller', function ($scope, $rootScope, $location) {
    })

    .controller('404Controller', function ($scope, $rootScope, $location) {
    });

'use strict';

angular.module('ulakbus.version', [
  'ulakbus.version.interpolate-filter',
  'ulakbus.version.version-directive'
])

.value('version', '0.1.1');

'use strict';

angular.module('ulakbus.version.interpolate-filter', [])

.filter('interpolate', ['version', function(version) {
  return function(text) {
    return String(text).replace(/\%VERSION\%/mg, version);
  };
}]);


'use strict';

angular.module('ulakbus.version.version-directive', [])

.directive('appVersion', ['version', function(version) {
  return function(scope, elm, attrs) {
    elm.text(version);
  };
}]);


/**
 * Copyright (C) 2015 ZetaOps Inc.
 *
 * This file is licensed under the GNU General Public License v3
 * (GPLv3).  See LICENSE.txt for details.
 *
 * @author Evren Kutar
 */

angular.module('ulakbus.messaging', ['ui.bootstrap'])

/**
 * @memberof ulakbus.messaging
 * @ngdoc factory
 * @name MessagingService
 * @description Service handles all stuff related to messaging
 */
    .factory('MessagingService', function ($q, $timeout, $compile, $log, $rootScope, Moment, WSOps, Utils) {
        var msg = {};
        var notificationsChannelKey;
        var channelsMap = {};
        var groupedChannels = {};
        // channels loader promise
        var channelsLoader;

        msg.CHANNEL_TYPE = {
            "PUBLIC": 15,
            "DIRECT": 10,
            "NOTIFICATION": 5
        };

        msg.SHOW_MESSAGING_WINDOW_EVENT = "show_messaging_window";

        var unread = {
            messages: {count: 0},
            notifications: {count: 0}
        };
        var currentChannelKey;
        // track messaging app state for proper unread messages count
        var messagingAppIsHidden = true;

        function wsReady () {
            /**
             * wait until websocket will be open
             */
            var deferred = $q.defer();
            var dismissWatcher = $rootScope.$watch('websocketIsOpen', function(isOpen){
                if (isOpen){
                    dismissWatcher();
                    deferred.resolve();
                }
            });
            return deferred.promise;
        }

        function wsRequest (outgoing){
            return wsReady().then(function(){
                return WSOps.request(outgoing);
            })
        }

        function prepareMessages (messages){
            for (var i = 0; i < messages.length; i++){
                var message = messages[i];
                msg.prepareMessage(message);
            }
        }

        function increaseUnread(message, messageType){
            // skip current channel messages. Don't update counters
            if (!messagingAppIsHidden && message.channel_key == currentChannelKey){
                return;
            }

            // skip message updates
            if (message.is_update) return;

            checkIfInitialized().then(function(){
                var channel = channelsMap[message.channel_key];
                if (channel){
                    channel.unread += 1;
                }
                unread[messageType].count += 1;
            })
        }

        function decreaseUnread(channel){
            // get channel from channelsMap. Channels in channelMap has unread property
            // which is updated when messages arrive
            channel = channelsMap[channel.key];
            if (channel && channel.unread){
                var counter;
                if (channel.type == msg.CHANNEL_TYPE.NOTIFICATION){
                    counter = unread.notifications
                } else {
                    counter = unread.messages;
                }
                counter.count -= channel.unread;
                if (counter.count < 0) counter.count = 0;
                channel.unread = 0;
            }
        }

        function checkIfInitialized(){
            if (!channelsLoader){
                return msg.list_channels()
            }
            return channelsLoader;
        }

        // prepare message to show in UI
        msg.prepareMessage = function(message){
            if (!message.timestamp){
                message.moment = Moment();
            } else {
                var ts = message.timestamp.replace("Z", "");
                message.moment = Moment(ts);
            }
            return message;
        };

        msg.get_notifications_channel_key = function(){
            return checkIfInitialized().then(function(){
                return notificationsChannelKey;
            });
        };

        msg.get_unread_counters = function(){
            return unread;
        };

        msg.reset_state = function(){
            currentChannelKey = null;
            notificationsChannelKey = null;
            channelsMap = {};
            groupedChannels = {};
            unread.messages.count = 0;
            unread.notifications.count = 0;
            channelsLoader = false;
        }

        msg.toggle_messaging_window_visibility = function(visibility, resetState){
            messagingAppIsHidden = !visibility;
            if (resetState){
                msg.reset_state();
            }
        };

        msg.show_messaging_window = function(channelKey){
            $rootScope.$broadcast(msg.SHOW_MESSAGING_WINDOW_EVENT, channelKey);
        }

        /**
         * API
         *
         * */

        msg.list_channels = function list_channels (){
            /**
             * request channels list as below;
             * {
             *     'view':'_zops_list_channels',
             * }
             *
             * wait for response
             *
             * {
             *     'channels': [
             *     {'name': string, // name of channel
             *      'key': key,     // key of channel
             *      'unread': int,  // unread message count
             *      'type': int,    // channel type,
             *                      // 15: public channels (chat room/broadcast channel distinction comes from "read_only" flag)
             *                      // 10: direct channels
             *                      // 5:  one and only private channel which can be "Notifications"
             *     'read_only': boolean, //  true if this is a read-only subscription to a broadcast channel
             *                           //  false if it's a public chat room
             *
             *     'actions':[('action name', 'view name'),]
             * }
             *
             */
            var outgoing = {
                view: '_zops_list_channels'
            };

            channelsLoader = wsRequest(outgoing).then(function (data) {
                var initialGroups = {};
                initialGroups[msg.CHANNEL_TYPE.PUBLIC] = [];
                initialGroups[msg.CHANNEL_TYPE.DIRECT] = [];
                initialGroups[msg.CHANNEL_TYPE.NOTIFICATION] = [];
                groupedChannels = Utils.groupBy(data.channels||[], "type", initialGroups);

                // add all channels to channels map
                for (var i = 0; i < data.channels.length; i++){
                    var channel = data.channels[i];
                    channelsMap[channel.key] = channel;
                }

                // save notifications channel key
                notificationsChannelKey = groupedChannels[msg.CHANNEL_TYPE.NOTIFICATION][0].key;

                return {grouped: groupedChannels, channelsMap: channelsMap};
            });

            return channelsLoader;
        };

        msg.search_user = function (query) {
            var outgoing = {
                view: '_zops_search_user',
                query: query
            };

            return wsRequest(outgoing).then(function (data) {
                    return data.results
            });
        };

        msg.search_unit = function (query) {
            var outgoing = {
                view: '_zops_search_unit',
                query: query
            };

            return wsRequest(outgoing).then(function (data) {
                return data.results
            });
        };

        msg.create_direct_channel = function (key) {
            var outgoing = {
                'view': '_zops_create_direct_channel',
                'user_key': key
            };

            return wsRequest(outgoing).then(function(result){
                $log.info("Create direct channel result: ", result);
                return result;
            })
        };

        msg.create_channel = function (name, desription) {
            var outgoing = {
                view:'_zops_create_channel',
                name: name,
                description: desription
            };

            return wsRequest(outgoing).then(function(result){
                $log.info("Channel ", name, "created: ", result);
                return result;
            })
        };

        msg.add_members = function (channelKey, members, readOnly) {
            var outgoing = {
                view:'_zops_add_members',
                channel_key: channelKey,
                read_only: !!readOnly,
                members: members
            };

            return wsRequest(outgoing).then(function(result){
                $log.info("Members ", members, " added to channel ", channelKey, ": ", result);
                return result;
            })
        };

        msg.add_unit_to_channel = function (channelKey, unitKey, readOnly) {
            var outgoing = {
                view: '_zops_add_unit_to_channel',
                channel_key: channelKey,
                unit_key: unitKey,
                read_only: !!readOnly
            };
            return wsRequest(outgoing).then(function(result){
                $log.info("Unit ", unitKey, " added to channel ", channelKey, ": ", result);
                return result;
            });
        };

        msg.delete_channel =  function (channelKey) {
            var outgoing = {
                view: '_zops_delete_channel',
                channel_key: channelKey
            };
            return wsRequest(outgoing).then(function(result){
                $log.info("Channel ", channelKey, " deleted: ", result);
                if (channelsMap[channelKey]){
                    channelsMap[channelKey].deleted = true;
                }
                return result;
            })
        };

        msg.edit_channel = function (channelKey, name, desription) {
            var outgoing = {
                view:'_zops_edit_channel',
                channel_key: channelKey,
                name: name,
                description: desription
            };

            return wsRequest(outgoing).then(function(result){
                $log.info("Channel ", channelKey, " edited: ", outgoing, result);
                return result;
            })
        };

        msg.pin_channel = function (channelKey) {
            var outgoing = {
                view: '_zops_pin_channel',
                channel_key: channelKey
            };
            return wsRequest(outgoing).then(function(result){
                $log.info("Channel ", channelKey, " pinned: ", result);
                return result;
            })
        };

        msg.show_channel = function(channelKey){
            var outgoing = {
                view: '_zops_show_channel',
                key: channelKey
            };
            return wsRequest(outgoing).then(function(result){
                $log.info("Show channel ", channelKey, ": ", result);
                // decrease unread messages for current channel
                decreaseUnread(result);
                // save current channel key
                currentChannelKey = result.key;
                prepareMessages(result.last_messages);
                return result;
            })
        };

        msg.channel_history = function (channelKey, lastMessageTimestamp) {
            var outgoing = {
                view:'_zops_channel_history',
                channel_key: channelKey,
                timestamp: lastMessageTimestamp
            };
            return wsRequest(outgoing).then(function(result){
                $log.info("Load channel ", channelKey, "history: ", result);
                prepareMessages(result.messages);
                return result;
            })
        };

        msg.get_unread_messages_count = function(){
            var outgoing = {
                'view': '_zops_unread_count'
            };
            return wsRequest(outgoing).then(function(result){
                $log.info("Get unread messages count: ", result);
                // update internal unread messages counters
                unread.messages.count = result.messages;
                unread.notifications.count = result.notifications;
                return result;
            })
        };

        msg.report_last_seen_message = function (channelKey, msgKey, timestamp){
            var outgoing = {
                view: '_zops_report_last_seen_message',
                channel_key: channelKey,
                msg_key: msgKey,
                timestamp: timestamp
            };
            return wsRequest(outgoing).then(function(result){
                $log.info("Report last seen message ", channelKey, msgKey, timestamp, ": ", result);
                return result;
            })
        };

        msg.create_message = function(channelKey, msgType, body, attachments){
            var outgoing = {
                view: '_zops_create_message',
                message: {
                    channel: channelKey,
                    type: msgType,
                    title: "",
                    receiver: "",
                    body: body,
                    attachments: attachments
                }
            };

            return wsRequest(outgoing).then(function(result){
                $log.info("Message sent: ", result);
                return result;
            })
        };

        msg.find_message = function (channelKey, query, pageNumber) {
            var outgoing = {
                    view: '_zops_search_find_message',
                    channel_key: channelKey,
                    query: query,
                    page: pageNumber
            };
            return wsRequest(outgoing).then(function(result){
                $log.info("Find message: ",  result);
                return result;
            });
        };

        msg.delete_message = function (msgKey) {
            var outgoing = {
                view: '_zops_delete_message',
                key: msgKey
            };
            return wsRequest(outgoing).then(function(result){
                $log.info("Delete message ", msgKey,":", result);
                return result;
            });
        };

        msg.edit_message = function(msgKey, body) {
            var outgoing = {
                view: '_zops_edit_message',
                message: {
                    key: msgKey,
                    body: body
                }
            };
            return wsRequest(outgoing).then(function(result){
                $log.info("Edit message", msgKey, ":", result);
                return result;
            });
        };

        msg.flag_message = function (msgKey, flag) {
            var outgoing = {
                view: '_zops_flag_message',
                key: msgKey,
                flag: flag
            };
            return wsRequest(outgoing).then(function(result){
                $log.info("Flag message ", msgKey, flag, ":", result);
                return result;
            });
        };

        msg.get_message_actions = function (msgKey) {
            var outgoing = {
                view: '_zops_get_message_actions',
                key: msgKey
            };
            return wsRequest(outgoing).then(function(result){
                $log.info("Get message actions", msgKey, ":", result);
                return result;
            });
        };

        msg.add_to_favorites = function (msgKey) {
            var outgoing = {
                view: '_zops_add_to_favorites',
                key: msgKey
            };
            return wsRequest(outgoing).then(function(result){
                $log.info("Add message ", msgKey, " to favorites: ", result);
                return result;
            });
        };

        msg.remove_from_favorites = function (msgKey) {
            var outgoing = {
                view: '_zops_remove_to_favorites',
                key: msgKey
            };
            return wsRequest(outgoing).then(function(result){
                $log.info("Remove message ", msgKey, " from favorites: ", result);
                return result;
            });
        };

        msg.list_favorites = function (channelKey) {
            var outgoing = {
                view: '_zops_list_favorites',
                channel_key: channelKey
            };
            return wsRequest(outgoing).then(function(result){
                $log.info("List favorites for channel", channelKey, ": ", result);
                return result;
            });
        };

        /**
         * Event listeners
         */

        $rootScope.$on("message", function(e, message){
            increaseUnread(message, 'messages');
        });

        $rootScope.$on("notifications", function(e, message){
            increaseUnread(message, 'notifications');
        });

        $rootScope.$on("channel_change", function(e, action, channel){
            checkIfInitialized().then(function(){
                if (action == 'add'){
                    var group = groupedChannels[channel.type];
                    if (!channelsMap[channel.key]){
                        channelsMap[channel.key] = channel;
                    }
                    return group.push(channel);
                }

                if (action == 'status'){
                    var localChannel = channelsMap[channel.channel_key];
                    if (localChannel){
                        localChannel.is_online = channel.is_online;
                    }
                }
            })
        });

        // reset state on logout
        $rootScope.$watch("loggedInUser", function(value){
            if (!value){
                msg.reset_state();
            };
        });

        // initialize unread messages counter when user logged in
        $rootScope.$on("user_ready", function(){
            msg.get_unread_messages_count();
        });

        return msg;
    })

    .service("MessagingPopup", function($q, $compile, $templateRequest, $rootScope){

        function compile(template, config){
            var resultDeferred = $q.defer();
            var scope = config.scope || $rootScope.$new(true);
            var rootElement = config.rootElement;
            var originalContent, element;

            if (config.inplaceEditor){
                originalContent = rootElement.text();
                scope.content = originalContent;
            }
            scope.done = function(result){
                resultDeferred.resolve.apply(this, arguments);
            };
            scope.cancel = function(){
                resultDeferred.reject.apply(this, arguments);
            };

            if (config.link){
                config.link(scope);
            }

            element = $compile(template)(scope);

            rootElement.empty();
            rootElement.append(element);

            resultDeferred.promise._done = scope.done;
            resultDeferred.promise._cancel = scope.cancel;
            return resultDeferred.promise
                .finally(function(){
                    // inplace editor can change scope.content and it will be applied to original rootElement
                    if (config.inplaceEditor){
                        rootElement.text(scope.content);
                    } else {
                        rootElement.empty();
                    }
                    scope.$destroy();
            });
        }

        this.show = function(config){
            if (config.templateUrl){
                return $templateRequest(config.templateUrl).then(function(result){
                    console.error("RESS: ", config.templateUrl, result);
                    return compile(result, config)
                });
            }
            return compile(config.template, config);
        };

    })


angular.module("ulakbus.messaging")

    .directive('messaging', function (Generator, MessagingService, $log, $rootScope, MessagingPopup, Utils, $q, $timeout) {

        // get channel key
        function getKey (channel) {
            if (!channel) return;
            if (!angular.isObject(channel)) return channel;
            var channelKey = channel.channel_key;
            if (!channelKey && channel.hasOwnProperty('key')){
                channelKey = channel.key;
            }
            return channelKey;
        }

        function searchWrapper(scope, promiseWrapper){
            scope.loading = true;
            scope.searchResult = [];
            promiseWrapper()
                .then(function(result){
                    scope.searchResult = result;
                })
                .finally(function(){
                    scope.loading = false;
                })
        }

        return {
            templateUrl: 'components/messaging/templates/index.html',
            restrict: 'E',
            scope: {},
            link: function(iScope, iElem, iAttrs){
                iScope.chatAppIsHidden = true;

                // reset state when user log in/log out
                $rootScope.$watch('loggedInUser', function(v){
                    iScope.loggedIn = v;
                    reset();
                });

                // shared object to populate models through scopes
                iScope.shared = {};

                var popupRootElement = $(iElem).find('.popup-placeholder');

                function reset(){
                    iScope.selectedChannel = null;
                    iScope.allMessagesLoaded = false;
                    iScope.publicChannels = [];
                    iScope.notificationsChannel = [];
                    iScope.directChannels = [];
                }

                function editChannelPopup(channel){
                    return MessagingPopup.show({
                        templateUrl: "components/messaging/templates/create_channel.html",
                        rootElement: popupRootElement,
                        link: function(scope){
                            scope.channel = channel||{};
                            scope.title = "Kanalı düzenle";
                            scope.actionTitle = "Düzenle";
                            if (!channel){
                                scope.title = "Yeni Kanal Oluştur";
                                scope.actionTitle = "Oluştur";
                            }
                        }
                    })
                }

                function getMessageElementByKey(key){
                    return $("#msg-"+key);
                }

                function updateLastMessage(message){
                    if (!message && iScope.selectedChannel && iScope.selectedChannel.messages.length > 0){
                        var last = iScope.selectedChannel.messages.length - 1;
                        return iScope.lastMessage = iScope.selectedChannel.messages[last];
                    }
                    return iScope.lastMessage = message;
                }

                function appendMessage(channel, message){
                    if (channel && getKey(message) == getKey(channel)){
                        if (channel.messages){
                            channel.messages.push(message);
                        }
                    }
                    updateLastMessage(message);
                    reportLastSeenMessage();
                }

                function updateMessage(message){
                    // update current channel messages only
                    if (message.channel_key != getKey(iScope.selectedChannel)) return;
                    // update only visible messages
                    var storedMessage = Utils.findWhere(iScope.selectedChannel.messages, {key: message.key})
                    if (storedMessage){
                        angular.extend(storedMessage, message)
                        var msgElement = getMessageElementByKey(message.key);
                        // use manual update because of 'bind-once' for messages list
                        if (msgElement) {
                            msgElement.text(message.content);
                        }
                    }
                }

                function updateAndSelect(channelKey){
                    channelKey = getKey(channelKey);
                    return iScope.updateChannelsList().then(function(){
                        return iScope.selectChannel(channelKey);
                    })
                }

                function deleteMessageLocally(messageKey){
                    if (iScope.selectedChannel){
                        Utils.deleteWhere(iScope.selectedChannel.messages, {'key': messageKey});
                    }
                }

                function reportLastSeenMessage(){
                    if (!iScope.lastMessage || !iScope.selectedChannel) return;
                    // instantly received messages haven't timestamp. Use moment
                    // FIXME: change to proper moment processing
                    // var ts = iScope.lastMessage.moment.toISOString();
                    var ts = iScope.lastMessage.moment.format("YYYY-MM-DDTHH:mm:ss");
                    MessagingService.report_last_seen_message(getKey(iScope.selectedChannel), iScope.lastMessage.key, ts);
                };

                iScope.deleteConfirmation = function(title){
                    return MessagingPopup.show({
                        templateUrl: "components/messaging/templates/delete_confirmation.html",
                        link: function(scope){
                            scope.title = title || "Silmek istediğinize emin misiniz?";
                        },
                        rootElement: popupRootElement
                    })
                };

                iScope.updateChannelsList = function(){
                    return MessagingService.list_channels().then(function (channels) {
                        var groupedChannels = channels.grouped;
                        iScope.publicChannels = groupedChannels[MessagingService.CHANNEL_TYPE.PUBLIC];
                        iScope.notificationsChannel = groupedChannels[MessagingService.CHANNEL_TYPE.NOTIFICATION][0];
                        iScope.directChannels = groupedChannels[MessagingService.CHANNEL_TYPE.DIRECT];

                    });
                }

                iScope.createDirectChannel = function (user){
                    // user format is ['username', 'key', 'avatarUrl']
                    var key = user[1];
                    MessagingService.create_direct_channel(key)
                        .then(function(result){
                            updateAndSelect(getKey(result));
                        })
                };

                iScope.hideApp = function(){
                    iScope.chatAppIsHidden = true;
                    MessagingService.toggle_messaging_window_visibility(false);
                };

                iScope.showApp = function(){
                    iScope.chatAppIsHidden = false;
                    MessagingService.toggle_messaging_window_visibility(true);
                    return iScope.updateChannelsList();
                }

                iScope.searchUser = function(){
                    MessagingPopup.show({
                        templateUrl: "components/messaging/templates/add_user_unit.html",
                        rootElement: popupRootElement,
                        link: function(scope){
                            scope.onChange = function(query){
                                searchWrapper(scope, function(){
                                    return MessagingService.search_user(query);
                                })
                            };
                            scope.onChange("");
                        }
                    }).then(function(user){
                        return iScope.createDirectChannel(user);
                    });
                };

                iScope.createChannel = function(){
                    return editChannelPopup().then(function(channel){
                        return MessagingService.create_channel(channel.name, channel.description||"")
                            .then(function(newChannel){
                                updateAndSelect(newChannel)
                            });
                    })
                };

                iScope.applyChannelAction = function(channel, action){
                    var actionView = action[1];

                    switch (actionView) {

                        case '_zops_pin_channel':
                            MessagingService.pin_channel(getKey(channel));
                            break;

                        case '_zops_delete_channel':
                            iScope.deleteConfirmation('Kanalı silmek istediğinize emin misiniz?')
                                .then(function(){
                                    MessagingService.delete_channel(getKey(channel)).then(function(){
                                        iScope.selectedChannel = null;
                                    });
                                });
                            break;

                        case '_zops_edit_channel':
                            editChannelPopup(channel).then(function(channelData){
                                return MessagingService.edit_channel(getKey(channelData), channelData.name, channelData.description||"");
                            });
                            break;

                        case '_zops_add_members':
                            MessagingPopup.show({
                                templateUrl: "components/messaging/templates/add_user_unit.html",
                                rootElement: popupRootElement,
                                link: function(scope){
                                    scope.title = "Kanala kullanıcı ekle";
                                    scope.placeholder = "Eklemek için kullanıcı ara";
                                    scope.onChange = function(query){
                                        searchWrapper(scope, function(){
                                            return MessagingService.search_user(query);
                                        })
                                    };
                                    scope.onChange("");
                                }
                            }).then(function(user){
                                var userKey = user.key;
                                var channelKey = getKey(channel);
                                return MessagingService.add_members(channelKey, [userKey], user.readonly);
                            });
                            break;

                        case "_zops_add_unit_to_channel":
                            MessagingPopup.show({
                                templateUrl: "components/messaging/templates/add_user_unit.html",
                                rootElement: popupRootElement,
                                link: function(scope){
                                    scope.title = "Birim Ekle";
                                    scope.placeholder = "Kanala eklemek için birim ara";
                                    scope.onChange = function(query){
                                        searchWrapper(scope, function(){
                                            return MessagingService.search_unit(query);
                                        })
                                    };
                                    scope.onChange("");
                                }
                            }).then(function(unit){
                                var unitKey = unit.key;
                                var channelKey = getKey(channel);
                                return MessagingService.add_members(channelKey, unitKey, unit.readonly);
                            });
                            break;
                    }
                };

                function selectChannel(channelKey, silent){
                    if (!silent) iScope.loadingChannel = true;
                    return MessagingService.show_channel(channelKey)
                        .finally(function(){
                            iScope.loadingChannel = false;
                        })
                }

                iScope.selectChannel = function(channel, silent){
                    // enable channel history loading
                    iScope.allMessagesLoaded = false;
                    var channelKey = getKey(channel);
                    selectChannel(channelKey, silent).then(function(result){
                        iScope.selectedChannel = result;
                        iScope.selectedChannel.read_only = channel.read_only;
                        iScope.selectedChannel.messages = result.last_messages;
                        if (iScope.selectedChannel.messages.length < 15){
                            iScope.allMessagesLoaded = true;
                        }
                        updateLastMessage(channel.messages);
                        reportLastSeenMessage();
                    });
                };

                iScope.isChannelSelected = function(channel){
                    return iScope.selectedChannel && getKey(channel) == getKey(iScope.selectedChannel);
                }

                iScope.sendMessage = function(content){
                    if (!content) return;
                    var channelKey = getKey(iScope.selectedChannel);
                    // select message type: 2 - direct message, 4 - channel message;
                    var msgType = iScope.selectedChannel.type == MessagingService.CHANNEL_TYPE.DIRECT ? 2 : 4;
                    MessagingService.create_message(channelKey, msgType, content).then(function(){
                        iScope.shared.message = "";
                    });
                };

                iScope.applyMessageAction = function(message, action){
                    var actionView = action[1];
                    switch (actionView) {

                        case "_zops_favorite_message":
                            MessagingService.add_to_favorites(message.key)
                                .then(function(){
                                    // force actions to reload
                                    message.actions = null;
                                });
                            break;

                        case "_zops_flag_message":
                            MessagingService.flag_message(message.key, true)
                                .then(function(){
                                    // force actions to reload
                                    message.actions = null;
                                });
                            break;

                        case "_zops_unflag_message":
                            MessagingService.flag_message(message.key, false)
                                .then(function(){
                                    // force actions to reload
                                    message.actions = null;
                                });
                            break;

                        case "_zops_delete_message":
                            iScope.deleteConfirmation("Mesajı silmek istediğinize emin misiniz?")
                                .then(function(){
                                    return MessagingService.delete_message(message.key).then(function(){
                                        deleteMessageLocally(message.key);
                                    })
                                });
                            break;

                        case "_zops_edit_message":
                            // find message content container
                            var messageContainer = getMessageElementByKey(message.key);
                            MessagingPopup.show({
                                templateUrl: "components/messaging/templates/edit_message.html",
                                rootElement: messageContainer,
                                // activate inplace editor logic
                                inplaceEditor: true,
                                link: function (scope) {
                                    scope.internalContent = scope.content;
                                    scope.save = function(){
                                        // delete message if new content is empty
                                        if (!scope.internalContent){
                                            return iScope.applyMessageAction(message, ['_', '_zops_delete_message']);
                                        }
                                        MessagingService.edit_message(message.key, scope.internalContent)
                                            .then(function(){
                                                // apply changes to element
                                                scope.content = scope.internalContent;
                                                scope.done();
                                            });
                                    };
                                }
                            });
                            break;
                    }
                };

                iScope.getMessageActions = function(message){
                    if (message.actions) return;
                    MessagingService.get_message_actions(message.key).then(function(result){
                        message.actions = result.actions;
                    })
                };

                iScope.loadMore = function(){
                    if (iScope.allMessagesLoaded) return;
                    if (iScope.selectedChannel.messages.length > 0){
                        var first = iScope.selectedChannel.messages[0];
                        return MessagingService.channel_history(getKey(iScope.selectedChannel), first.timestamp)
                            .then(function(result){
                                var messages = iScope.selectedChannel.messages;
                                if (result.messages.length == 0){
                                    iScope.allMessagesLoaded = true;
                                    return;
                                }
                                // prepend loaded messages to current channel messages list
                                messages.unshift.apply(messages, result.messages);
                                return true;
                            });
                    }
                };

                // listen to new messages and add them to selected channel if any
                $rootScope.$on("message", function(e, message){
                    if (message.is_update){
                        updateMessage(message);
                    } else {
                        appendMessage(iScope.selectedChannel, MessagingService.prepareMessage(message));
                    }
                });
                // notifications in messaging window are processed as ordinary messages
                $rootScope.$on("notifications", function(e, notification){
                    appendMessage(iScope.selectedChannel, MessagingService.prepareMessage(notification));
                });

                $rootScope.$on("user_ready", function(){
                    // init service after user logged in
                    reset();
                    iScope.hideApp();
                });

                $rootScope.$on(MessagingService.SHOW_MESSAGING_WINDOW_EVENT, function(e, channelKey){
                    var showApp = $q.when();
                    if (iScope.chatAppIsHidden){
                        showApp = iScope.showApp();
                    }
                    if (channelKey && channelKey != getKey(iScope.selectedChannel)){
                        showApp.then(function(){
                            iScope.selectChannel(channelKey);
                        })
                    }
                })
            }
        };
    })

    .filter('fromNow', function(Moment){
        return function(datetime){
            return Moment(datetime).fromNow();
        }
    })

    .directive("scrollDownWhenUpdate", function($timeout){
        return {
            link: function(iScope, iElem, iAttrs){
                var elem = $(iElem);
                iAttrs.$observe("scrollDownWhenUpdate", function(value){
                    if (value){
                        // update on next digest
                        $timeout(function(){
                            elem.scrollTop(elem[0].scrollHeight);
                        }, 0);
                    }
                });
            }
        }
    })

    .directive("loadMoreTop", function($compile, $timeout, $q) {
        // centered loader
        var loaderTpl = $compile('<div class="loader" style="float: none; margin: auto; margin-top: 10px;" ng-show="loading"></div>');
        return {
            scope: {
                loadMoreCallback: "&loadMoreTop"
            },
            link: function(iScope, iElem, iAttrs){
                var elem = $(iElem);
                iElem.prepend(angular.element(loaderTpl(iScope)));
                iScope.loading = false;

                function onScroll(){
                    var scrollTop = elem.scrollTop();
                    if (scrollTop <= 0 && !iScope.loading){
                        if (iScope.loadMoreCallback){
                            // save last top element with id position
                            var id = elem.find("[id]").first().attr('id');
                            $timeout(function(){iScope.loading = true});
                            $q.when(iScope.loadMoreCallback())
                                .finally(function(loaded){
                                    $timeout(function(){
                                        iScope.loading = false;
                                        // if new elements loaded
                                        if (loaded){
                                            // try to restore last scroll position;
                                            var lastTopElem = elem.find("#"+id);
                                            if (lastTopElem){
                                                var top = lastTopElem.offset().top - elem.offset().top - 100;
                                                elem.scrollTop(top);
                                            }
                                        }
                                    });
                                })
                        }
                    }
                }

                elem.scroll(onScroll);
            }
        }
    })

    .directive("contenteditable", function(){
        return {
            require: "?ngModel",
            scope: {},
            link: function(iScope, iElem, iAttrs, ngModel) {
                if(!ngModel) return;

                ngModel.$render = function() {
                    iElem.text(ngModel.$viewValue || '');
                };

                // Listen for change events to enable binding
                iElem.on('blur keyup change', function() {
                    iScope.$evalAsync(read);
                });

                function read() {
                    var html = iElem.text();
                    ngModel.$setViewValue(html);
                }

                iScope.$on('$destroy', function(){
                    iElem.off('blur keyup change');
                })
            }
        }
    })

    .directive('autoFocus', function($timeout){
        function placeCaretAtEnd(el) {
            el.focus();
            if (typeof window.getSelection != "undefined"
                && typeof document.createRange != "undefined") {
                var range = document.createRange();
                range.selectNodeContents(el);
                range.collapse(false);
                var sel = window.getSelection();
                sel.removeAllRanges();
                sel.addRange(range);
            } else if (typeof document.body.createTextRange != "undefined") {
                var textRange = document.body.createTextRange();
                textRange.moveToElementText(el);
                textRange.collapse(false);
                textRange.select();
            }
        }
        return {
            link: function(iScope, iElem){
                $timeout(function(){
                    placeCaretAtEnd(iElem[0]);
                }, 500);
            }
        }
    });
