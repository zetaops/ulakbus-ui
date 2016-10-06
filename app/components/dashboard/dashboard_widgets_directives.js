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
    .service('TasksService', function (Utils) {

        this.get_tasks = function (options) {
            options = $.extend({
                state: 'active',
                inverted: false,
                query: '',
                wf_type: '',
                start_date: '',
                finish_date: ''
            }, options);
            var outgoing = {
                view: '_zops_get_tasks',
                state: options.state,            // string,   # "active", "future", "finished", "expired"
                inverted: options.inverted,      // boolean,  # search on other people's tasks
                query: options.query,            // string,   # optional. for searching on user's tasks
                wf_type: options.wf_type,        // string,   # optional. only show tasks of selected wf_type
                start_date: options.start_date,  // datetime, # optional. only show tasks starts after this date
                finish_date: options.finish_date // datetime, # optional. only show tasks should end before this date
            };
            return Utils.wsRequest(outgoing).then(function (data) {
                return data.task_list;
            });
        };

        this.get_task_types = function () {
            var outgoing = {
                'view': '_zops_get_task_types'
            };
            return Utils.wsRequest(outgoing).then(function (data) {
                return data.task_types;
            });
        };

        this.get_task_actions = function (key) {
            var outgoing = {
                view: '_zops_get_task_actions',
                key: key
            };

            return Utils.wsRequest(outgoing).then(function (data) {
                return data.actions
            });
        };

        this.get_task_detail = function (key) {
            var outgoing = {
                view: '_zops_get_task_detail',
                key: key
            };

            return Utils.wsRequest(outgoing);
        }

    })
    .directive('userTasks', function (TasksService) {
        return {
            templateUrl: 'components/dashboard/directives/user-tasks.html',
            restrict: 'E',
            replace: true,
            scope: {},
            link: function(iScope, iElem, iAttrs){
                TasksService.get_task_types().then(function(types){
                    var defaultType = {
                        name: '',
                        title: 'Bütün Türler'
                    };
                    types.unshift(defaultType);
                    iScope.taskTypes = types;
                    iScope.taskType = '';
                });
            },
            controller: function ($scope) {

                // todo: below are for test, will be removed
                $scope.task_list = [
                    {
                        WFToken: "yfuialhfuial",
                        title: "sample 1 workflow",
                        description: "sample 1",
                        wf_type: "type x",
                        date: '02.05.2016'
                    },
                    {
                        WFToken: "yfuialhfuial",
                        title: "sample 2 workflow",
                        description: "sample 2",
                        wf_type: "type x",
                        date: '02.05.2016'
                    },
                    {
                        WFToken: "yfuialhfuial",
                        title: "sample 3 workflow",
                        description: "sample 3",
                        wf_type: "type y",
                        date: '02.05.2016'
                    },
                    {
                        WFToken: "yfuialhfuial",
                        title: "sample 4 workflow",
                        description: "sample 4",
                        wf_type: "type y",
                        date: '02.05.2016'
                    }
                ];
                /**
                 * tasks need to be regrouped by wf_type
                 * @returns {{}}
                 */
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
                    $scope.task_list = regroup_tasks(data);
                });

                /**
                 * this will send the websocket that we need to go certain workflow
                 * and websocket will send the wf data with cmd in it
                 * @param wf_token
                 */
                $scope.gototask = function (wf_token) {
                    WSOps.doSend({view: "open_wf", wf_token: wf_token});
                }
            }
        };
    })
    .directive('academicCalendar', function () {
        return {
            templateUrl: 'components/dashboard/directives/academic-calendar.html',
            restrict: 'E',
            replace: true,
            scope: {},
            controller: function ($scope) {

            }
        };
    });
;
