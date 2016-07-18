angular.module("ulakbus.messaging")

    .directive("messagingSearchUser", function(MessagingService, $log){
        return {
            templateUrl: "components/messaging/templates/search_user.html",
            restrict: 'E',
            replace: true,
            require: "^messaging",
            scope: {
                'showSearch': '=ngShow'
            },
            link: function(iScope, iElem, iAttrs, messagingCtrl){
                iScope.selectUser = function(user){
                    messagingCtrl.startDirectChannel(user);
                    iScope.hide();
                }
            },
            controller: function($scope){
                $scope.searchResult = [];
                $scope.hide = function(){
                    $scope.showSearch = false;
                    $scope.searchResult = [];
                }

                function search(query){
                    $scope.loading = true;
                    $scope.searchResult = [];
                    MessagingService.search_user(query)
                        .then(function(users){
                            $scope.searchResult = users;
                        })
                        .finally(function(){
                            $scope.loading = false;
                        })
                }

                $scope.onChange = function(query){
                    search(query);
                };

            }
        }
    })
