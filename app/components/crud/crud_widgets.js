/**
 * Copyright (C) 2015 ZetaOps Inc.
 *
 * This file is licensed under the GNU General Public License v3
 * (GPLv3).  See LICENSE.txt for details.
 *
 * @author Evren Kutar
 */

angular.module('ulakbus.crud')
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
                            model: $scope.node.quick_add_model,
                            wf: 'crud',
                            query: kw,
                            cmd: 'object_search'
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