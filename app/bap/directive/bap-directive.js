/**
 * @license Ulakbus-UI
 * Copyright (C) 2015 ZetaOps Inc.
 *
 * This file is licensed under the GNU General Public License v3
 * (GPLv3).  See LICENSE.txt for details.
 */

'use strict';
angular.module('ulakbusBap')

/**
 * @memberof ulakbusBap
 * @ngdoc directive
 * @name leftMenu
 * @description Creates a left sidebar menu for the dashboard
 */
    .directive('leftMenu', function ($route) {
        return {
            templateUrl: '/components/bapComponents/left-menu.html',
            restrict: 'E',
            replace: true,
            scope: {
                menuItems:'='
            },
            controller: function ($scope) {
                $scope.selectedMenu = 0;
                //since the menuItems comes from the API call it is undefined when page load
                $scope.$watch('menuItems', function (newVal, oldVal) {
                    if(angular.isDefined(newVal)){
                        var pathParam =  $route.current.pathParams.wf;
                        for(var i=0; i<newVal.items.length; i++){
                            if(newVal.items[i].wf === pathParam){
                                $scope.selectedMenu = i;
                                break;
                            }
                        }
                    }
                });

                $scope.setActive = function (index) {
                    $scope.selectedMenu = index;
                };
            }
        };
    })
    /**
     * @memberof ulakbusBap
     * @ngdoc directive
     * @name leftMenu
     * @description Creates a left sidebar menu for the dashboard
     */
    .directive('topActionButtons', function () {
        return {
            templateUrl: '/components/bapComponents/top-action-buttons.html',
            restrict: 'E',
            replace: true,
            scope: {
                buttonList:'='
            },
            controller: function ($scope, $location) {
                $scope.setActive = function (index, button) {
                    $scope.selectedButton  = index;
                    $location.path("/"+button.wf);
                };

            }
        };
    })
    /**
     * @memberof ulakbusBap
     * @ngdoc directive
     * @name fileread
     * @description Fileread directive is responsible for reading uploaded file and replace it to related model item.
     */
    .directive("fileread", function ($timeout) {
        return {
            scope: {
                fileread: "="
            },
            link: function (scope, element, attributes) {
                element.bind("change", function (changeEvent) {
                    var reader = new FileReader();
                    reader.onload = function (loadEvent) {
                        scope.$apply(function () {
                            scope.fileread = loadEvent.target.result;
                        });
                        $timeout(function () {
                            //if not an image
                            var isImage = undefined;
                            if(changeEvent.target.files[0].type.indexOf('image') === -1){
                                isImage = false;
                            }else{
                                isImage = true;
                            }
                            scope.$parent.model[changeEvent.target.name] = {
                                file_name: changeEvent.target.files[0].name,
                                file_content: scope.$parent.model[changeEvent.target.name],
                                isImage :isImage
                            };
                            document.querySelector('#image-preview').src = URL.createObjectURL(changeEvent.target.files[0]);
                        });
                    };
                    reader.readAsDataURL(changeEvent.target.files[0]);
                });
            }
        }
    })
    /**
     * @memberof ulakbusBap
     * @ngdoc directive
     * @name alertBox
     * @description Triggers when `alertBox` broadcasted with alert data..
     */
    .directive('alertBox', function ($timeout) {
        return {
            templateUrl: '/shared/templates/directives/alert.html',
            restrict: 'E',
            replace: true,
            link: function ($scope) {
                $scope.$on('alertBox', function ($event, data) {
                    $timeout(function () {
                        delete $scope.alerts;
                    }, 5000);
                    $scope.alerts = [data];
                });
            }
        };
    })

    /**
     * @memberof ulakbusBap
     * @ngdoc directive
     * @name msgbox
     * @description Holds msgbox template with related rootscope items.
     */
    .directive('msgbox', function () {
        return {
            templateUrl: '/shared/templates/directives/msgbox.html',
            restrict: 'E',
            replace: false
        };
    });
