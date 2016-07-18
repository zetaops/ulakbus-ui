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

                this.startDirectChannel = function(){

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
