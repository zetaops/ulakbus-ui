angular.module("ulakbus.messaging")

    .directive('messaging', function (Generator, MessagingService, $log, $rootScope, MessagingPopup) {

        function getKey (channel) {
            var channelKey = channel.channel_key;
            if (channel.hasOwnProperty('key')){
                channelKey = channel.key; // direct channel
            }
            return channelKey;
        }

        function searchWrapper(scope, promiseWrapper){
            scope.loading = true;
            scope.searchResult = [];
            promiseWrapper()
                .then(function(result){
                    scope.searchResult = result;
                })
                .finally(function(){
                    scope.loading = false;
                })
        }

        return {
            templateUrl: 'components/messaging/templates/index.html',
            restrict: 'E',
            replace: true,
            scope: {},
            link: function(iScope, iElem, iAttrs){
                var popupRootElement = $(iElem).find('.popup-placeholder');

                iScope.deleteConfirmation = function(){
                    return MessagingPopup.show({
                        templateUrl: "components/messaging/templates/delete_confirmation.html",
                        rootElement: popupRootElement
                    })
                };

                iScope.searchUser = function(){
                    MessagingPopup.show({
                        templateUrl: "components/messaging/templates/search_user.html",
                        rootElement: popupRootElement,
                        link: function(scope){
                            scope.onChange = function(query){
                                searchWrapper(scope, function(){
                                    return MessagingService.search_user(query);
                                })
                            };
                            scope.onChange("");
                        }
                    }).then(function(user){
                        return iScope.createDirectChannel(user);
                    });
                };

                iScope.createChannel = function(){
                    MessagingPopup.show({
                        templateUrl: "components/messaging/templates/create_channel.html",
                        rootElement: popupRootElement,
                        link: function(scope){
                            scope.channel = {};
                        }
                    }).then(function(channel){
                        return MessagingService.create_channel(channel.name, channel.description||"");
                    });
                };

                iScope.addUserToChannel = function(channel){
                    MessagingPopup.show({
                        templateUrl: "components/messaging/templates/add_user_unit.html",
                        rootElement: popupRootElement,
                        link: function(scope){
                            scope.title = "Add User";
                            scope.placeholder = "Search User to Add";
                            scope.onChange = function(query){
                                searchWrapper(scope, function(){
                                    return MessagingService.search_user(query);
                                })
                            };
                            scope.onChange("");
                        }
                    }).then(function(userKey){
                        return MessagingService.add_members([userKey]);
                    });
                };

                iScope.addUnitToChannel = function(){
                    MessagingPopup.show({
                        templateUrl: "components/messaging/templates/add_user_unit.html",
                        rootElement: popupRootElement,
                        link: function(scope){
                            scope.title = "Add Unit";
                            scope.placeholder = "Search Unit to Add";
                            scope.onChange = function(query){
                                searchWrapper(scope, function(){
                                    return MessagingService.search_unit(query);
                                })
                            };
                            scope.onChange("");
                        }
                    }).then(function(unitKey){
                        var channelKey = getKey(iScope.selectedChannel);
                        return MessagingService.add_members(channelKey, unitKey);
                    });
                };
            },

            controller: function ($scope) {

                $scope.hidden = true;

                // shared object to populate models through scopes
                $scope.shared = {};

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
                            return selectChannel(result.channel_key);
                        });
                };

                $scope.createDirectChannel = this.createDirectChannel;

                $scope.hideApp = function(){
                    $scope.hidden = true;
                };

                function selectChannel(channelKey){
                    $scope.loadingChannel = true;
                    return MessagingService.show_channel(channelKey).then(function(result){
                        return result;
                    }).finally(function(){
                        $scope.loadingChannel = false;
                    })
                }

                $scope.selectChannel = function(channel){
                    var channelKey = getKey(channel);
                    $scope.selectedChannel = channel;
                    selectChannel(channelKey).then(function(result){
                        channel.messages = result.last_messages;
                    });
                }

                $scope.sendMessage = function(content){
                    if (!content) return;
                    var channelKey = getKey($scope.selectedChannel);
                    // select message type: 2 - direct message, 4 - channel message;
                    var msgType = $scope.selectedChannel.type == MessagingService.CHANNEL_TYPE.DIRECT ? 2 : 4;
                    MessagingService.create_message(channelKey, msgType, content).then(function(result){
                        $scope.shared.message = "";
                    });
                }

                $scope.canAddUserAndChannel = function (channel) {
                    return channel && channel.type == MessagingService.CHANNEL_TYPE.PUBLIC;
                }
            }
        };
    })

    .filter('fromNow', function(Moment){
        return function(datetime){
            return Moment(datetime).fromNow();
        }
    });
