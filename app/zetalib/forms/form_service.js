/**
 * Copyright (C) 2015 ZetaOps Inc.
 *
 * This file is licensed under the GNU General Public License v3
 * (GPLv3).  See LICENSE.txt for details.
 */

var form_generator = angular.module('formService', ['general', 'ui.bootstrap']);

form_generator.factory('Generator', function ($http, $q, $log, $modal, $timeout, RESTURL, FormDiff) {
    var generator = {};
    generator.makeUrl = function (url) {
        return RESTURL.url + url;
    };
    generator.generate = function (scope, forms) {
        if (!forms){return scope;}
        for (var key in forms)
            scope[key] = forms[key];
        scope.initialModel = angular.copy(scope.model);
        scope.form.push(
            {
                type: "submit",
                title: "Save"
            }
        );
        // if fieldset in form, make it collapsable with template
        scope.listnodeform = {};

        angular.forEach(scope.schema.properties, function(k, v){
            // check if type is date and if type date found change it to string
            // and give it 'format':'date' property
            // todo: make datepicker work below

            if (k.type == 'date') {
                k.type="template";
                k.templateUrl = "shared/templates/datefield.html";
                //scope.form[scope.form.indexOf(v)] = {
                //    "key": k.name,
                //    "minDate": "1995-09-01",
                //    "maxDate": new Date(),
                //    "format": "yyyy-mm-dd"
                //}
                scope.model[v] = null;
            }
            debugger;

            if (k.type == 'int') {k.type='number'}

            // if type is model use foreignKey.html template to show them

            if (k.type == 'model') {

                var formitem = scope.form[scope.form.indexOf(v)];

                formitem = {
                    "type": "template",
                    "templateUrl": "shared/templates/foreignKey.html",
                    "title": k.model_name,

                };
                k.title = k.model_name;
                var modelscope = {"url": scope.url, "form_params": {model: k.model_name}};

                // get model objects from db and add to select list
                generator.get_list(modelscope).then(function(res){
                    formitem.titleMap = [];
                    angular.forEach(res.data.objects, function(item){
                        formitem.titleMap.push({
                            "value": item.key,
                            "name": item.data.name ? item.data.name : item.data.username
                        });

                    });

                });
                scope.form[scope.form.indexOf(v)] = formitem;
            }
        });

        // catch node and listnode and edit their schema and form props
        if ((scope.listnode && scope.listnodes[0]) || (scope.nodes && scope.nodes[0])) {
            angular.forEach(scope.form, function (key, val) {
                if (typeof key == "object" && key.type == "fieldset") {
                    // change type to use shared template for form
                    key.type = "template";
                    key.templateUrl = "shared/templates/fieldset.html";
                    // check if fieldset in listnodes
                    if (scope.listnodes.indexOf(key.title) >= 0) {
                        scope.listnodeform[key.title] = {};
                        scope.listnodeform[key.title]["schema"] = {
                            "title": angular.copy(key.title),
                            "type": "object",
                            "properties": {},
                            "required": []
                        };
                        angular.forEach(scope.schema.properties, function(k, v){
                            angular.forEach(key.items, function(item){
                                if(item.key == v){
                                    scope.listnodeform[key.title]["schema"]["properties"][v] = angular.copy(k);
                                }
                            });
                        });
                        key.setType = "ListNode";
                        scope.listnodeform[key.title]["form"] = [angular.copy(key)];
                        scope.listnodeform[key.title]["model"] = {};
                        key.type = "list";
                        delete key.templateUrl;
                        delete key.items;
                    }
                }
            });
        }
        scope.isCollapsed = true;
        scope.object_id = scope.form_params['object_id'];
        // open modal with given items and controller
        scope.openmodal = function(listnode, nodeID){
            var modalInstance = $modal.open({
                animation: false,
                templateUrl: 'shared/templates/listnodeModalContent.html',
                controller: 'ListNodeModalCtrl',
                size: 'lg',
                resolve: {
                    items: function () {
                        if (nodeID){
                            scope.listnodeform[listnode].model = 1;
                        }
                        return scope.listnodeform[listnode];
                    }
                }
            });

            modalInstance.result.then(function (childmodel, key) {

                angular.forEach(childmodel, function(v, k){
                    if (scope.model[k]){
                        scope.model[k][v.idx] = v;
                    } else {
                        scope.model[k] = {};
                        scope.model[k][v.idx] = v;
                    }
                    scope.$broadcast('schemaFormRedraw');
                });
            });
        };
        return generator.group(scope);
    };
    generator.group = function (formObject) {
        return formObject;
    };
    generator.dateformatter = function(formObject){
        //angular.forEach(formObject.objects, function(k, v) {
            // check if date string and convert to date object
            // todo: catch date object and convert
            //debugger;
        //});
        return formObject;
    };
    generator.get_form = function (scope) {
        return $http
            .post(generator.makeUrl(scope.url), scope.form_params)
            .then(function (res) {
                return generator.generate(scope, res.data.forms);
                // todo: cover all other exceptions (4xx, 5xx)
            });
    };
    generator.get_list = function (scope) {
        return $http
            .post(generator.makeUrl(scope.url), scope.form_params)
            .then(function (res) {
                generator.dateformatter(res);
                return res;
                // todo: cover all other exceptions (4xx, 5xx)
            });
    };
    generator.get_single_item = function (scope) {
        return $http
            .post(generator.makeUrl(scope.url), scope.form_params)
            .then(function (res) {
                generator.dateformatter(res);
                return res;
                // todo: cover all other exceptions (4xx, 5xx)
            });
    };
    generator.isValidEmail = function (email) {
        var re = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;
        return re.test(email);
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
        }
    };
    generator.submit = function ($scope) {
        debugger;
        data = {
            "form": $scope.model,
            "cmd": $scope.form_params.cmd,
            "subcmd": "do_list",
            "model": $scope.form_params.model,
            "token": $scope.token
        };
        if ($scope.object_id) {
            var get_diff = FormDiff.get_diff($scope.model, $scope.initialModel);
            var data = {
                "object_id": $scope.object_id,
                "form": get_diff
            };
        }
        return $http.post(generator.makeUrl($scope.url), data);
    };
    return generator;
});

/**
 * ListNodeModalCtrl
 * controller to use with openmodal function of Generator
 * @params: $scope, $modalInstance, items
 * @returns: return value used in openmodal's result function
 */

form_generator.controller('ListNodeModalCtrl', function ($scope, $modalInstance, items) {
    for (var key in items)
        $scope[key] = items[key];
    $scope.onSubmit = function(form){
        // send form to modalinstance result function
        $modalInstance.close($scope.model, $scope.form.title);
    };
    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
});

form_generator.controller('LinkedModelModalCtrl', function ($scope, $modalInstance, $route, items) {
    angular.forEach(["model", "schema", "form"], function(key){
        $scope[key] = items[key];
    });
    $scope.onSubmit = function(){
        // send form to modalinstance result function
        $modalInstance.close($scope);
        $route.reload();
    };
    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
        $route.reload();
    };
});

// todo: generic modal directive for all forms
//form_generator.directive('openmodal', ['Generator', function (Generator, $modal) {
//    return {
//        link: function ($modal) {
//            var modalInstance = $modal.open({
//                animation: false,
//                templateUrl: 'shared/templates/modalContent.html',
//                controller: 'ModalInstanceCtrl',
//                size: 'lg',
//                resolve: {
//                    items: function () {
//                        return "";
//                    }
//                }
//            });
//
//            modalInstance.result.then(function (selectedItem) {
//                $scope.selected = selectedItem;
//            }, function () {
//                $log.info('Modal dismissed at: ' + new Date());
//            });
//        }
//    }
//}]);

/**
 * modal directive for linked models
 */

form_generator.directive('addModal', function ($modal, Generator) {
    return {
        link: function (scope, element) {
            element .on('click', function () {
                debugger;
                var modalInstance = $modal.open({
                    animation: false,
                    templateUrl: 'shared/templates/linkedModelModalContent.html',
                    controller: 'LinkedModelModalCtrl',
                    size: 'lg',
                    resolve: {
                        items: function () {
                            debugger;
                            scope.url = 'crud';
                            scope.form_params = {'model': scope.form.title, "cmd": "add"};
                            return Generator.get_form(scope);
                        }
                    }
                });

                modalInstance.result.then(function (childmodel, key) {
                    Generator.submit(scope);
                    //angular.forEach(childmodel, function(v, k){
                    //    if ($scope.model[k]){
                    //        $scope.model[k][v.idx] = v;
                    //    } else {
                    //        $scope.model[k] = {};
                    //        $scope.model[k][v.idx] = v;
                    //    }
                    //scope.$broadcast('schemaFormRedraw');
                    //scope.apply();
                    //});
                });
                //$scope.$broadcast('schemaFormRedraw');
                //$scope.$apply();
            });
        }
    }
});