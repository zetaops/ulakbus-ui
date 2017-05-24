/**
 * @license Ulakbus-UI
 * Copyright (C) 2015 ZetaOps Inc.
 *
 * This file is licensed under the GNU General Public License v3
 * (GPLv3).  See LICENSE.txt for details.
 */

angular.module('ulakbus.gantt', [
    'gantt',
    'gantt.tooltips',
    'gantt.bounds',
    'gantt.tree',
    'gantt.groups',
    'gantt.overlap'
]);

angular.module('ulakbus.gantt')
.directive('zetaGanttChart', function() {
    return {
        templateUrl: 'components/zetaGanttChart/zeta-gantt-chart.html',
        restrict: 'E',
        scope:{
            ganttChartData: '='
        },
        link: function ($scope) {
            $scope.showGanttChart = false;
            //show chart only if chart data is present
            if($scope.ganttChartData.data.length>0){
                $scope.showGanttChart = true;
            }
            $scope.options = $scope.ganttChartData.options;

            $scope.data = $scope.ganttChartData.data;
        }
    };
});