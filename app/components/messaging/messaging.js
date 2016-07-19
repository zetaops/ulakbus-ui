angular.module("ulakbus.messaging")

    .directive('messaging', function (Generator, MessagingService, $log, $rootScope) {
        return {
            templateUrl: 'components/messaging/templates/index.html',
            restrict: 'E',
            replace: true,
            scope: {},
            controller: function ($scope) {

                $scope.hidden = false;

                $scope.showSearch = {
                    user: false
                };

                MessagingService.list_channels().then(function (groupedChannels) {
                    $scope.publicChannels = groupedChannels[MessagingService.CHANNEL_TYPE.PUBLIC];
                    $scope.notificationsChannel = groupedChannels[MessagingService.CHANNEL_TYPE.NOTIFICATION][0];
                    $scope.directChannels = groupedChannels[MessagingService.CHANNEL_TYPE.DIRECT];
                });

                this.createDirectChannel = function(user){
                    // user format is ['username', 'key', 'avatarUrl']
                    var key = user[1];
                    MessagingService.create_direct_channel(key)
                        .then(function(result){
                            $log.info("Channel for user ", user[0], "created: ", result);
                        });
                };

                $scope.hideApp = function(){
                    $scope.hidden = true;
                };

                $scope.selectChannel = function(channel){
                    $scope.activeChannel = channel;
                }

            }
        };
    })
