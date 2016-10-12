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
                var a = "Generator.get_wf($scope)";
                    console.log(a,Generator.get_wf($scope));
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
