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
        if (!forms) {
            return scope;
        }
        for (var key in forms)
            scope[key] = forms[key];

        scope.initialModel = angular.copy(scope.model);

        // if fieldset in form, make it collapsable with template
        //scope.listnodeform = {};

        angular.forEach(scope.schema.properties, function (k, v) {
            // check if type is date and if type date found change it to string
            // and give it 'format':'date' property
            // todo: make datepicker work below

            if (k.type == 'date') {
                k.title= k.title;
                scope.form[scope.form.indexOf(v)] = {
                    "type": "template",
                    "templateUrl": "shared/templates/datefield.html",
                    "title": k.title,
                    "key": k.name,
                };
                //var parentScope = scope.$parent.$parent.$parent.$parent;
                //scope.today = function() {
                //    scope.dt = new Date();
                //};
                //scope.today();
                //
                //scope.clear = function () {
                //    scope.dt = null;
                //};
                //
                //// Disable weekend selection
                //scope.disabled = function(date, mode) {
                //    return ( mode === 'day' && ( date.getDay() === 0 || date.getDay() === 6 ) );
                //};
                //
                //scope.toggleMin = function() {
                //    scope.minDate = scope.minDate ? null : new Date();
                //};
                //scope.toggleMin();
                //scope.maxDate = new Date(2020, 5, 22);
                //
                //scope.open = function($event) {
                //    debugger;
                //    scope.status.opened = true;
                //};
                //
                //scope.dateOptions = {
                //    formatYear: 'yy',
                //    startingDay: 1,
                //    initDate: new Date('01-01-1900')
                //};
                //
                //scope.format = 'dd.MM.yyyy';
                //
                //scope.status = {
                //    opened: false
                //};
                //
                //var tomorrow = new Date();
                //tomorrow.setDate(tomorrow.getDate() + 1);
                //var afterTomorrow = new Date();
                //afterTomorrow.setDate(tomorrow.getDate() + 2);
                //scope.events =
                //    [
                //        {
                //            date: tomorrow,
                //            status: 'full'
                //        },
                //        {
                //            date: afterTomorrow,
                //            status: 'partially'
                //        }
                //    ];
                //
                //scope.getDayClass = function(date, mode) {
                //    if (mode === 'day') {
                //        var dayToCheck = new Date(date).setHours(0,0,0,0);
                //
                //        for (var i=0;i<$scope.events.length;i++){
                //            var currentDay = new Date($scope.events[i].date).setHours(0,0,0,0);
                //
                //            if (dayToCheck === currentDay) {
                //                return $scope.events[i].status;
                //            }
                //        }
                //    }
                //
                //    return '';
                //};

            }

            if (k.type == 'int') {
                k.type = 'number'
            }

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
                generator.get_list(modelscope).then(function (res) {
                    formitem.titleMap = [];
                    angular.forEach(res.data.objects, function (item) {
                        formitem.titleMap.push({
                            "value": item.key,
                            "name": item.data.name ? item.data.name : item.data.username
                        });

                    });

                });
                scope.form[scope.form.indexOf(v)] = formitem;
            }

            if (k.type == 'ListNode') {
                scope.form.splice([scope.form.indexOf(v)], 1);
                scope.listnodes = scope.listnodes ? scope.listnodes : {};
                scope.listnodes[k.title] = (k);
                scope.model[k.title] = {};
            }

            if (k.type == 'Node') {
                scope.form.splice([scope.form.indexOf(v)], 1);
                scope.nodes = scope.nodes ? scope.nodes : {};
                scope.nodes[k.title] = (k);
                scope.model[k.title] = {};
            }
        });

        scope.isCollapsed = true;

        scope.object_id = scope.form_params['object_id'];

        //scope.triggerItem = function(id) {
        //    angular.element($(id));
        //    angular.element($(id)).triggerHandler('click');
        //}

        return generator.group(scope);
    };
    generator.group = function (formObject) {
        return formObject;
    };
    generator.dateformatter = function (formObject) {
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
    generator.generateButtons = function (scope) {
        //scope.buttonplace = angular.element($('#myElement'));
        scope.$watch("form", function(){
            debugger;
        });
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
        // todo: diff for all submits to recognize form change. if no change returns to view with no submit
        data = {
            "form": $scope.model,
            "cmd": $scope.form_params.cmd,
            "subcmd": "do_list",
            "model": $scope.form_params.model,
            "token": $scope.token
        };
        debugger;
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
 * ModalCtrl
 * controller for listnode, node and linkedmodel modal and save data of it
 * @params: $scope, $modalInstance, $route, items
 * @returns: returns value for modal
 */

form_generator.controller('ModalCtrl', function ($scope, $modalInstance, $route, items) {
    angular.forEach(["model", "schema", "form"], function (key) {
        $scope[key] = items[key];
    });
    $scope.onSubmit = function () {
        // send form to modalinstance result function
        $modalInstance.close($scope);
    };
    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
});

/**
 * modal directive for listnodes and nodes
 * @params: $modal, Generator
 * @return: openmodal directive
 */

// todo: use generator.openmodal instead
form_generator.directive('addModalForListNode', function ($modal, Generator) {
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
                            // get node from parent scope catch with attribute
                            var node = angular.copy(scope.$parent.$parent.listnodes[attributes['addModalForListNode']]);
                            var items = {form: ['*'], schema: {properties: {}, title: node.title, type: "object"}, model: {}};
                            angular.forEach(node.fields, function (item) {
                                items.schema.properties[item.name] = item;
                                items.model[item.name] = item.value;
                            });
                            return Generator.generate(scope, items);
                        }
                    }
                });

                modalInstance.result.then(function (childmodel, key) {
                    var subfix = scope.schema.title.replace(/([a-z])([A-Z])/g, '$1_$2').toLowerCase();
                    scope.$parent.model[scope.schema.title][subfix+'.idx'] = scope.model;
                });
            });
        }
    }
});

/**
 * modal directive for linked models
 * @params: $modal, Generator
 * @return: openmodal directive
 */

form_generator.directive('addModal', function ($modal, Generator) {
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
                    Generator.submit(scope);
                });
            });
        }
    }
});