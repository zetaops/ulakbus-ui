/**
 * Created by evren kutar on 12/05/15.
 */

'use strict';

// TODO: clean console log items

angular.module('zaerp.dashboard', ['ngRoute'])

    .config(['$routeProvider', function ($routeProvider) {
        //$routeProvider.when('/dashboard', {
        //    templateUrl: 'dashboard/dashboard.html',
        //    controller: 'DashCtrl'
        //});
    }])
    .controller('DashCtrl', function ($scope) {
        $scope.testData = "<h1>This is main Dashboard</h1>";
    });