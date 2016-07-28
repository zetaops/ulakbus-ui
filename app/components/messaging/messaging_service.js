/**
 * Copyright (C) 2015 ZetaOps Inc.
 *
 * This file is licensed under the GNU General Public License v3
 * (GPLv3).  See LICENSE.txt for details.
 *
 * @author Evren Kutar
 */

angular.module('ulakbus.messaging', ['ui.bootstrap'])

/**
 * @memberof ulakbus.messaging
 * @ngdoc factory
 * @name MessagingService
 * @description Service handles all stuff related to messaging
 */
    .factory('MessagingService', function ($q, $timeout, $compile, $log, $rootScope, Moment, WSOps, Utils) {
        var msg = {};
        var notificationsChannelKey;
        var channelsMap = {};
        // channels loader promise
        var channelsLoader;

        msg.CHANNEL_TYPE = {
            "PUBLIC": 15,
            "DIRECT": 10,
            "NOTIFICATION": 5
        };

        msg.SHOW_MESSAGING_WINDOW_EVENT = "show_messaging_window";

        var unread = {
            messages: {count: 0},
            notifications: {count: 0}
        };
        var currentChannelKey;
        // track messaging app state for proper unread messages count
        var messagingAppIsHidden = true;

        function wsReady () {
            /**
             * wait until websocket will be open
             */
            var deferred = $q.defer();
            var dismissWatcher = $rootScope.$watch('websocketIsOpen', function(isOpen){
                if (isOpen){
                    dismissWatcher();
                    deferred.resolve();
                }
            });
            return deferred.promise;
        }

        function wsRequest (outgoing){
            return wsReady().then(function(){
                return WSOps.request(outgoing);
            })
        }

        function prepareMessages (messages){
            for (var i = 0; i < messages.length; i++){
                var message = messages[i];
                msg.prepareMessage(message);
            }
        }

        function increaseUnread(message, messageType){
            // skip current channel messages. Don't update counters
            if (!messagingAppIsHidden && message.channel_key == currentChannelKey){
                return;
            }
            checkIfInitialized().then(function(){
                var channel = channelsMap[message.channel_key];
                if (channel){
                    channel.unread += 1;
                }
                unread[messageType].count += 1;
            })
        }

        function decreaseUnread(channel){
            // get channel from channelsMap. Channels in channelMap has unread property
            // which is updated when messages arrive
            channel = channelsMap[channel.key];
            if (channel && channel.unread){
                var counter;
                if (channel.type == msg.CHANNEL_TYPE.NOTIFICATION){
                    counter = unread.notifications
                } else {
                    counter = unread.messages;
                }
                counter.count -= channel.unread;
                if (counter.count < 0) counter.count = 0;
                channel.unread = 0;
            }
        }

        function checkIfInitialized(){
            if (!channelsLoader){
                return msg.list_channels()
            }
            return channelsLoader;
        }

        // prepare message to show in UI
        msg.prepareMessage = function(message){
            if (!message.timestamp){
                message.moment = Moment();
            } else {
                var ts = message.timestamp.replace("Z", "");
                message.moment = Moment(ts);
            }
            return message;
        };

        msg.get_notifications_channel_key = function(){
            return checkIfInitialized().then(function(){
                return notificationsChannelKey;
            });
        };

        msg.get_unread_counters = function(){
            return unread;
        };

        msg.reset_state = function(){
            currentChannelKey = null;
            notificationsChannelKey = null;
            channelsMap = {};
            unread.messages.count = 0;
            unread.notifications.count = 0;
            channelsLoader = false;
        }

        msg.toggle_messaging_window_visibility = function(visibility, resetState){
            messagingAppIsHidden = !visibility;
            if (resetState){
                msg.reset_state();
            }
        };

        msg.show_messaging_window = function(channelKey){
            $rootScope.$broadcast(msg.SHOW_MESSAGING_WINDOW_EVENT, channelKey);
        }

        /**
         * API
         *
         * */

        msg.list_channels = function list_channels (){
            /**
             * request channels list as below;
             * {
             *     'view':'_zops_list_channels',
             * }
             *
             * wait for response
             *
             * {
             *     'channels': [
             *     {'name': string, // name of channel
             *      'key': key,     // key of channel
             *      'unread': int,  // unread message count
             *      'type': int,    // channel type,
             *                      // 15: public channels (chat room/broadcast channel distinction comes from "read_only" flag)
             *                      // 10: direct channels
             *                      // 5:  one and only private channel which can be "Notifications"
             *     'read_only': boolean, //  true if this is a read-only subscription to a broadcast channel
             *                           //  false if it's a public chat room
             *
             *     'actions':[('action name', 'view name'),]
             * }
             *
             */
            var outgoing = {
                view: '_zops_list_channels'
            };

            channelsLoader = wsRequest(outgoing).then(function (data) {
                var grouped = Utils.groupBy(data.channels||[], "type");
                // add all channels to channels map
                for (var i = 0; i < data.channels.length; i++){
                    var channel = data.channels[i];
                    channelsMap[channel.key] = channel;
                }
                // save notifications channel key
                notificationsChannelKey = grouped[msg.CHANNEL_TYPE.NOTIFICATION][0].key;

                return {grouped: grouped, channelsMap: channelsMap};
            });

            return channelsLoader;
        };

        msg.search_user = function (query) {
            var outgoing = {
                view: '_zops_search_user',
                query: query
            };

            return wsRequest(outgoing).then(function (data) {
                    return data.results
            });
        };

        msg.search_unit = function (query) {
            var outgoing = {
                view: '_zops_search_unit',
                query: query
            };

            return wsRequest(outgoing).then(function (data) {
                return data.results
            });
        };

        msg.create_direct_channel = function (key) {
            var outgoing = {
                'view': '_zops_create_direct_channel',
                'user_key': key
            };

            return wsRequest(outgoing).then(function(result){
                $log.info("Create direct channel result: ", result);
                return result;
            })
        };

        msg.create_channel = function (name, desription) {
            var outgoing = {
                view:'_zops_create_channel',
                name: name,
                description: desription
            };

            return wsRequest(outgoing).then(function(result){
                $log.info("Channel ", name, "created: ", result);
                return result;
            })
        };

        msg.add_members = function (channelKey, members, readOnly) {
            var outgoing = {
                view:'_zops_add_members',
                channel_key: channelKey,
                read_only: !!readOnly,
                members: members
            };

            return wsRequest(outgoing).then(function(result){
                $log.info("Members ", members, " added to channel ", channelKey, ": ", result);
                return result;
            })
        };

        msg.add_unit_to_channel = function (channelKey, unitKey, readOnly) {
            var outgoing = {
                view: '_zops_add_unit_to_channel',
                channel_key: channelKey,
                unit_key: unitKey,
                read_only: !!readOnly
            };
            return wsRequest(outgoing).then(function(result){
                $log.info("Unit ", unitKey, " added to channel ", channelKey, ": ", result);
                return result;
            });
        };

        msg.delete_channel =  function (channelKey) {
            var outgoing = {
                view: '_zops_delete_channel',
                channel_key: channelKey
            };
            return wsRequest(outgoing).then(function(result){
                $log.info("Channel ", channelKey, " deleted: ", result);
                return result;
            })
        };

        msg.edit_channel = function (channelKey, name, desription) {
            var outgoing = {
                view:'_zops_edit_channel',
                channel_key: channelKey,
                name: name,
                description: desription
            };

            return wsRequest(outgoing).then(function(result){
                $log.info("Channel ", channelKey, " edited: ", outgoing, result);
                return result;
            })
        };

        msg.pin_channel = function (channelKey) {
            var outgoing = {
                view: '_zops_pin_channel',
                channel_key: channelKey
            };
            return wsRequest(outgoing).then(function(result){
                $log.info("Channel ", channelKey, " pinned: ", result);
                return result;
            })
        };

        msg.show_channel = function(channelKey){
            var outgoing = {
                view: '_zops_show_channel',
                key: channelKey
            };
            return wsRequest(outgoing).then(function(result){
                $log.info("Show channel ", channelKey, ": ", result);
                // decrease unread messages for current channel
                decreaseUnread(result);
                // save current channel key
                currentChannelKey = result.key;
                prepareMessages(result.last_messages);
                return result;
            })
        };

        msg.channel_history = function (channelKey, lastMessageTimestamp) {
            var outgoing = {
                view:'_zops_channel_history',
                channel_key: channelKey,
                timestamp: lastMessageTimestamp
            };
            return wsRequest(outgoing).then(function(result){
                $log.info("Load channel ", channelKey, "history: ", result);
                return result;
            })
        };

        msg.get_unread_messages_count = function(){
            var outgoing = {
                'view': '_zops_unread_count'
            };
            return wsRequest(outgoing).then(function(result){
                $log.info("Get unread messages count: ", result);
                // update internal unread messages counters
                unread.messages.count = result.messages;
                unread.notifications.count = result.notifications;
                return result;
            })
        };

        msg.report_last_seen_message = function (channelKey, msgKey, timestamp){
            var outgoing = {
                view: '_zops_report_last_seen_message',
                channel_key: channelKey,
                msg_key: msgKey,
                timestamp: timestamp
            };
            return wsRequest(outgoing).then(function(result){
                $log.info("Report last seen message ", channelKey, msgKey, timestamp, ": ", result);
                return result;
            })
        };

        msg.create_message = function(channelKey, msgType, body, attachments){
            var outgoing = {
                view: '_zops_create_message',
                message: {
                    channel: channelKey,
                    type: msgType,
                    title: "",
                    receiver: "",
                    body: body,
                    attachments: attachments
                }
            };

            return wsRequest(outgoing).then(function(result){
                $log.info("Message sent: ", result);
                return result;
            })
        };

        msg.find_message = function (channelKey, query, pageNumber) {
            var outgoing = {
                    view: '_zops_search_find_message',
                    channel_key: channelKey,
                    query: query,
                    page: pageNumber
            };
            return wsRequest(outgoing).then(function(result){
                $log.info("Find message: ",  result);
                return result;
            });
        };

        msg.delete_message = function (msgKey) {
            var outgoing = {
                view: '_zops_delete_message',
                key: msgKey
            };
            return wsRequest(outgoing).then(function(result){
                $log.info("Delete message ", msgKey,":", result);
                return result;
            });
        };

        msg.edit_message = function(msgKey, body) {
            var outgoing = {
                view: '_zops_edit_message',
                message: {
                    key: msgKey,
                    body: body
                }
            };
            return wsRequest(outgoing).then(function(result){
                $log.info("Edit message", msgKey, ":", result);
                return result;
            });
        };

        msg.flag_message = function (msgKey, flag) {
            var outgoing = {
                view: '_zops_flag_message',
                key: msgKey,
                flag: flag
            };
            return wsRequest(outgoing).then(function(result){
                $log.info("Flag message ", msgKey, flag, ":", result);
                return result;
            });
        };

        msg.get_message_actions = function (msgKey) {
            var outgoing = {
                view: '_zops_get_message_actions',
                key: msgKey
            };
            return wsRequest(outgoing).then(function(result){
                $log.info("Get message actions", msgKey, ":", result);
                return result;
            });
        };

        msg.add_to_favorites = function (msgKey) {
            var outgoing = {
                view: '_zops_add_to_favorites',
                key: msgKey
            };
            return wsRequest(outgoing).then(function(result){
                $log.info("Add message ", msgKey, " to favorites: ", result);
                return result;
            });
        };

        msg.remove_from_favorites = function (msgKey) {
            var outgoing = {
                view: '_zops_remove_to_favorites',
                key: msgKey
            };
            return wsRequest(outgoing).then(function(result){
                $log.info("Remove message ", msgKey, " from favorites: ", result);
                return result;
            });
        };

        msg.list_favorites = function (channelKey) {
            var outgoing = {
                view: '_zops_list_favorites',
                channel_key: channelKey
            };
            return wsRequest(outgoing).then(function(result){
                $log.info("List favorites for channel", channelKey, ": ", result);
                return result;
            });
        };

        /**
         * Event listeners
         */

        $rootScope.$on("message", function(e, message){
            increaseUnread(message, 'messages');
        });

        $rootScope.$on("notifications", function(e, message){
            increaseUnread(message, 'notifications');
        });

        // reset state on logout
        $rootScope.$watch("loggedInUser", function(value){
            if (!value){
                msg.reset_state();
            };
        });

        return msg;
    })

    .service("MessagingPopup", function($q, $compile, $http, $rootScope){

        function compile(template, config){
            var resultDeferred = $q.defer();
            var scope = config.scope || $rootScope.$new(true);
            var rootElement = config.rootElement;
            var element = $compile(template)(scope);
            if (config.link){
                config.link(scope);
            }

            scope.done = function(result){
                resultDeferred.resolve.apply(this, arguments);
            };
            scope.cancel = function(){
                resultDeferred.reject.apply(this, arguments);
            };

            rootElement.empty();
            rootElement.append(element);

            resultDeferred.promise._done = scope.done;
            resultDeferred.promise._cancel = scope.cancel;
            return resultDeferred.promise.finally(function(){
                rootElement.empty();
                scope.$destroy();
            });
        }

        this.show = function(config){
            if (config.templateUrl){
                return $http({method: 'GET', url: config.templateUrl, cache: true}).then(function(result){
                    return compile(result.data, config)
                });
            }
            return compile(config.template, config);
        };

    });
