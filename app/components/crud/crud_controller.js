/**
 * Copyright (C) 2015 ZetaOps Inc.
 *
 * This file is licensed under the GNU General Public License v3
 * (GPLv3).  See LICENSE.txt for details.
 */

'use strict';


var crud = angular.module('ulakbus.crud', ['ngRoute', 'schemaForm', 'formService', 'ui.bootstrap']);


/**
 * CRUDAddEditCtrl is a controller
 * which provide a form with form generator.
 */

crud.controller('CRUDAddEditCtrl', function ($scope, $rootScope, $location, $http, $log, $modal, $timeout, Generator, $routeParams) {
    $scope.url = 'crud';
    $scope.form_params = {'model': $routeParams.model};
    if ($routeParams.id) {
        $scope.form_params['object_id'] = $routeParams.id;
        $scope.form_params['cmd'] = 'edit';
    }
    else {
        $scope.form_params['cmd'] = 'add';
    }

    $scope.today = function() {
        $scope.dt = new Date();
    };
    $scope.today();

    $scope.clear = function () {
        $scope.dt = null;
    };

    // Disable weekend selection
    $scope.disabled = function(date, mode) {
        return ( mode === 'day' && ( date.getDay() === 0 || date.getDay() === 6 ) );
    };

    $scope.toggleMin = function() {
        $scope.minDate = $scope.minDate ? null : new Date();
    };
    $scope.toggleMin();
    $scope.maxDate = new Date(2020, 5, 22);

    $scope.open = function() {
        debugger;
        $scope.status.opened = true;
    };

    $scope.dateOptions = {
        formatYear: 'yy',
        startingDay: 1,
        initDate: new Date('01-01-1900')
    };

    $scope.format = 'dd.MM.yyyy';

    $scope.status = {
        opened: false
    };

    var tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    var afterTomorrow = new Date();
    afterTomorrow.setDate(tomorrow.getDate() + 2);
    $scope.events =
        [
            {
                date: tomorrow,
                status: 'full'
            },
            {
                date: afterTomorrow,
                status: 'partially'
            }
        ];

    $scope.getDayClass = function(date, mode) {
        if (mode === 'day') {
            var dayToCheck = new Date(date).setHours(0,0,0,0);

            for (var i=0;i<$scope.events.length;i++){
                var currentDay = new Date($scope.events[i].date).setHours(0,0,0,0);

                if (dayToCheck === currentDay) {
                    return $scope.events[i].status;
                }
            }
        }

        return '';
    };

    // get form with generator
    $scope.loaddata = function() {
        Generator.get_form($scope);
    };

    // todo remove timeout to load controller efficiently
    //$timeout($scope.loaddata, 1000);
    $scope.loaddata();
    $scope.onSubmit = function (form) {
        $scope.$broadcast('schemaFormValidate');
        if (form.$valid) {
            Generator.submit($scope)
                .success(function(data){
                    $location.path("/crud");
                })
                .error(function(data){
                    $scope.message = data.title;
                });
        }
    };

    console.log($scope);
});

/**
 * CRUD List Controller
 */

crud.controller('CRUDListCtrl', function ($scope, $rootScope, Generator, $routeParams) {
    $scope.url = 'crud';
    $scope.form_params = {"model": $routeParams.model};
    // call generator's get_list func
    Generator.get_list($scope)
        .then(function (res) {
            var data =  res.data.objects;
            for (var item in data){
                delete data[item].data['deleted'];
                delete data[item].data['timestamp'];
            }
            $scope.objects = data;
            $scope.model = $routeParams.model;
        });
});

/**
 * CRUD Show Controller
 */
crud.controller('CRUDShowCtrl', function ($scope, $rootScope, Generator, $routeParams) {
    $scope.url = 'crud';
    $scope.form_params = {"object_id": $routeParams.id, "cmd": "show", "model": $routeParams.model};
    // call generator's get_single_itemfunc
    Generator.get_single_item($scope).then(function (res) {
        $scope.object = res.data.object;
        $scope.model = $routeParams.model;
    })
});