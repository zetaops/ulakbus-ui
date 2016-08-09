angular.module("ulakbus.messaging")

    .directive('messaging', function (Generator, MessagingService, $log, $rootScope, MessagingPopup, Utils, $q, $timeout) {

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
                    iScope.allMessagesLoaded = false;
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

                function getMessageElementByKey(key){
                    return $("#msg-"+key);
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
                    }
                    updateLastMessage(message);
                    reportLastSeenMessage();
                }

                function updateMessage(message){
                    // update current channel messages only
                    if (message.channel_key != getKey(iScope.selectedChannel)) return;
                    // update only visible messages
                    var storedMessage = Utils.findWhere(iScope.selectedChannel.messages, {key: message.key})
                    if (storedMessage){
                        angular.extend(storedMessage, message)
                        var msgElement = getMessageElementByKey(message.key);
                        // use manual update because of 'bind-once' for messages list
                        if (msgElement) {
                            msgElement.text(message.content);
                        }
                    }
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

                iScope.createDirectChannel = function (user){
                    // user format is ['username', 'key', 'avatarUrl']
                    var key = user[1];
                    MessagingService.create_direct_channel(key)
                        .then(function(result){
                            updateAndSelect(getKey(result));
                        })
                };

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
                                    MessagingService.delete_channel(getKey(channel)).then(function(){
                                        iScope.selectedChannel = null;
                                    });
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
                            }).then(function(user){
                                var userKey = user.key;
                                var channelKey = getKey(channel);
                                return MessagingService.add_members(channelKey, [userKey], user.readonly);
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
                            }).then(function(unit){
                                var unitKey = unit.key;
                                var channelKey = getKey(channel);
                                return MessagingService.add_members(channelKey, unitKey, unit.readonly);
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
                    // enable channel history loading
                    iScope.allMessagesLoaded = false;
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
                            // find message content container
                            var messageContainer = getMessageElementByKey(message.key);
                            MessagingPopup.show({
                                templateUrl: "components/messaging/templates/edit_message.html",
                                rootElement: messageContainer,
                                // activate inplace editor logic
                                inplaceEditor: true,
                                link: function (scope) {
                                    scope.internalContent = scope.content;
                                    scope.save = function(){
                                        // delete message if new content is empty
                                        if (!scope.internalContent){
                                            return iScope.applyMessageAction(message, ['_', '_zops_delete_message']);
                                        }
                                        MessagingService.edit_message(message.key, scope.internalContent)
                                            .then(function(){
                                                // apply changes to element
                                                scope.content = scope.internalContent;
                                                scope.done();
                                            });
                                    };
                                }
                            });
                            break;
                    }
                };

                iScope.getMessageActions = function(message){
                    if (message.actions) return;
                    MessagingService.get_message_actions(message.key).then(function(result){
                        message.actions = result.actions;
                    })
                };

                iScope.loadMore = function(){
                    if (iScope.allMessagesLoaded) return;
                    if (iScope.selectedChannel.messages.length > 0){
                        var first = iScope.selectedChannel.messages[0];
                        return MessagingService.channel_history(getKey(iScope.selectedChannel), first.timestamp)
                            .then(function(result){
                                var messages = iScope.selectedChannel.messages;
                                if (result.messages.length == 0){
                                    iScope.allMessagesLoaded = true;
                                    return;
                                }
                                // prepend loaded messages to current channel messages list
                                messages.unshift.apply(messages, result.messages);
                            });
                    }
                };

                // listen to new messages and add them to selected channel if any
                $rootScope.$on("message", function(e, message){
                    if (message.is_update){
                        updateMessage(message);
                    } else {
                        appendMessage(iScope.selectedChannel, MessagingService.prepareMessage(message));
                    }
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
            link: function(iScope, iElem, iAttrs){
                var elem = $(iElem);
                iAttrs.$observe("scrollDownWhenUpdate", function(value){
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

    .directive("loadMoreTop", function($compile, $timeout, $q) {
        // centered loader
        var loaderTpl = $compile('<div class="loader" style="float: none; margin: auto; margin-top: 10px;" ng-show="loading"></div>');
        return {
            scope: {
                loadMoreCallback: "&loadMoreTop"
            },
            link: function(iScope, iElem, iAttrs){
                var elem = $(iElem);
                iElem.prepend(angular.element(loaderTpl(iScope)));
                iScope.loading = false;

                function onScroll(){
                    var scrollTop = elem.scrollTop();
                    if (scrollTop <= 0 && !iScope.loading){
                        if (iScope.loadMoreCallback){
                            // save last top element with id position
                            var id = elem.find("[id]").first().attr('id');
                            $timeout(function(){iScope.loading = true});
                            $q.when(iScope.loadMoreCallback())
                                .finally(function(){
                                    $timeout(function(){
                                        iScope.loading = false;
                                        // try to restore last scroll position;
                                        var lastTopElem = elem.find("#"+id);
                                        if (lastTopElem){
                                            var top = lastTopElem.offset().top - elem.offset().top - 100;
                                            elem.scrollTop(top);
                                        }
                                    });
                                })
                        }
                    }
                }

                elem.scroll(onScroll);
            }
        }
    })

    .directive("contenteditable", function(){
        return {
            require: "?ngModel",
            scope: {},
            link: function(iScope, iElem, iAttrs, ngModel) {
                if(!ngModel) return;

                ngModel.$render = function() {
                    iElem.text(ngModel.$viewValue || '');
                };

                // Listen for change events to enable binding
                iElem.on('blur keyup change', function() {
                    iScope.$evalAsync(read);
                });

                function read() {
                    var html = iElem.text();
                    ngModel.$setViewValue(html);
                }

                iScope.$on('$destroy', function(){
                    iElem.off('blur keyup change');
                })
            }
        }
    })

    .directive('autoFocus', function($timeout){
        function placeCaretAtEnd(el) {
            el.focus();
            if (typeof window.getSelection != "undefined"
                && typeof document.createRange != "undefined") {
                var range = document.createRange();
                range.selectNodeContents(el);
                range.collapse(false);
                var sel = window.getSelection();
                sel.removeAllRanges();
                sel.addRange(range);
            } else if (typeof document.body.createTextRange != "undefined") {
                var textRange = document.body.createTextRange();
                textRange.moveToElementText(el);
                textRange.collapse(false);
                textRange.select();
            }
        }
        return {
            link: function(iScope, iElem){
                $timeout(function(){
                    placeCaretAtEnd(iElem[0]);
                }, 500);
            }
        }
    });
