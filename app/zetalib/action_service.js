/**
 * Copyright (C) 2015 ZetaOps Inc.
 *
 * This file is licensed under the GNU General Public License v3
 * (GPLv3).  See LICENSE.txt for details.
 *
 * @author Evren Kutar
 */

angular.module('ulakbus')
    .controller('keyListen', function ($scope, action_service) {
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
                    controller: 'ActionsModalCtrl',
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
    .controller('ActionsModalCtrl', function ($scope, $uibModalInstance, items) {
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