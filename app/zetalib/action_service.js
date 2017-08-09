/**
 * Copyright (C) 2015 ZetaOps Inc.
 *
 * This file is licensed under the GNU General Public License v3
 * (GPLv3).  See LICENSE.txt for details.
 *
 * @author Evren Kutar
 */

angular.module('ulakbus')
    .controller('KeyListenController', function ($scope, action_service) {
        $scope.isPublicAccess = false;
        $scope.keylog = [0,1];
        $scope.down = function(e) {
            angular.forEach(action_service.combinations, function (value, key) {
                if (action_service.equal(value, $scope.keylog.concat([e.keyCode]))) {
                    action_service.acts[key]();
                }
            });
            $scope.keylog.shift();
            $scope.keylog.push(e.keyCode);
        };

        // when user_ready broadcasted then change value of user_ready=true to display view
        $scope.$on('user_ready', function () {
            $scope.$broadcast("hide_main_loader");
        });

        $scope.$on('setPublicWf', function (event,data) {
            $scope.isPublicAccess = data;
        });

        $scope.$on('hide_main_loader', function () {
            $scope.user_ready = true;
        });
        $scope.$on('show_main_loader', function () {
            $scope.user_ready = false;
        });
        $scope.user_ready = false;
    })
    .factory('action_service', function ($uibModal, $log) {
        var actions = {};
        actions.equal = function (a,b) { return !(a<b || b<a); };
        actions.combinations = {
            'open_inspector': [91,16,75] // ctrl + k
        };
        actions.acts = {
            // opens a modal dialog full of menu items with typeahead
            'open_inspector': function () {
                var modalInstance = $uibModal.open({
                    animation: true,
                    templateUrl: 'shared/templates/actionsModalContent.html',
                    controller: 'ActionsModalController',
                    resolve: {
                        items: function () {
                            return document.querySelectorAll('.navbar-collapse a, #side-user-menu a, .dropdown-menu li a');
                        }
                    }
                });

                modalInstance.result.then(function (selectedItem) {
                    $log.info('resirect to:', selectedItem);
                    location.hash = selectedItem.value;
                });
            }
        };
        return actions;
    })
    .controller('ActionsModalController', function ($scope, $uibModalInstance, items) {
        $scope.actions = [];
        angular.forEach(items, function (value, key) {
            if (!value.children[1]) {
                $scope.actions.push({ name: value.innerHTML, value: value.hash});
            }
        });
        $scope.doThis = function (item) {
            $uibModalInstance.close(item);
        };

        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };
    });