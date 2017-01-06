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
    .service('TasksService', function (WSOps) {
        return {
            get_tasks : get_tasks,
            get_task_types : get_task_types,
            get_task_actions : get_task_actions,
            get_task_detail : get_task_detail
        };

        function get_tasks(options) {
            /**
             * only required fields must be send
             */

            options = angular.extend({
                state: 'active',
                inverted: false,
                query: false,
                wf_type: false,
                start_date: false,
                finish_date: false
            }, options);

            var outgoing = {
                view: '_zops_get_tasks'
            };
            angular.forEach(options, function (value, key) {
                value && (outgoing[key] = value);
            });
            // state         //string,    # "active", "future", "finished", "expired"
            // inverted      // boolean,  # search on other people's tasks
            // query         // string,   # optional. for searching on user's tasks
            // wf_type       // string,   # optional. only show tasks of selected wf_type
            // start_date    // datetime, # optional. only show tasks starts after this date
            // finish_date   // datetime, # optional. only show tasks should end before this date

            return WSOps.request(outgoing).then(function (data) {
                return data;
            });

        }

        function get_task_types() {
            var outgoing = {
                'view': '_zops_get_task_types'
            };
            return WSOps.request(outgoing).then(function (data) {
                return data.task_types;
            });
        }

        function get_task_actions(key) {
            var outgoing = {
                view: '_zops_get_task_actions',
                key: key
            };

            return WSOps.request(outgoing).then(function (data) {
                return data.actions
            });
        }

        function get_task_detail(key) {
            var outgoing = {
                view: '_zops_get_task_detail',
                key: key
            };

            return WSOps.request(outgoing);
        }
    })
    .directive('userTasks', function (TasksService) {
        return {
            templateUrl: 'components/dashboard/directives/user-tasks.html',
            restrict: 'E',
            replace: true,
            scope: {},
            link: function (iScope, iElem, iAttrs) {
                /**
                 * initialisation of task manager
                 * getting default values and setting data
                 */
                TasksService
                    .get_task_types()
                    .then(function (types) {
                        var defaultType = {
                            name: '',
                            title: 'Bütün Türler'
                        };
                        types.unshift(defaultType);
                        iScope.taskTypes = types;
                        iScope.taskType = '';
                    });

                TasksService.get_tasks()
                    .then(function (data) {
                        iScope.$broadcast("task_list", data)
                    });

                iScope.taskTimes= [
                    {
                        name: "",
                        title: "Tüm Zamanlar"
                    }, {
                        name: "1",
                        title: "Son 1 Gün"
                    }, {
                        name: "7",
                        title: "Son 1 Hafta"
                    }, {
                        name: "30",
                        title: "Son 1 Ay"
                    }
                ];
                iScope.taskTime = "";
            },
            controller: function ($scope, TasksService,Utils) {
                /**
                 * default values
                 * */
                $scope.activeTab = "active";

                $scope.task_list = {
                    current: {isEmpty:true,data:{}},
                    future: {isEmpty:true,data:{}},
                    finished: {isEmpty:true,data:{}},
                    expired: {isEmpty:true,data:{}}
                };
                $scope.task_counts = [];
                
                /**
                 * general function for getting task_list
                 */
                $scope.$on("task_list", function (event, data) {
                    angular.forEach(data.task_list, function (val, i) {
                        var taskClass;
                        switch (val.state){
                            case 10:
                                taskClass = "future";
                                break;
                            case 20:
                            case 30:
                                taskClass = "current";
                                break;
                            case 40:
                                taskClass = "finished";
                                break;
                            case 90:
                                taskClass = "expired";
                                break;
                            default:
                                taskClass = null;
                                break;
                        }
                        $scope.task_list[taskClass].isEmpty = false;
                        $scope.task_list[taskClass].data[val.key] = val;
                    });
                    $scope.task_count = data.task_count;
                });
                /**
                 * event for tab change
                 */
                $scope.tab = function (state) {
                    resetQueries();
                    $scope.activeTab = state;
                    var options = {
                        state: state
                    };
                    TasksService.get_tasks(options)
                        .then(function (data) {
                            $scope.$broadcast("task_list", data)
                        })
                };
                /**
                 * event for wf_type change
                 */
                $scope.taskTypeChange = function () {
                    var options = getQueries();
                    TasksService.get_tasks(options)
                        .then(function (data) {
                            $scope.$broadcast("task_list", data);
                        });
                };

                /**
                 * event for time range change
                 */
                $scope.taskTimeChange = function () {
                    $scope.finish_date = "";
                    if ($scope.taskTime !=="") {
                        var date = new Date();
                        $scope.finish_date = Utils.formatDate(new Date(date.setTime( date.getTime() + $scope.taskTime * 86400000 )));
                    }
                    options = getQueries();
                    TasksService.get_tasks(options)
                        .then(function (data) {
                            $scope.$broadcast("task_list", data);
                        });
                };

                /**
                 * event for search query change
                 * filters task
                 */
                $scope.taskSearch = function () {
                    var query = $scope.taskManagerSearchQuery;
                    var options = {
                        state: $scope.activeTab,
                    };
                    switch (query.length) {
                        case 1:
                        case 2:
                            return;
                        case 0:
                            break;
                        default:
                            options.query = query;
                    }
                    TasksService.get_tasks(options)
                        .then(function (data) {
                            $scope.$broadcast("task_list", data);
                        });
                };

                /**
                 * @description reset filter from sccope
                 */
                function resetQueries() {
                    $scope.taskManagerSearchQuery = "";
                    //$scope.taskManagerSearchAll = false;
                    $scope.taskTime = "";
                    $scope.taskType = "";
                }

                /**
                 * @name getQueries
                 * @description returnes valid task filters
                 * @returns {Object} options
                 */
                function getQueries(){
                    var options = {};
                    options.state = $scope.activeTab;
                    $scope.taskManagerSearchQuery !== "" && (options.query = $scope.taskManagerSearchQuery);
                    //$scope.taskManagerSearchAll !== false && (options = $scope.taskManagerSearchAll);
                    $scope.finish_date !== "" && (options.finish_date = $scope.finish_date);
                    $scope.taskType !== "" && (options.wf_type = $scope.taskType);
                    return options;
                }
            }
        };
    })
    .directive('singleTask', function (TasksService, Utils ) {
        return {
            templateUrl: 'components/dashboard/directives/single-task.html',
            restrict: 'E',
            replace: true,
            scope: {
                key: '@key'
            },
            link: function ($scope, element, attrs, controllers) {
                $scope.task = $scope.$parent.value;
                /**
                 * setting $scope values for UI
                 */
                switch ($scope.task.state) {
                    case 90:
                        $scope.task_class = "expired-task";
                        $scope.task_tooltip = "Geçersiz";
                        break;
                    case 40:
                        $scope.task_class = "finished-task";
                        $scope.task_tooltip = "Tamamlanan";
                        break;
                    default:
                        /**
                         * If task is not finished or expired, we calculate remaining time to task finishtime.
                         * With this information we show urgency of the task
                         */
                        var date = new Date($scope.task.finish_date);
                        var now = new Date();
                        var diff = Math.floor((date - now) / 1000 / 60 / 60 / 24);
                        if (diff < 1) {
                            $scope.task_class = "urgent-task";
                            $scope.task_tooltip = "Acil";
                        } else if (diff < 3) {
                            $scope.task_class = "approaching-task";
                            $scope.task_tooltip = "Yaklaşan";
                        } else {
                            $scope.task_class = "non-urgent-task";
                            $scope.task_tooltip = "Acil Olmayan";
                        }
                };
                /**
                 * Formated date for task view
                 */
                $scope.task_date = $scope.task.start_date + ' - ' + $scope.task.finish_date;

                /* TasksService.get_task_detail($scope.task.key).then(function(data){
                    $scope.task_detail = data;
                });*/

                $scope.actions = {};
                $scope.getActions = function() {
                    if (Object.keys($scope.actions).length > 0) return;
                    TasksService.get_task_actions($scope.task.key).then(function (data) {
                        $scope.actions = data.map(function(el){
                            el.link = "#/"+el.wf+"/?task_inv_id="+$scope.task.key;
                            return el;
                        });

                    });
                };
                $scope.link = "#/"+$scope.task.wf_type
            }
        }
    })
    .directive('emptyTask', function (TasksService, Utils) {
        /**
         * if no task exist in task status group, no task message shown.
         */
        return {
            templateUrl: 'components/dashboard/directives/empty-task.html',
            restrict: 'E',
            replace: true,
            scope: {
                taskType: '@tasktype'
            }
        }
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
    });;