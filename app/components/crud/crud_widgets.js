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
            templateUrl: '/components/crud/templates/quick_add.html',
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