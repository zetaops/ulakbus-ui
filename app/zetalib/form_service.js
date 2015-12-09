/**
 * @license Ulakbus-UI
 * Copyright (C) 2015 ZetaOps Inc.
 *
 * This file is licensed under the GNU General Public License v3
 * (GPLv3).  See LICENSE.txt for details.
 */

/**
 * @name formService
 * @description
 *
 * The `formService` module  provides generic services for auto generated forms.
 *
 */
angular.module('formService', ['ui.bootstrap'])

    /**
     * @name Generator
     * @description
     * form service's Generator factory service handles all generic form operations
     */
    .factory('Generator', function ($http, $q, $timeout, $location, $route, $compile, $log, RESTURL, $rootScope) {
        var generator = {};
        /**
         * @name makeUrl
         * @description
         * this function generates url combining backend url and the related object properties for http requests
         * @param scope
         * @returns {string}
         */
        generator.makeUrl = function (scope) {
            var getparams = scope.form_params.param ? "?" + scope.form_params.param + "=" + scope.form_params.id : "";
            return RESTURL.url + scope.url + getparams;
        };
        /**
         * @name generate
         * @param scope
         * @param data
         * @description
         * # generate function is inclusive for form generation
         * defines given scope's client_cmd, model, schema, form, token, object_id objects
         *
         * @returns {string}
         */
        generator.generate = function (scope, data) {

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
         * @name group
         * @param formObject
         * @description
         * group function to group form layout by form meta data for layout
         * @returns {object}
         */
        generator.group = function (formObject) {
            return formObject;
        };
        /**
         * @name prepareFormItems
         * @description
         * prepareFormItems looks up fields of schema objects and changes their types to proper type for schemaform
         * for listnode, node and model types it uses templates to generate modal
         * prepareforms checks input types and convert if necessary
         *
         * @param scope
         * @returns {*}
         */
        generator.prepareFormItems = function (scope) {

            angular.forEach(scope.form, function (value, key) {
                if (value.type === 'select') {
                    scope.schema.properties[value.key].type = 'select';
                    scope.schema.properties[value.key].titleMap = value.titleMap;
                    scope.form[key] = value.key;
                }
            });

            angular.forEach(scope.schema.properties, function (v, k) {

                // generically change _id fields model value
                if ('form_params' in scope) {
                    if (k == scope.form_params.param) {
                        scope.model[k] = scope.form_params.id;
                        scope.form.splice(scope.form.indexOf(k), 1);
                        return;
                    }
                }

                if (v.type === 'select') {
                    scope.form[scope.form.indexOf(k)] = {
                        type: "template",
                        title: v.title,
                        templateUrl: "shared/templates/select.html",
                        name: k,
                        key: k,
                        titleMap: v.titleMap
                    };
                }


                if (v.type === 'submit' || v.type === 'button') {
                    var buttonPositions = scope.modalElements ? scope.modalElements.buttonPositions : {
                        bottom: 'move-to-bottom',
                        top: 'move-to-top',
                        none: ''
                    };
                    var workOnForm = scope.modalElements ? scope.modalElements.workOnForm : 'formgenerated';
                    var workOnDiv = scope.modalElements ? scope.modalElements.workOnDiv : '';
                    var buttonClass = (buttonPositions[v.position] || buttonPositions.bottom);
                    var redirectTo = scope.modalElements ? false : true;

                    scope.form[scope.form.indexOf(k)] = {
                        type: v.type,
                        title: v.title,
                        style: "btn-danger hide " + buttonClass,
                        onClick: function () {
                            delete scope.form_params.cmd;
                            delete scope.form_params.flow;
                            if (v.cmd) {
                                scope.form_params["cmd"] = v.cmd;
                            }
                            if (v.flow) {
                                scope.form_params["flow"] = v.flow;
                            }
                            scope.model[k] = 1;
                            // todo: test it
                            if (scope.modalElements) {
                                scope.submitModalForm();
                            } else {
                                if (v.validation === false) {
                                    generator.submit(scope, redirectTo);
                                } else {
                                    scope.$broadcast('schemaFormValidate');
                                    if (scope[workOnForm].$valid) {
                                        generator.submit(scope, redirectTo);
                                        scope.$broadcast('disposeModal');
                                    }
                                }
                            }
                        }
                    };
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
                }

                // check if type is date and if type date found change it to string
                if (v.type === 'date') {
                    if (isNaN(new Date(scope.model[k]))) {
                        var modelDate;
                    }
                    else {
                        var modelDate = new Date(scope.model[k]);
                    }
                    scope.model[k] = generator.dateformatter(scope.model[k]);
                    scope.form[scope.form.indexOf(k)] = {
                        key: k, name: k, title: v.title,
                        type: 'template',
                        modelDate: modelDate,
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
                                        if (isNaN(Date.parse([d[1], d[0], d[2]].join('.'))) || dateValue.length !== 3) {
                                            deferred.reject();
                                        } else {
                                            deferred.resolve();
                                        }
                                    }
                                });
                                return deferred.promise;
                            }
                        },
                        status: {opened: false},
                        open: function ($event) {
                            this.status.opened = true;
                        },
                        format: 'dd.MM.yyyy'
                    };
                }

                if (v.type === 'int' || v.type === 'float') {
                    v.type = 'number';
                    scope.model[k] = parseInt(scope.model[k]);
                }

                if (v.type === 'text_general') {
                    v.type = 'string';
                    v["x-schema-form"] = {
                        "type": "textarea"
                        //"placeholder": ""
                    }
                }

                // if type is model use foreignKey.html template to show them
                if (v.type === 'model') {

                    var formitem = scope.form[scope.form.indexOf(k)];
                    var modelScope = {"url": v.wf, "wf": v.wf, "form_params": {model: v.model_name, cmd: v.list_cmd}};

                    //scope.$on('refreshTitleMap', function (event, data) {
                    // todo: write a function to refresh titleMap after new item add to linkedModel
                    //});

                    scope.generateTitleMap = function (modelScope) {
                        generator.get_list(modelScope).then(function (res) {
                            formitem.titleMap = [];
                            angular.forEach(res.data.objects, function (item) {
                                if (item !== "-1") {
                                    formitem.titleMap.push({
                                        "value": item.key,
                                        "name": item.value
                                    });
                                }
                                // get selected item from titleMap using model value
                                if (item.key === scope.model[k]) {
                                    formitem.selected_item = {value: item.key, name: item.value};
                                }
                            });
                            try {
                                // after rendering change input value to model value
                                scope.$watch(document.querySelector('input[name=' + v.model_name + ']'),
                                    function () {
                                        angular.element(document.querySelector('input[name=' + v.model_name + ']')).val(formitem.selected_item.name);
                                    }
                                );
                            }
                            catch (e) {
                                angular.element(document.querySelector('input[name=' + v.model_name + ']')).val(formitem.selected_item.name);
                                $log.debug('exception', e);
                            }

                        })
                    };

                    formitem = {
                        type: "template",
                        templateUrl: "shared/templates/foreignKey.html",
                        // formName will be used in modal return to save item on form
                        formName: k,
                        title: v.title,
                        wf: v.wf,
                        add_cmd: v.add_cmd,
                        name: v.model_name,
                        model_name: v.model_name,
                        selected_item: {},
                        titleMap: scope.generateTitleMap(modelScope),
                        onSelect: function (item) {
                            scope.model[k] = item.value;
                        },
                        onDropdownSelect: function (item, inputname) {
                            scope.model[k] = item.value;
                            jQuery('input[name=' + inputname + ']').val(item.name);
                        }
                    };

                    scope.form[scope.form.indexOf(k)] = formitem;
                }

                if ((v.type === 'ListNode' || v.type === 'Node') && v.widget === 'filter_interface') {
                    var formitem = scope.form[scope.form.indexOf(k)];
                    var modelScope = {
                        "url": v.wf || scope.wf, "wf": v.wf || scope.wf,
                        "form_params": {model: v.model_name || v.schema[0].model_name, cmd: v.list_cmd || 'select_list'}
                    };

                    scope.generateTitleMap = function (modelScope) {
                        generator.get_list(modelScope).then(function (res) {
                            formitem.titleMap = [];
                            angular.forEach(res.data.objects, function (item) {
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
                        wf: v.wf,
                        add_cmd: v.add_cmd,
                        name: v.model_name,
                        model_name: v.model_name,
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

                }

                if ((v.type === 'ListNode' || v.type === 'Node') && v.widget !== 'filter_interface') {
                    //if (v.type === 'ListNode' || v.type === 'Node') {

                    scope[v.type] = scope[v.type] || {};

                    // no pass by reference
                    scope[v.type][k] = angular.copy({
                        title: v.title,
                        form: [],
                        schema: {
                            properties: {},
                            required: [],
                            title: v.title,
                            type: "object",
                            formType: v.type,
                            model_name: k
                        },
                        url: scope.url,
                        wf: scope.wf
                    });

                    if (v.type === 'ListNode') {
                        scope[v.type][k].items = angular.copy(scope.model[k] || []);
                    }

                    angular.forEach(v.schema, function (item) {
                        scope[v.type][k].schema.properties[item.name] = angular.copy(item);

                        // prepare required fields
                        if (item.required === true && item.name !== 'idx') {
                            scope[v.type][k].schema.required.push(angular.copy(item.name));
                        }

                        // idx field must be hidden
                        if (item.name !== 'idx') {
                            scope[v.type][k].form.push(item.name);
                        }

                        if (item.type === 'date') {
                            scope.model[k][item.name] = generator.dateformatter(scope.model[k][item.name]);
                        }

                    });

                    if (scope.model[k]) {
                        angular.forEach(scope.model[k], function (value, key) {
                            angular.forEach(value, function (y, x) {
                                if (y.constructor === Object) {
                                    scope.model[k][key][x] = y.key;
                                }
                            });
                        });
                    }

                    scope.model[k] = scope.model[k] || [];

                    scope[v.type][k].model = scope.model[k];

                    // lengthModels is length of the listnode models. if greater than 0 show records on template
                    scope[v.type][k]['lengthModels'] = scope.model[k] ? 1 : 0;

                }
            });

            $log.debug('scope at after prepareformitems', scope);
            return scope;
        };
        /**
         * dateformatter handles all date fields and returns humanized and jquery datepicker format dates
         * @param formObject
         * @returns {*}
         */
        generator.dateformatter = function (formObject) {
            var ndate = new Date(formObject);
            if (ndate == 'Invalid Date') {
                return '';
            } else {

                var newdatearray = [("0" + ndate.getDate()).slice(-2), ndate.getMonth() + 1, ndate.getFullYear()];
                return newdatearray.join('.');
            }
        };
        generator.doItemAction = function ($scope, key, cmd, mode) {
            // mode could be in ['normal', 'modal', 'new'] . the default mode is 'normal' and it loads data on same
            // tab without modal. 'modal' will use modal to manipulate data and do all actions in that modal. 'new'
            // will be open new page with response data
            var _do = {
                normal: function () {
                    $log.debug('normal mode starts');
                    $scope.form_params.cmd = cmd;
                    $scope.form_params.object_id = key;
                    $scope.form_params.param = $scope.param;
                    $scope.form_params.id = $scope.param_id;
                    $scope.form_params.token = $scope.token;
                    return generator.get_wf($scope);
                },
                modal: function () {
                    $log.debug('modal mode is not not ready');
                },
                new: function () {
                    $log.debug('new mode is not not ready');
                }
            };
            return _do[mode]();
        };

        generator.get_form = function (scope) {
            return $http
                .post(generator.makeUrl(scope), scope.form_params)
                .then(function (res) {
                    return generator.generate(scope, res.data);
                });
        };
        /**
         * gets list of related wf/model
         * @param scope
         * @returns {*}
         */
        generator.get_list = function (scope) {
            return $http
                .post(generator.makeUrl(scope), scope.form_params)
                .then(function (res) {
                    return res;
                });
        };
        /**
         * get_wf is the main function for client_cmd based api calls
         * based on response content it redirects to related path/controller with pathDecider function
         * @param scope
         * @returns {*}
         */
        generator.get_wf = function (scope) {
            return $http
                .post(generator.makeUrl(scope), scope.form_params)
                .then(function (res) {
                    if (res.data.client_cmd) {
                        return generator.pathDecider(res.data.client_cmd, scope, res.data);
                    }
                    if (res.data.msgbox) {
                        scope.msgbox = res.data.msgbox;
                        var newElement = $compile("<msgbox></msgbox>")(scope);
                        // this is the default action, which is removing page items and reload page with msgbox
                        angular.element(document.querySelector('.main.ng-scope')).children().remove();
                        angular.element(document.querySelector('.main.ng-scope')).append(newElement);
                    }
                });
        };
        generator.isValidEmail = function (email) {
            var re = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;
            return re.test(email);
        };
        generator.isValidTCNo = function (tcno) {
            var re = /^([1-9]{1}[0-9]{9}[0,2,4,6,8]{1})$/i;
            return re.test(tcno);
        };
        generator.isValidDate = function (dateValue) {
            return !isNaN(Date.parse(dateValue));
        };
        generator.asyncValidators = {
            emailNotValid: function (value) {
                var deferred = $q.defer();
                $timeout(function () {
                    if (generator.isValidEmail(value)) {
                        deferred.resolve();
                    } else {
                        deferred.reject();
                    }
                }, 500);
                return deferred.promise;
            },
            tcNoNotValid: function (value) {
                var deferred = $q.defer();
                $timeout(function () {
                    if (generator.isValidTCNo(value)) {
                        deferred.resolve();
                    } else {
                        deferred.reject();
                    }
                }, 500);
                return deferred.promise;
            }
        };


        /**
         * pageData object is moving object from response to controller
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
         * pathDecider is used to redirect related path by looking up the data in response
         * @param client_cmd
         * @param $scope
         * @param data
         */
        generator.pathDecider = function (client_cmd, $scope, data) {
            if (client_cmd[0] === 'reload' || client_cmd[0] === 'reset') {
                $rootScope.$broadcast('reload_cmd', $scope.reload_cmd);
                return;
            }
            /**
             * @name redirectTo
             * @description
             * redirectTo function redirects to related controller and path with given data
             * before redirect setPageData must be called and pageData need to be defined
             * otherwise redirected path will call api for its data
             * @param scope
             * @param page
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

            // client_cmd can be in ['list', 'form', 'show', 'reload', 'reset']

            function dispatchClientCmd() {
                data[$scope.form_params.param] = $scope.form_params.id;
                data['model'] = $scope.form_params.model;
                data['wf'] = $scope.form_params.wf;
                data['param'] = $scope.form_params.param;
                data['param_id'] = $scope.form_params.id;
                data['pageData'] = true;
                generator.setPageData(data);

                redirectTo($scope, client_cmd[0]);
            }

            dispatchClientCmd();
        };

        generator.get_diff = function (obj1, obj2) {
            var result = {};
            for (key in obj1) {
                if (obj2[key] != obj1[key]) result[key] = obj1[key];
                if (typeof obj2[key] == 'array' && typeof obj1[key] == 'array')
                    result[key] = arguments.callee(obj1[key], obj2[key]);
                if (typeof obj2[key] == 'object' && typeof obj1[key] == 'object')
                    result[key] = arguments.callee(obj1[key], obj2[key]);
            }
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

        /**
         * submit function is general function for submiting forms
         * @param $scope
         * @returns {*}
         */
        generator.submit = function ($scope, redirectTo) {

            // todo: diff for all submits to recognize form change. if no change returns to view with no submit
            angular.forEach($scope.ListNode, function (value, key) {
                $scope.model[key] = value.model;
            });
            angular.forEach($scope.Node, function (value, key) {
                $scope.model[key] = value.model;
            });
            var data = {
                "form": $scope.model,
                "token": $scope.token,
                "model": $scope.form_params.model,
                "cmd": $scope.form_params.cmd,
                "flow": $scope.form_params.flow,
                "object_id": $scope.object_id,
                "filter": $scope.filter
            };

            return $http.post(generator.makeUrl($scope), data)
                .success(function (data) {
                    if (redirectTo === true) {
                        if (data.client_cmd) {
                            generator.pathDecider(data.client_cmd, $scope, data);
                        }
                        if (data.msgbox) {
                            $scope.msgbox = data.msgbox;
                            var newElement = $compile("<msgbox></msgbox>")($scope);
                            // this is the default action, which is removing page items and reload page with msgbox
                            angular.element(document.querySelector('.main.ng-scope')).children().remove();
                            angular.element(document.querySelector('.main.ng-scope')).append(newElement);
                        }
                    }
                });
        };
        return generator;
    })

    /**
     * @name ModalCtrl
     * @description
     * controller for listnode, node and linkedmodel modal and save data of it
     * @param items
     * @requires $scope, $uibModalInstance, $route
     * @returns returns value for modal
     */

    .controller('ModalCtrl', function ($scope, $uibModalInstance, Generator, items) {
        angular.forEach(items, function (value, key) {
            $scope[key] = items[key];
        });

        $scope.$on('disposeModal', function () {
            $scope.cancel();
        });

        $scope.$on('modalFormLocator', function (event) {
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
     * @name modalForNodes
     * @description
     * add modal directive for nodes
     * @param $uibModal
     * @returns openmodal directive
     */

    .directive('modalForNodes', function ($uibModal, Generator) {
        return {
            link: function (scope, element, attributes) {
                element.on('click', function () {
                    var modalInstance = $uibModal.open({
                        animation: true,
                        backdrop: 'static',
                        keyboard: false,
                        templateUrl: 'shared/templates/listnodeModalContent.html',
                        controller: 'ModalCtrl',
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
                                    scope.node.schema.properties[key].wf = scope.node.url;
                                    scope.node.schema.properties[key].list_cmd = 'select_list';
                                });

                                var newscope = {
                                    wf: scope.node.wf,
                                    url: scope.node.url,
                                    form_params: {model: scope.node.schema.model_name},
                                    edit: attribs[3]
                                };

                                Generator.generate(newscope, {forms: scope.node});
                                // modal will add only one item to listNode, so just need one model (not array)
                                newscope.model = angular.copy(newscope.model[node.edit] || newscope.model[0] || {});
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
                                    angular.forEach(childmodel.form, function (v, k) {
                                        if (v.formName === key) {
                                            //if (!childmodel.model[key].key) {
                                            function indexInTitleMap(element, index, array) {
                                                if (element['value'] === value) {
                                                    return element;
                                                }
                                            }

                                            reformattedModel[key] = {
                                                "key": value,
                                                "unicode": v.titleMap.find(indexInTitleMap).name
                                            };
                                            //}
                                        }
                                    });
                                } else {
                                    reformattedModel[key] = {
                                        "key": key,
                                        "unicode": value
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
     * @name addModalForLinkedModel
     * @description
     * add modal directive for linked models
     * @param $uibModal, Generator
     * @returns openmodal directive
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
                        controller: 'ModalCtrl',
                        size: 'lg',
                        resolve: {
                            items: function () {
                                var formName = attributes.addModalForLinkedModel;
                                return Generator.get_form({
                                    url: scope.form.wf,
                                    wf: scope.form.wf,
                                    form_params: {model: scope.form.model_name, cmd: scope.form.add_cmd},
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
                        Generator.submit(childscope, false)
                            .success(function (data) {
                                // response data contains object_id and unicode
                                // scope.model can be reached via prototype chain
                                scope.model[formName] = data.forms.model.object_key;
                                // scope.form prototype chain returns this form item
                                scope.form.titleMap.push({
                                    value: data.forms.model.object_key,
                                    name: data.forms.model.unicode
                                });
                                scope.form.selected_item = {
                                    value: data.forms.model.object_key,
                                    name: data.forms.model.unicode
                                };
                                scope.$watch(document.querySelector('input[name=' + scope.form.model_name + ']'),
                                    function () {
                                        angular.element(document.querySelector('input[name=' + scope.form.model_name + ']')).val(scope.form.selected_item.name);
                                    }
                                );
                            });
                        //$route.reload();
                    });
                });
            }
        };
    })

    .directive('modalFormLocator', function () {
        return {
            link: function (scope) {
                scope.$emit('modalFormLocator');
            }
        }
    })

    /**
     * @name editModalForLinkedModel
     * @description
     * edit modal directive for linked models
     * @param $uibModal, Generator
     * @returns openmodal directive
     */

    // todo: useless modal check if any use cases?? and delete if useless

    .directive('editModalForLinkedModel', function ($uibModal, Generator) {
        return {
            link: function (scope, element) {
                element.on('click', function () {
                    var modalInstance = $uibModal.open({
                        animation: false,
                        templateUrl: 'shared/templates/linkedModelModalContent.html',
                        controller: 'ModalCtrl',
                        size: 'lg',
                        resolve: {
                            items: function () {
                                return Generator.get_form({
                                    url: 'crud',
                                    form_params: {'model': scope.form.title, "cmd": "form"}
                                });
                            }
                        }
                    });

                    modalInstance.result.then(function (childmodel, key) {
                        Generator.submit(childmodel);
                    });
                });
            }
        };
    });