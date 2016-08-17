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
    .factory('Generator', function ($http, $q, $timeout, $sce, $location, $route, $compile, $log, RESTURL, $rootScope, Moment, WSOps, FormConstraints, $uibModal, $filter) {
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
                    // todo: needs refactor
                    if (v.type === 'ListNode') {
                        scope[v.type][k].items = angular.copy(scope.model[k] || []);
                        angular.forEach(scope[v.type][k].items, function (value, key) {
                            if (value.constructor === Object) {
                                angular.forEach(value, function (x, y) {
                                    try {
                                        if (scope[v.type][k].schema.properties[y].type === 'date') {
                                            scope[v.type][k].items[key][y] = generator.dateformatter(x);
                                            scope[v.type][k].model[key][y] = generator.dateformatter(x);
                                        }
                                        if (scope[v.type][k].schema.properties[y].type === 'select') {
                                            scope[v.type][k].items[key][y] = generator.item_from_array(x.toString(), scope[v.type][k].schema.properties[y].titleMap)
                                        }
                                    } catch (e) {
                                        $log.debug('Field is not date');
                                    }
                                });
                            }
                        });
                    }
                });


                // todo: check this place to fix 'keys instead of names' bug
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
                                })
                                .then(function (data) {
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
    .controller('ModalController', function ($scope, $uibModalInstance, Generator, items) {
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
     * @memberof ulakbus.formService
     * @ngdoc directive
     * @name modalForNodes
     * @description add modal directive for nodes
     * @param {Module} $uibModal
     * @param {Service} Generator
     * @returns {Object} openmodal directive
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
                                            function indexInTitleMap(element, index, array) {
                                                if (element['value'] === value) {
                                                    return element;
                                                }
                                            }
                                            var unicodeValue = v.titleMap.find(indexInTitleMap);
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
