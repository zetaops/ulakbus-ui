/**
 * Copyright (C) 2015 ZetaOps Inc.
 *
 * This file is licensed under the GNU General Public License v3
 * (GPLv3).  See LICENSE.txt for details.
 */

var form_generator = angular.module('formService', ['general']);

/**
 * form service's Generator factory service handles all generic form operations
 */
form_generator.factory('Generator', function ($http, $q, $timeout, $location, $compile, RESTURL, FormDiff, $rootScope) {
    var generator = {};
    generator.makeUrl = function (scope) {
        var getparams = scope.form_params.param ? "?" + scope.form_params.param + "=" + scope.form_params.id : "";
        return RESTURL.url + scope.url + '/' + (scope.form_params.model || '') + getparams;
    };
    /**
     * generate function is inclusive for form generation
     * defines given scope's client_cmd, model, schema, form, token, object_id objects
     * @param scope
     * @param data
     * @returns {*}
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

        // showSaveButton is used for to show or not to show save button on top of the page
        // here change to true because the view retrieves form from api
        $rootScope.showSaveButton = true;

        return scope;
    };
    /**
     * group function to group form layout by form meta data for layout
     * @param formObject
     * @returns {*}
     */
    generator.group = function (formObject) {
        return formObject;
    };
    /**
     * prepareFormItems looks up fields of schema objects and changes their types to proper type for schemaform
     * for listnode, node and model types it uses templates to generate modal
     * @param scope
     * @returns {*}
     */
    generator.prepareFormItems = function (scope) {
        /**
         * prepareforms checks input types and convert if necessary
         */

            // todo: remove after backend fix
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
                scope.form[scope.form.indexOf(k)] = {
                    type: v.type,
                    title: v.title,
                    style: "btn-primary movetobottom hide pull-left",
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
                        scope.$broadcast('schemaFormValidate');
                        if (scope.formgenerated.$valid) {
                            generator.submit(scope);
                        }
                    }
                };
                $timeout(function () {
                    var buttons = angular.element(document.querySelector('.movetobottom'));
                    angular.element(document.querySelector('.buttons-on-bottom')).append(buttons);
                    buttons.removeClass('hide');
                });
            }

            // check if type is date and if type date found change it to string

            if (v.type === 'date') {
                v.type = 'string';
                scope.model[k] = generator.dateformatter(scope.model[k]);

                $timeout(function () {
                    jQuery('#' + k).datepicker({
                        changeMonth: true,
                        changeYear: true,
                        dateFormat: "dd.mm.yy",
                        onSelect: function (date, inst) {
                            scope.model[k] = date;
                            scope.$broadcast('schemaForm.error.' + k, 'tv4-302', true);
                        }
                    });
                });
            }

            if (v.type === 'int' || v.type === 'float') {
                v.type = 'number';
                scope.model[k] = parseInt(scope.model[k]);
            }

            if (v.type === 'text_general') {
                v.type = 'string';
                v["x-schema-form"] = {
                    "type": "textarea",
                    //"placeholder": ""
                }
            }

            // if type is model use foreignKey.html template to show them

            if (v.type === 'model') {

                var formitem = scope.form[scope.form.indexOf(k)];
                var modelscope = {"url": scope.url, "form_params": {model: v.model_name}};

                formitem = {
                    type: "template",
                    templateUrl: "shared/templates/foreignKey.html",
                    title: v.title,
                    name: v.model_name,
                    model_name: v.model_name,
                    titleMap: generator.get_list(modelscope).then(function (res) {
                        formitem.titleMap = [];
                        angular.forEach(res.data.objects, function (item) {
                            if (item !== res.data.objects[0]) {
                                formitem.titleMap.push({
                                    "value": item[0],
                                    "name": item[1] + ' ' + (item[2] ? item[2] : '') + '...'
                                });
                            }
                        });
                    }),
                    onSelect: function (item) {
                        scope.model[k] = item.value;
                    },
                    onDropdownSelect: function (item, inputname) {
                        scope.model[k] = item.value;
                        jQuery('input[name=' + inputname + ']').val(item.name);
                    }
                };

                // get model objects from db and add to select list

                scope.form[scope.form.indexOf(k)] = formitem;
                //scope.$broadcast('schemaFormRedraw');

                // todo: make lines below work properly
                //if (scope.model[v].indexOf("TMP_") > -1) {
                //    scope.model[v] = null;
                //}
            }

            if (v.type === 'ListNode' || v.type === 'Node') {

                scope[v.type] = scope[v.type] || {};

                scope[v.type][k] = {
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
                    url: scope.url
                };

                if (scope.model[k] === null) {
                    scope[v.type][k].model = v.type === 'Node' ? {} : [];
                } else {
                    scope[v.type][k].model = scope.model[k];
                }

                angular.forEach(v.schema, function (item) {
                    scope[v.type][k].schema.properties[item.name] = item;

                    // prepare required fields
                    if (item.required === true && item.name !== 'idx') {
                        scope[v.type][k].schema.required.push(item.name);
                    }

                    // idx field must be hidden
                    if (item.name === 'idx') {
                        scope[v.type][k].form.push({type: 'string', key: item.name, htmlClass: 'hidden'});
                    } else {
                        scope[v.type][k].form.push(item.name);
                    }

                });

                // lengthModels is length of the listnode models. if greater than 0 show records on template
                scope[v.type][k]['lengthModels'] = scope.model[k] ? 1 : 0;

            }
        });

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
            var newdatearray = [ndate.getDate(), ndate.getMonth()+1, ndate.getFullYear()];
            return newdatearray.join('.');
        }
    };
    /**
     * itemLinksGenerator function used for generic links for list items
     * basicly creates add, edit, detail links
     * @param scope
     * @param itemlist
     * @returns links
     */
    generator.itemLinksGenerator = function (scope, itemlist) {
        angular.forEach(itemlist.objects, function (value, key) {
            function makelink(page) {
                if (value === '-1' && page !== 'add/') {
                    return;
                }

                var link = "#" + scope.url;
                if (scope.form_params) {
                    if (scope.form_params.model) {
                        link += '/' + scope.form_params.model;
                    }
                }

                link += "/" + page;

                if (page === 'edit/' || page === 'detail/') {
                    link += value.key;
                }

                if (scope.form_params) {
                    if (scope.form_params.param) {
                        link += "?" + scope.form_params.param + "=" + scope.form_params.id;
                    }
                }
                return link;
            }

            // call add link once
            if (!itemlist.addLink) {
                itemlist.addLink = makelink("add/");
            }

            if (value !== '-1') {
                value.detailLink = makelink("detail/");
                value.editLink = makelink("edit/");
            }
        });
    };
    /**
     * gets form
     * @param scope
     * @returns {*}
     */
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
            .get(generator.makeUrl(scope))
            .then(function (res) {
                //generator.dateformatter(res);
                generator.itemLinksGenerator(scope, res.data);
                return res;
            });
    };
    /**
     * gets single object with object_id
     * @param scope
     * @returns {*}
     */
    generator.get_single_item = function (scope) {
        return $http
            .post(generator.makeUrl(scope), scope.form_params)
            .then(function (res) {
                //generator.dateformatter(res);
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
                //generator.generate(scope, res.data);
                generator.pathDecider(res.data.client_cmd, scope, res.data);
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
     * @param $scope
     * @param data
     */
    generator.pathDecider = function (client_cmd, $scope, data) {
        /**
         * redirectTo function redirects to related controller and path with given data
         * before redirect setPageData must be called and pageData need to be defined
         * otherwise redirected path will call api for its data
         * @param scope
         * @param page
         */
        function redirectTo(scope, page){
            var pathUrl = scope.form_params.wf;
            if (scope.form_params.model) {
                pathUrl += '/' + scope.form_params.model + '/' + page;
            } else {
                pathUrl += '/' + page;
            }
            $location.path(pathUrl).search(angular.fromJson({pageData: true}));
        }
        if (client_cmd.indexOf('form') > -1 && client_cmd.indexOf('list') < 0) {
            generator.setPageData(data);
            redirectTo($scope, 'add');
        }

        if (client_cmd.indexOf('list') > -1 && client_cmd.indexOf('form') < 0) {
            data[$scope.form_params.param] = $scope.form_params.id;
            data['model'] = $scope.form_params.model;
            data['wf'] = $scope.form_params.wf;

            generator.setPageData(data);
            generator.itemLinksGenerator($scope, data);

            redirectTo($scope, 'list');
        }

        if (client_cmd.indexOf('form') > -1 && client_cmd.indexOf('list') > -1) {
            // todo: will be tested
            generator.generate($scope, data);
            generator.itemLinksGenerator($scope, data);
            data[$scope.form_params.param] = $scope.form_params.id;
            redirectTo($scope, 'formwithlist');
        }

        //todo: msgbox make it work
        // if submit returns msgbox after save
        //if (data.msgbox) {
        //    $scope.msgbox = data.msgbox;
        //    var newElement = $compile("<msgbox ></msgbox>")($scope);
        //    angular.element(document.querySelector('.main.ng-scope')).children().remove();
        //    angular.element(document.querySelector('.main.ng-scope')).append(newElement);
        //}
    };

    /**
     * submit function is general function for submiting forms
     * @param $scope
     * @returns {*}
     */
    generator.submit = function ($scope) {

        // todo: diff for all submits to recognize form change. if no change returns to view with no submit
        angular.forEach($scope.ListNode, function (value, key) {
            $scope.model[key] = value.model;
        });
        angular.forEach($scope.Node, function (value, key) {
            $scope.model[key] = value.model;
        });
        var data = {
            "form": $scope.model,
            "token": $scope.token
        };
        if ($scope.form_params.model) {
            data["model"] = $scope.form_params.model;
        }

        if ($scope.form_params.cmd) {
            data["cmd"] = $scope.form_params.cmd;
        }
        if ($scope.form_params.flow) {
            data["flow"] = $scope.form_params.flow;
        }
        // todo: remove object_id ?? why?
        if ($scope.object_id) {
            //var get_diff = FormDiff.get_diff($scope.model, $scope.initialModel);
            data.object_id = $scope.object_id;
            //data.form = get_diff;
        }

        return $http.post(generator.makeUrl($scope), data)
            .success(function (data) {
                generator.pathDecider(data.client_cmd, $scope, data);
            });
    };
    return generator;
});

/**
 * ModalCtrl
 * controller for listnode, node and linkedmodel modal and save data of it
 * @params: $scope, $modalInstance, $route, items
 * @returns: returns value for modal
 */

form_generator.controller('ModalCtrl', function ($scope, $modalInstance, Generator, items) {
    angular.forEach(items, function (value, key) {
        $scope[key] = items[key];
    });

    Generator.prepareFormItems($scope);

    $scope.onSubmit = function (form) {
        $scope.$broadcast('schemaFormValidate');
        if (form.$valid) {
            // send form to modalinstance result function
            $modalInstance.close($scope);

        }
    };
    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
});

/**
 * add modal directive for nodes
 * @params: $modal
 * @return: openmodal directive
 */

form_generator.directive('modalForNodes', function ($modal) {
    return {
        link: function (scope, element, attributes) {
            element.on('click', function () {
                var modalInstance = $modal.open({
                    animation: false,
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

                            return node;
                        }
                    }
                });

                modalInstance.result.then(function (childmodel, key) {

                    if (childmodel.schema.formType === 'Node') {
                        scope.$parent[childmodel.schema.formType][childmodel.schema.model_name].model = childmodel.model;
                    }

                    if (childmodel.schema.formType === 'ListNode') {
                        if (childmodel.edit) {
                            scope.$parent[childmodel.schema.formType][childmodel.schema.model_name].model[childmodel.edit] = childmodel.model;
                        } else {
                            scope.$parent[childmodel.schema.formType][childmodel.schema.model_name].model.push(childmodel.model);
                        }
                    }

                    scope.$parent[childmodel.schema.formType][childmodel.schema.model_name].lengthModels += 1;
                });
            });
        }
    };
});


/**
 * add modal directive for linked models
 * @params: $modal, Generator
 * @return: openmodal directive
 */

form_generator.directive('addModalForLinkedModel', function ($modal, $route, Generator) {
    return {
        link: function (scope, element) {
            element.on('click', function () {
                var modalInstance = $modal.open({
                    animation: false,
                    templateUrl: 'shared/templates/linkedModelModalContent.html',
                    controller: 'ModalCtrl',
                    size: 'lg',
                    resolve: {
                        items: function () {
                            return Generator.get_form({
                                url: 'crud/',
                                form_params: {'model': scope.form.model_name, "cmd": "add"}
                            });
                        }
                    }
                });

                modalInstance.result.then(function (childmodel, key) {
                    Generator.submit(childmodel);
                    $route.reload();
                });
            });
        }
    };
});

/**
 * edit modal directive for linked models
 * @params: $modal, Generator
 * @return: openmodal directive
 */

// todo: useless modal check if any use cases?? and delete if useless

form_generator.directive('editModalForLinkedModel', function ($modal, Generator) {
    return {
        link: function (scope, element) {
            element.on('click', function () {
                var modalInstance = $modal.open({
                    animation: false,
                    templateUrl: 'shared/templates/linkedModelModalContent.html',
                    controller: 'ModalCtrl',
                    size: 'lg',
                    resolve: {
                        items: function () {
                            return Generator.get_form({
                                url: 'crud/',
                                form_params: {'model': scope.form.title, "cmd": "add"}
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