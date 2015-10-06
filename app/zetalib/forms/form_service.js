/**
 * Copyright (C) 2015 ZetaOps Inc.
 *
 * This file is licensed under the GNU General Public License v3
 * (GPLv3).  See LICENSE.txt for details.
 */

var form_generator = angular.module('formService', ['general']);

form_generator.factory('Generator', function ($http, $q, $timeout, RESTURL, FormDiff, $rootScope) {
    var generator = {};
    generator.makeUrl = function (url) {
        return RESTURL.url + url;
    };
    generator.generate = function (scope, data) {

        // if no form in response (in case of list and single item request) return scope
        if (!data.forms) {
            return scope;
        }

        // prepare scope form, schema and model from response object
        angular.forEach(data.forms, function (value, key) {
            scope[key] = data.forms[key];
        });

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
    generator.group = function (formObject) {
        return formObject;
    };
    generator.prepareFormItems = function (scope) {
        /**
         * prepareforms checks input types and convert if necessary
         */
        angular.forEach(scope.schema.properties, function (k, v) {
            // check if type is date and if type date found change it to string

            if (k.type === 'date') {
                k.type = 'string';
                scope.model[v] = generator.dateformatter(scope.model[v]);

                $timeout(function () {
                    jQuery('#' + v).datepicker({
                        changeMonth: true,
                        changeYear: true,
                        dateFormat: "dd.mm.yy",
                        onSelect: function (date) {
                            scope.model[v] = date;
                        }
                    });
                });
            }

            if (k.type === 'int' || k.type === 'float') {
                k.type = 'number';
            }

            // if type is model use foreignKey.html template to show them

            if (k.type === 'model') {

                var formitem = scope.form[scope.form.indexOf(v)];
                var modelscope = {"url": scope.url, "form_params": {model: k.model_name}};

                formitem = {
                    type: "template",
                    templateUrl: "shared/templates/foreignKey.html",
                    title: k.title,
                    model_name: k.model_name,
                    titleMap: generator.get_list(modelscope).then(function (res) {
                        formitem.titleMap = [];
                        angular.forEach(res.data.objects, function (item) {
                            formitem.titleMap.push({
                                "value": item.key,
                                "name": item.data.name || item.data.username
                            });
                        });
                    }),
                    onChange: function (modelValue, form) {
                        scope.model[v] = modelValue;
                    }
                };

                // get model objects from db and add to select list

                scope.form[scope.form.indexOf(v)] = formitem;
                //scope.$broadcast('schemaFormRedraw');

                // todo: make lines below work properly
                //if (scope.model[v].indexOf("TMP_") > -1) {
                //    scope.model[v] = null;
                //}
            }

            if (k.type === 'ListNode' || k.type === 'Node') {

                scope[k.type] = scope[k.type] || {};

                scope[k.type][v] = {
                    title: k.title,
                    form: [],
                    schema: {
                        properties: {},
                        required: [],
                        title: k.title,
                        type: "object",
                        formType: k.type,
                        model_name: v
                    },
                    url: scope.url
                };

                if (scope.model[v] === null) {
                    scope[k.type][v].model = k.type === 'Node' ? {} : [];
                } else {
                    scope[k.type][v].model = scope.model[v];
                }

                angular.forEach(k.schema, function (item) {
                    scope[k.type][v].schema.properties[item.name] = item;

                    // prepare required fields
                    if (item.required === true && item.name !== 'idx') {
                        scope[k.type][v].schema.required.push(item.name);
                    }

                    // idx field must be hidden
                    if (item.name === 'idx') {
                        scope[k.type][v].form.push({type: 'string', key: item.name, htmlClass: 'hidden'});
                    } else {
                        scope[k.type][v].form.push(item.name);
                    }

                });

                // lengthModels is length of the listnode models. if greater than 0 show records on template
                scope[k.type][v]['lengthModels'] = scope.model[v] ? 1 : 0;

            }

        });

        return scope;
    };
    generator.dateformatter = function (formObject) {
        var ndate = new Date(formObject);
        if (ndate === 'Invalid Date') {
            return '';
        }
        var newdatearray = [ndate.getDate(), ndate.getMonth(), ndate.getFullYear()];
        return newdatearray.join('.');
    };
    generator.get_form = function (scope) {
        return $http
            .post(generator.makeUrl(scope.url), scope.form_params)
            .then(function (res) {
                return generator.generate(scope, res.data);
                // todo: cover all other exceptions (4xx, 5xx)
            });
    };
    generator.get_list = function (scope) {
        return $http
            .post(generator.makeUrl(scope.url), scope.form_params)
            .then(function (res) {
                //generator.dateformatter(res);
                return res;
                // todo: cover all other exceptions (4xx, 5xx)
            });
    };
    generator.get_single_item = function (scope) {
        return $http
            .post(generator.makeUrl(scope.url), scope.form_params)
            .then(function (res) {
                //generator.dateformatter(res);
                return res;
                // todo: cover all other exceptions (4xx, 5xx)
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
            "cmd": $scope.form_params.cmd,
            "subcmd": "do_list",
            "model": $scope.form_params.model,
            "token": $scope.token
        };
        if ($scope.object_id) {
            //var get_diff = FormDiff.get_diff($scope.model, $scope.initialModel);
            data.object_id = $scope.object_id;
            //data.form = get_diff;
        }

        return $http.post(generator.makeUrl($scope.url), data);
            //.success(function () {
            //
            //})
            //.then(function (res) {
            //    if (res.data.client_cmd) {
            //        console.log("record fin");
            //        $location.path($scope.form_params.model);
            //    }
            //});
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
        console.log(form.$valid);
        //if(form.$valid){
        // todo: change to if form valid
        if (1 === 1) {
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

form_generator.directive('addModalForLinkedModel', function ($modal, Generator) {
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
                                url: 'crud',
                                form_params: {'model': scope.form.model_name, "cmd": "add"}
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
                                url: 'crud',
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