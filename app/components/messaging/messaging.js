angular.module("ulakbus.messaging")

    .directive('messaging', function (Generator, MessagingService, $log, $rootScope, MessagingPopup, Utils, $q) {

        // get channel key
        function getKey (channel) {
            if (!channel) return;
            if (!angular.isObject(channel)) return channel;
            var channelKey = channel.channel_key;
            if (!channelKey && channel.hasOwnProperty('key')){
                channelKey = channel.key;
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
            scope: {},
            link: function(iScope, iElem, iAttrs){
                iScope.chatAppIsHidden = true;

                // reset state when user log in/log out
                $rootScope.$watch('loggedInUser', function(v){
                    iScope.loggedIn = v;
                    reset();
                });

                // shared object to populate models through scopes
                iScope.shared = {};

                var popupRootElement = $(iElem).find('.popup-placeholder');

                function reset(){
                    iScope.selectedChannel = null;
                    iScope.publicChannels = [];
                    iScope.notificationsChannel = [];
                    iScope.directChannels = [];
                }

                function editChannelPopup(channel){
                    return MessagingPopup.show({
                        templateUrl: "components/messaging/templates/create_channel.html",
                        rootElement: popupRootElement,
                        link: function(scope){
                            scope.channel = channel||{};
                            scope.title = "Kanalı düzenle";
                            scope.actionTitle = "Düzenle";
                            if (!channel){
                                scope.title = "Yeni Kanal Oluştur";
                                scope.actionTitle = "Oluştur";
                            }
                        }
                    })
                }

                function updateLastMessage(message){
                    if (!message && iScope.selectedChannel && iScope.selectedChannel.messages.length > 0){
                        var last = iScope.selectedChannel.messages.length - 1;
                        return iScope.lastMessage = iScope.selectedChannel.messages[last];
                    }
                    return iScope.lastMessage = message;
                }

                function appendMessage(channel, message){
                    if (channel && getKey(message) == getKey(channel)){
                        if (channel.messages){
                            channel.messages.push(message);
                        }
                    };
                    updateLastMessage(message);
                }

                function updateAndSelect(channelKey){
                    channelKey = getKey(channelKey);
                    return iScope.updateChannelsList().then(function(){
                        return iScope.selectChannel(channelKey);
                    })
                }

                function deleteMessageLocally(messageKey){
                    if (iScope.selectedChannel){
                        Utils.deleteWhere(iScope.selectedChannel.messages, {'key': messageKey});
                    }
                }

                function reportLastSeenMessage(){
                    if (!iScope.lastMessage || !iScope.selectedChannel) return;
                    // instantly received messages haven't timestamp. Use moment
                    // FIXME: change to proper moment processing
                    // var ts = iScope.lastMessage.moment.toISOString();
                    var ts = iScope.lastMessage.moment.format("YYYY-MM-DDTHH:mm:ss");
                    MessagingService.report_last_seen_message(getKey(iScope.selectedChannel), iScope.lastMessage.key, ts);
                };

                iScope.deleteConfirmation = function(title){
                    return MessagingPopup.show({
                        templateUrl: "components/messaging/templates/delete_confirmation.html",
                        link: function(scope){
                            scope.title = title || "Silmek istediğinize emin misiniz?";
                        },
                        rootElement: popupRootElement
                    })
                };

                iScope.updateChannelsList = function(){
                    return MessagingService.list_channels().then(function (channels) {
                        var groupedChannels = channels.grouped;
                        iScope.publicChannels = groupedChannels[MessagingService.CHANNEL_TYPE.PUBLIC];
                        iScope.notificationsChannel = groupedChannels[MessagingService.CHANNEL_TYPE.NOTIFICATION][0];
                        iScope.directChannels = groupedChannels[MessagingService.CHANNEL_TYPE.DIRECT];

                    });
                }

                this.createDirectChannel = function(user){
                    // user format is ['username', 'key', 'avatarUrl']
                    var key = user[1];
                    MessagingService.create_direct_channel(key)
                        .then(function(result){
                            updateAndSelect(getKey(result));
                        })
                };

                iScope.createDirectChannel = this.createDirectChannel;

                iScope.hideApp = function(){
                    iScope.chatAppIsHidden = true;
                    MessagingService.toggle_messaging_window_visibility(false);
                };

                iScope.showApp = function(){
                    iScope.chatAppIsHidden = false;
                    MessagingService.toggle_messaging_window_visibility(true);
                    return iScope.updateChannelsList();
                }

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
                    return editChannelPopup().then(function(channel){
                        return MessagingService.create_channel(channel.name, channel.description||"")
                            .then(function(newChannel){
                                updateAndSelect(newChannel)
                            });
                    })
                };

                iScope.applyChannelAction = function(channel, action){
                    var actionView = action[1];

                    switch (actionView) {

                        case '_zops_pin_channel':
                            MessagingService.pin_channel(getKey(channel));
                            break;

                        case '_zops_delete_channel':
                            iScope.deleteConfirmation('Kanalı silmek istediğinize emin misiniz?')
                                .then(function(){
                                    MessagingService.delete_channel(getKey(channel));
                                });
                            break;

                        case '_zops_edit_channel':
                            editChannelPopup(channel).then(function(channelData){
                                return MessagingService.edit_channel(getKey(channelData), channelData.name, channelData.description||"");
                            });
                            break;

                        case '_zops_add_members':
                            MessagingPopup.show({
                                templateUrl: "components/messaging/templates/add_user_unit.html",
                                rootElement: popupRootElement,
                                link: function(scope){
                                    scope.title = "Kanala kullanıcı ekle";
                                    scope.placeholder = "Eklemek için kullanıcı ara";
                                    scope.onChange = function(query){
                                        searchWrapper(scope, function(){
                                            return MessagingService.search_user(query);
                                        })
                                    };
                                    scope.onChange("");
                                }
                            }).then(function(userKey){
                                return MessagingService.add_members(getKey(channel), [userKey]);
                            });
                            break;

                        case "_zops_add_unit_to_channel":
                            MessagingPopup.show({
                                templateUrl: "components/messaging/templates/add_user_unit.html",
                                rootElement: popupRootElement,
                                link: function(scope){
                                    scope.title = "Birim Ekle";
                                    scope.placeholder = "Kanala eklemek için birim ara";
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
                            break;
                    }
                };

                function selectChannel(channelKey, silent){
                    if (!silent) iScope.loadingChannel = true;
                    return MessagingService.show_channel(channelKey)
                        .finally(function(){
                            iScope.loadingChannel = false;
                        })
                }

                iScope.selectChannel = function(channel, silent){
                    var channelKey = getKey(channel);
                    selectChannel(channelKey, silent).then(function(result){
                        iScope.selectedChannel = result;
                        iScope.selectedChannel.read_only = channel.read_only;
                        iScope.selectedChannel.messages = result.last_messages;
                        updateLastMessage(channel.messages);
                        reportLastSeenMessage();
                    });
                };

                iScope.isChannelSelected = function(channel){
                    return iScope.selectedChannel && getKey(channel) == getKey(iScope.selectedChannel);
                }

                iScope.sendMessage = function(content){
                    if (!content) return;
                    var channelKey = getKey(iScope.selectedChannel);
                    // select message type: 2 - direct message, 4 - channel message;
                    var msgType = iScope.selectedChannel.type == MessagingService.CHANNEL_TYPE.DIRECT ? 2 : 4;
                    MessagingService.create_message(channelKey, msgType, content).then(function(){
                        iScope.shared.message = "";
                    });
                };

                iScope.applyMessageAction = function(message, action){
                    var actionView = action[1];
                    switch (actionView) {
                        case "_zops_favorite_message":
                            MessagingService.add_to_favorites(message.key)
                                .then(function(){
                                    // force actions to reload
                                    message.actions = null;
                                });
                            break;
                        case "_zops_flag_message":
                            MessagingService.flag_message(message.key, true)
                                .then(function(){
                                    // force actions to reload
                                    message.actions = null;
                                });
                            break;
                        case "_zops_unflag_message":
                            MessagingService.flag_message(message.key, false)
                                .then(function(){
                                    // force actions to reload
                                    message.actions = null;
                                });
                            break;
                        case "_zops_delete_message":
                            iScope.deleteConfirmation("Mesajı silmek istediğinize emin misiniz?")
                                .then(function(){
                                    return MessagingService.delete_message(message.key).then(function(){
                                        deleteMessageLocally(message.key);
                                    })
                                });
                            break;
                        case "_zops_edit_message":
                            break;
                    }
                };

                iScope.getMessageActions = function(message){
                    if (message.actions) return;
                    MessagingService.get_message_actions(message.key).then(function(result){
                        message.actions = result.actions;
                    })
                };

                // listen to new messages and add them to selected channel if any
                $rootScope.$on("message", function(e, message){
                    appendMessage(iScope.selectedChannel, MessagingService.prepareMessage(message));
                });
                // notifications in messaging window are processed as ordinary messages
                $rootScope.$on("notifications", function(e, notification){
                    appendMessage(iScope.selectedChannel, MessagingService.prepareMessage(notification));
                });

                $rootScope.$on("user_ready", function(){
                    // init service after user logged in
                    reset();
                    iScope.hideApp();
                });

                $rootScope.$on(MessagingService.SHOW_MESSAGING_WINDOW_EVENT, function(e, channelKey){
                    var showApp = $q.when();
                    if (iScope.chatAppIsHidden){
                        showApp = iScope.showApp();
                    }
                    if (channelKey && channelKey != getKey(iScope.selectedChannel)){
                        showApp.then(function(){
                            iScope.selectChannel(channelKey);
                        })
                    }
                })
            }
        };
    })

    .filter('fromNow', function(Moment){
        return function(datetime){
            return Moment(datetime).fromNow();
        }
    })

    .directive("scrollDownWhenUpdate", function($timeout){
        return {
            scope: {
                changesWatcher: "&scrollDownWhenUpdate"
            },
            link: function(iScope, iElem, iAttrs){
                var elem = $(iElem);
                iScope.$watch(iScope.changesWatcher, function(value){
                    if (value){
                        // update on next digest
                        $timeout(function(){
                            elem.scrollTop(elem[0].scrollHeight);
                        }, 0);
                    }
                });
            }
        }
    })
