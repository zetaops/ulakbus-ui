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
                $scope.link = "#cwf/"+$scope.task.wf_type+"/"+$scope.task.token
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
    })
    .directive('dashboardTables', function() {
        return {
            templateUrl: 'components/dashboard/directives/dashboard-tables.html',
            restrict: 'E',
            replace: true
        }
    })
    .directive('zetaGrid', function(WSOps, uiGridConstants, $timeout, $q, $rootScope) {
        return {
            templateUrl: 'components/dashboard/directives/zeta-grid.html',
            restrict: 'E',
            scope:{
                gridOptionsProvided : '=',
                token:'=',
                wf:'='
            },
            link: function ($scope) {
                //set page size 1 initially
                $scope.page = 1;
                //this array holds all the filter column values
                $scope.filterColumn =[];
                //this array holds all the sorting columns
                $scope.sortColumns = [];
                //this array holds the actual data records from the backend
                $scope.data = [];
                //initially column selector is not shown
                $scope.showColumnSelector = false;
                //indicated if it is used inside workflow or not
                $scope.useInWf = false;
                //basic configuration of ui grid
                $scope.gridOptions = {
                    useExternalSorting: true,
                    useExternalFiltering: true,
                    infiniteScrollRowsFromEnd: 50,
                    infiniteScrollUp: true,
                    infiniteScrollDown: true,
                    data: 'data',
                    enableColumnMenus:false,
                    onRegisterApi: function(gridApi){
                        gridApi.infiniteScroll.on.needLoadMoreData($scope, $scope.getDataDown);

                        gridApi.core.on.sortChanged( $scope, function( grid, sortColumns ) {
                            $scope.sortColumns =[];
                            angular.forEach(sortColumns, function(v,k) {
                                var sortObj ={
                                    'columnName': sortColumns[k].field,
                                    'order': sortColumns[k].sort.direction
                                };
                                $scope.sortColumns.push(sortObj);
                            });
                            $scope.getChangedData();
                        });

                        gridApi.core.on.filterChanged($scope, function() {
                            $scope.gridReference = this.grid;
                        });
                        $scope.gridApi = gridApi;
                    }
                };
                //this function is called when the data is called from backend during page load
                $scope.getFirstData = function(selectors) {
                    var promise = $q.defer();
                    WSOps.request(getRequestObject(selectors)).then(function(response){
                        handleResponseData(response);
                        promise.resolve();
                    });
                    return promise.promise;
                };
                //this function is called when the user scrolls down the grid and there are 50 records left at the end
                $scope.getDataDown = function() {
                    //if no more data left in backend to display then return from here
                    if(!$scope.isMoreDataLeft){
                        return;
                    }
                    //show data loading
                    $scope.loadingChannel = true;
                    //increase pages that are visible to user
                    $scope.page+=1;
                    WSOps.request(getRequestObject()).then(function(response){
                        $scope.gridOptionsSelected = response.gridOptions;
                        var newData = response.gridOptions.data;
                        $scope.gridApi.infiniteScroll.saveScrollPercentage();
                        $scope.data = $scope.data.concat(newData);
                        $scope.isMoreDataLeft = response.gridOptions.isMoreDataLeft;
                        $scope.gridApi.infiniteScroll.dataLoaded();
                        $scope.loadingChannel = false;
                    }).catch(function(error) {
                        $scope.gridApi.infiniteScroll.dataLoaded();
                        $scope.loadingChannel = false;
                    });
                };
                //this function is called when the data is called from backend during page load
                $scope.getFirstTimeData = function(selectors) {
                    //show loader
                    $rootScope.$broadcast("show_main_loader");
                    $scope.getFirstData(selectors).then(function(){
                        //increase the visible page count so that it can be sent to the server
                        handleGridData();
                        $timeout(function() {
                            $scope.gridApi.infiniteScroll.resetScroll();
                        });
                        $rootScope.$broadcast("hide_main_loader");
                    });
                }
                //this function is called when the grid require filter and sorting
                $scope.getChangedData = function (type) {
                    //show loading data
                    $scope.loadingChannel = true;
                    var requestObj = getRequestObject();
                    if(angular.isDefined(type) && type === 'filter'){ //for filter change page size to 1
                        //reset page count when filter is applied
                        $scope.page =1;
                        if($scope.useInWf){
                            requestObj.form.page = 1;
                        }else{
                            requestObj.page = 1;
                        }

                    }
                    WSOps.request(requestObj).then(function(response){
                        //empty previous data to assign new sorted data set obtained from server
                        $scope.data = [];
                        $scope.gridOptionsSelected = response.gridOptions;
                        $scope.gridApi.infiniteScroll.saveScrollPercentage();
                        //sorted data obtained from the server
                        $scope.data = response.gridOptions.data;
                        $scope.isMoreDataLeft = response.gridOptions.isMoreDataLeft;
                        $scope.gridApi.infiniteScroll.dataLoaded();
                        $scope.loadingChannel = false;
                    }).catch(function(error) {
                        $scope.gridApi.infiniteScroll.dataLoaded();
                        $scope.loadingChannel = false;
                    });
                };
                //assigns response data to useful variables
                function handleResponseData(response) {
                    $scope.gridOptionsSelected = response.gridOptions;
                    $scope.data = response.gridOptions.data;
                    //add texts for buttons as given by backend
                    $scope.applyFilterText = response.gridOptions.applyFilter;
                    $scope.pageTitleText = response.gridOptions.pageTitle;
                    $scope.cancelFilterText = response.gridOptions.cancelFilter;
                    $scope.csvDownloadText = response.gridOptions.csvDownload;
                    $scope.dataLoadingText = response.gridOptions.dataLoading;
                    $scope.selectColumnsText = response.gridOptions.selectColumns;
                    $scope.isMoreDataLeft = response.gridOptions.isMoreDataLeft;
                }
                //this function adds more grid configurations when the data is received from backend
                function handleGridData() {
                    $scope.grid = $scope.gridOptionsSelected;
                    $scope.gridOptions.enableSorting = $scope.gridOptionsSelected.enableSorting;
                    $scope.gridOptions.enableFiltering = $scope.gridOptionsSelected.enableFiltering;
                    $scope.gridOptions.totalItems = $scope.gridOptionsSelected.totalItems;
                    $scope.gridOptions.enableHorizontalScrollbar = uiGridConstants.scrollbars.ALWAYS;

                    var checkedSelectors = $scope.grid.selectors.filter(function(item) {
                        return item.checked;
                    });

                    var columnDefs = $scope.grid.column_defs.filter(function(item) {
                        var b = false;
                        for (var i = 0; i < checkedSelectors.length; i++ ) {
                            if (checkedSelectors[i].name === item.field) {
                                b = true;
                            }
                        }
                        return b;
                    });

                    $scope.gridOptions.columnDefs = columnDefs.map(function(item) {
                        var type = item.type;
                        var field;

                        switch (type) {
                            case 'INPUT':
                                field = {
                                    field: item.field,
                                    minWidth: 130,
                                    enableHiding : false,
                                    type: uiGridConstants.filter.INPUT,
                                    filter: {
                                        condition: uiGridConstants.filter[item.filter.condition],
                                        placeholder: item.filter.placeholder
                                    },
                                    colType: item.type
                                };
                                break;
                            case 'SELECT':
                                field = {
                                    field: item.field,
                                    minWidth: 130,
                                    enableHiding : false,
                                    filter: {
                                        type: uiGridConstants.filter.SELECT,
                                        term: item.filter.term,
                                        selectOptions: item.filter.selectOptions,
                                        condition: uiGridConstants.filter.EXACT
                                    },
                                    colType: item.type
                                };
                                break;
                            case 'MULTISELECT':
                                field = {
                                    field: item.field,
                                    minWidth: 130,
                                    enableHiding : false,
                                    filterHeaderTemplate: '<div class="ui-grid-filter-container" ng-repeat="colFilter in col.filters"><div multi-dropdown></div></div>',
                                    filter: {
                                        options: item.filter.selectOptions,
                                        condition: uiGridConstants.filter.EXACT
                                    },
                                    colType: item.type
                                };
                                break;
                            case 'range':
                                if(item.rangeType=='datetime'){
                                    field = {
                                        field: item.field,
                                        minWidth: 130,
                                        enableHiding : false,
                                        filterHeaderTemplate: '<div class="ui-grid-filter-container" ng-repeat="colFilter in col.filters">' +
                                        '<date-filter ng-model="colFilter.term" place-holder="colFilter.placeholder"></date-filter>' +
                                        '</div>',
                                        filters: [
                                            {
                                                condition: uiGridConstants.filter.GREATER_THAN,
                                                placeholder: item.filters[0].placeholder
                                            },
                                            {
                                                condition: uiGridConstants.filter.LESS_THAN,
                                                placeholder: item.filters[1].placeholder
                                            }
                                        ],
                                        colType : item.rangeType
                                    };
                                }else{
                                    field = {
                                        field: item.field,
                                        minWidth: 130,
                                        enableHiding : false,
                                        filters: [
                                            {
                                                condition: uiGridConstants.filter.LESS_THAN,
                                                placeholder: item.filters[0].placeholder
                                            },
                                            {
                                                condition: uiGridConstants.filter.GREATER_THAN,
                                                placeholder: item.filters[1].placeholder
                                            }
                                        ],
                                        colType : item.rangeType
                                    };
                                }

                                break;
                            default:
                                field = {};
                        }

                        return field;
                    });
                }
                //this is a helper function that will be called to get the request object
                function getRequestObject(selector) {
                    var reqObj;

                    if(!$scope.useInWf){
                        reqObj = {
                            'page': $scope.page,
                            'sortColumns': $scope.sortColumns,
                            'filterColumns': $scope.filterColumn,
                            'view': '_zops_get_report_data'
                        };
                        if(angular.isDefined(selector)){
                            reqObj.selectors = angular.copy(selector); //doing copy will remove hashKey
                        }
                    }else{
                        reqObj = {
                            form:{
                                'page': $scope.page,
                                'sortColumns': $scope.sortColumns,
                                'filterColumns': $scope.filterColumn
                            },
                            wf: $scope.wf,
                            token: $scope.token
                        };
                        if(angular.isDefined(selector)){
                            reqObj.form.selectors = angular.copy(selector); //doing copy will remove hashKey
                        }
                    }

                    return reqObj;
                }
                //function to call backend for add/remove columns
                $scope.submitSelectors = function() {
                    $scope.showColumnSelector = false;
                    var selectors = $scope.grid.selectors; //add for request
                    //empty the grid data to get new data with the new columns
                    $scope.data = [];
                    $scope.getFirstTimeData(selectors);
                };
                //function that will be called when user clicks on Apply filter
                $scope.applyFilter = function () {
                    if(angular.isUndefined($scope.gridReference)){
                        return;
                    }
                    var columns = $scope.gridReference.columns;
                    $scope.filterColumn = [];
                    angular.forEach(columns, function (value, key) {
                        var filters = columns[key].filters;
                        var filterObj={};
                        filterObj.columnName = columns[key].field; //name of column
                        filterObj.columnType = columns[key].colDef.colType; //type of the column (select, multiselect, range, input)

                        filterObj.filterParam=[];
                        for( var i=0;i<filters.length;i++ ){
                            if(angular.isDefined(filters[i].term) && filters[i].term !== null &&  filters[i].term !== ""){  //filter contain some value
                                if( filterObj.columnType === 'datetime' ){  //change date format to dd.mm.yyyy
                                    filterObj.filterParam.push({
                                        condition: filters[i].condition,
                                        value : changeDateFormat(filters[i].term)
                                    });
                                }else{
                                    filterObj.filterParam.push({
                                        condition: filters[i].condition,
                                        value: filters[i].term
                                    });
                                }
                            }
                        }
                        $scope.filterColumn.push(filterObj);
                    });
                    $scope.getChangedData('filter');
                };
                //this is a helper function that will change the format of the date to dd.mm.YYYY
                function changeDateFormat(dateStr) {
                    return moment(dateStr).format('DD.MM.YYYY');
                }
                //this function is used to download csv from the csv link received from backend
                $scope.downloadCsv = function(){
                    $scope.loadingChannel = true;
                    var requestObj = getRequestObject();
                    if($scope.useInWf){
                        requestObj.cmd = 'csv';
                    }else{
                        requestObj.view = '_zops_get_csv_data';
                    }

                    WSOps.request(requestObj).then(function(response){
                        $scope.loadingChannel = false;
                        window.open(response.download_url, '_blank');
                    });
                };
                //this will clear all the filters of ui grid
                $scope.clearFilter = function () {
                    if(angular.isUndefined($scope.gridReference)){
                        return;
                    }
                    var columns = $scope.gridReference.columns;
                    var isEmptyFilter = true;
                    angular.forEach(columns, function (value, key) {
                        var filters = columns[key].filters;
                        for( var i=0;i<filters.length;i++ ){
                            if(angular.isDefined(filters[i].term) && filters[i].term !== null  && filters[i].term !== ""){  //filter contain some value
                                isEmptyFilter = false;
                                filters[i].term='';
                            }
                        }
                    });
                    if(!isEmptyFilter){
                        $scope.applyFilter();
                    }

                };
                //this will show hide column selectors
                $scope.toggleColumnSelector = function () {
                    $scope.showColumnSelector = !$scope.showColumnSelector;
                    $scope.gridApi.infiniteScroll.resetScroll();
                };
                //initial call to backend
                if(angular.isUndefined($scope.gridOptionsProvided)){  //for direct use
                    $scope.getFirstTimeData();
                }else{  //inside wf
                    $rootScope.$broadcast("show_main_loader");
                    $scope.useInWf = true;
                    var obj = {
                        "gridOptions" : $scope.gridOptionsProvided
                    };

                    handleResponseData(obj);
                    //increase the visible page count so that it can be sent to the server
                    handleGridData();
                    $timeout(function() {
                        $scope.gridApi.infiniteScroll.resetScroll();
                    });
                    $rootScope.$broadcast("hide_main_loader");
                }
            }
        };
    })
    .directive('multiDropdown', function() {
        return {
            template: '<select class="form-control multiselect-grid-option" ng-model="colFilter.term" ng-options="option.value as option.label for option in colFilter.options" multiple style="width: 100%;"></select>'
        };
    })
    .directive('dateFilter', function() {
        return {
            restrict: "E",
            scope: {
                placeHolder:'=',
                ngModel :'='
            },
           // template: '<input placeholder="{{ placeHolder }}" ng-model="ngModel" ng-focus="onFocus($event)" ng-blur="onBlur($event)" style="width: 100%;"/>',

            template: ' <input placeholder="{{ placeHolder }}" type="text" uib-datepicker-popup="{{format}}" style="width:75%;" ng-model="ngModel" is-open="status.opened" min-date="minDate" '+
            'datepicker-options="dateOptions" readonly close-text="Kapat" current-text="Bugün" clear-text="Temizle" datepicker-append-to-body="true"/>'+
            '<button style="width:25%;" type="button" class="btn btn-default" ng-click="open($event)"><i class="glyphicon glyphicon-calendar"></i></button>',
            controller: function ($scope) {

                $scope.clear = function () {
                    $scope.ngModel = null;
                };

                $scope.open = function($event) {
                    $scope.status.opened = true;
                };

                $scope.dateOptions = {
                    formatYear: 'yy',
                    startingDay: 1
                };

                $scope.format = 'dd.MM.yyyy';

                $scope.status = {
                    opened: false
                };
            }
        }
    });
