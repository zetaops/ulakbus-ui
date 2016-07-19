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
 * @name Generator
 * @description form service's Generator factory service handles all generic form operations
 */
    .factory('MessagingService', function ($q, $timeout, $sce, $location, $route, $compile, $log, $rootScope, Moment, WSOps, Utils) {
        var msg = {};

        msg.CHANNEL_TYPE = {
            "PUBLIC": 15,
            "DIRECT": 10,
            "NOTIFICATION": 5
        };

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
            return wsRequest(outgoing).then(function (data) {
                return Utils.groupBy(data.channels||[], "type");
            });
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
                view:'_zops_create_channel',
                channel_key: channelKey,
                name: name,
                description: desription
            };

            return wsRequest(outgoing).then(function(result){
                $log.info("Channel ", channelKey, " edited: ", result);
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
                channel_key: channelKey
            };
            return wsRequest(outgoing).then(function(result){
                $log.info("Show channel ", channelKey, ": ", result);
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

        msg.report_last_seen_message = function (channelKey, msgKey, timestamp){
            var outgoing = {
                channel_key: channelKey,
                msg_key: msgKey,
                timestamp: timestamp,
            };
            return wsRequest(outgoing).then(function(result){
                $log.info("Report last seen message ", channelKey, msgKey, timestamp, ": ", result);
                return result;
            })
        };

        msg.create_message = function(channelKey, msgType, body, attachments){
            var outgoing = {
                view: '_zops_create_message',
                channel: channelKey,
                type: msgType,
                body: body,
                attachments: attachments
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
                message_key: msgKey
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
                message: {
                    'key': msgKey,
                    'flag': flag
                }
            };
            return wsRequest(outgoing).then(function(result){
                $log.info("Flag message ", msgKey, flag, ":", result);
                return result;
            });
        };

        msg.get_message_actions = function (msgKey) {
            var outgoing = {
                view: '_zops_get_message_actions',
                message_key: msgKey
            };
            return wsRequest(outgoing).then(function(result){
                $log.info("Get message actions", msgKey, ":", result);
                return result;
            });
        };

        msg.add_to_favorites = function (msgKey) {
            var outgoing = {
                view: '_zops_add_to_favorites',
                message_key: msgKey
            };
            return wsRequest(outgoing).then(function(result){
                $log.info("Add message ", msgKey, " to favorites: ", result);
                return result;
            });
        };

        msg.remove_from_favorites = function (msgKey) {
            var outgoing = {
                view: '_zops_remove_to_favorites',
                message_key: msgKey
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
        }

        return msg;
    });
