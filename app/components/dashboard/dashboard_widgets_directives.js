/**
 * Copyright (C) 2015 ZetaOps Inc.
 *
 * This file is licensed under the GNU General Public License v3
 * (GPLv3).  See LICENSE.txt for details.
 *
 * @author Evren Kutar
 */

/**
 * @memberof ulakbus.dashboard
 * @ngdoc directive
 * @name stats
 * @description Directive for .
 */
angular.module('ulakbus.dashboard')
    .directive('userTasks', function (WSOps) {
        return {
            templateUrl: 'components/dashboard/directives/user-tasks.html',
            restrict: 'E',
            replace: true,
            scope: {},
            controller: function ($scope) {
                $scope.task_list = [
                    {WFToken: "yfuialhfuial", title: "sample 1 workflow", description: "sample 1", wf_type: "type x", date: '02.05.2016'},
                    {WFToken: "yfuialhfuial", title: "sample 2 workflow", description: "sample 2", wf_type: "type x", date: '02.05.2016'},
                    {WFToken: "yfuialhfuial", title: "sample 3 workflow", description: "sample 3", wf_type: "type y", date: '02.05.2016'},
                    {WFToken: "yfuialhfuial", title: "sample 4 workflow", description: "sample 4", wf_type: "type y", date: '02.05.2016'}
                ];
                var regroup_tasks = function () {
                    var grouped_tasks = {};
                    angular.forEach($scope.task_list, function (value, key) {
                        grouped_tasks[value.wf_type] = grouped_tasks[value.wf_type] || [];
                        grouped_tasks[value.wf_type].push(value);
                    });
                    return grouped_tasks;
                };
                $scope.task_list = regroup_tasks();
                $scope.$on("task_list", function (event, data) {
                    $scope.task_list = data;
                    regroup_tasks();
                });
                $scope.gototask = function (wf_token) {
                    WSOps.doSend({view: "open_wf", wf_token: wf_token});
                }
            }
        };
    });