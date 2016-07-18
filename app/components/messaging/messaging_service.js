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

        msg.send = function (msg) {
            /**
             * send the message as following structure;
             *
             * MSG_TYPES can be follwing;
             *
             * MSG_TYPES = (
             *      (2, "Direct Message"),
             *      (3, "Broadcast Message"),
             *      (4, "Channel Message")
             * )
             *
             * {
             *  'view':'_zops_create_message',
             *  'message': {
             *      'channel': "code_name of the channel",
             *      'receiver': "Key of receiver. Can be blank for non-direct messages",
             *      'client_id': "Client side unique id for referencing this message",
             *      'title': "Title of the message. Can be blank.",
             *      'body': "Message body.",
             *      'type': zengine.messaging.model.MSG_TYPES,
             *      'attachments': [{
             *          'description': "Can be blank.",
             *          'name': "File name with extension.",
             *          'content': "base64 encoded file content"
             *          }]
             * }
             *
             * wait for response as
             *
             * {
             *      'msg_key': "Key of the just created message object",
             * }
             *
             */
            function prepMsg(msg) {
                var outgoing = {
                    form_params: {
                        view: '_zops_create_message',
                        message: {
                            'channel': msg.channel, // this can be both channel and direct msg. remember direct msg is channel
                            'receiver': msg.receiver,
                            'client_id': msg.client_id, // "Client side unique id for referencing this message",
                            'title': msg.title, // "Title of the message. Can be blank.",
                            'body': msg.body, // "Message body.",
                            'type': msg.TYPE, // type can be one of the above
                            // 'attachments': [{ // do it with fileread directive
                            //     'description': "Can be blank.",
                            //     'name': "File name with extension.",
                            //     'content': "base64 encoded file content"
                            // }]
                        }
                    }
                };
                return outgoing;
            }

            WSOps.request(prepMsg(msg)).then(function (data) {
                $log.debug("message sent:", data);
            });
        };
        msg.incoming = function () {
            /**
             *
             */

        };
        msg.update = function (msg, action) {
            /**
             * update / delete a message here
             */
            var outgoing = {
                form_params: {
                    view: '_zops_' + action + '_message',
                    message: {
                        'channel': msg.channel, // this can be both channel and direct msg. remember direct msg is channel
                        'receiver': msg.receiver,
                        'client_id': msg.client_id, // "Client side unique id for referencing this message",
                        'title': msg.title, // "Title of the message. Can be blank.",
                        'body': msg.body, // "Message body.",
                        'type': msg.TYPE // type can be one of the above
                    }

                }
            };
            return WSOps.request(outgoing).then(function (data) {
                $log.debug("update request sent");
                return data;
            })
        };
        /**
         * use this method to get all messages of channel and direct messages
         * REMEMBER; direct messages are also channels, everything is channel on backend!
         * @param chnls
         * @returns {*}
         */
        msg.get_channel = function (chnls) {
            /**
             * request channels as below;
             *
             * {
             *    'view':'_zops_show_channel',
             *    'channel_key': "Key of the requested channel"
             * }
             *
             * wait for response
             *
             * {
             *    'channel_key': "key of channel",
             *    'description': string,
             *    'no_of_members': int,
             *    'member_list': [
             *        {'name': string,
             *         'is_online': bool,
             *         'avatar_url': string,
             *        }],
             *    'last_messages': [
             *        {'content': string,
             *         'key': string,
             *         'actions':[
             *            {'title': string,
             *             'cmd': string
             *             }
             *            ]
             *        }
             *    ]
             * }
             *
             */
            var outgoing = {
                form_params: {
                    view: '_zops_show_channel',
                    channel_key: chnls.key
                }
            };
            return WSOps.request(outgoing).then(function (data) {
                $log.debug("message sent:", data);
                return data;
            });
        };
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
            return wsReady().then(function(){
                return WSOps.request(outgoing).then(function (data) {
                    return Utils.groupBy(data.channels||[], "type");
                });
            });
        };

        msg.search_user = function (query) {
            var outgoing = {
                view: '_zops_search_user',
                query: query
            };
            return wsReady().then(function(){
                return WSOps.request(outgoing).then(function (data) {
                    return data.results
                });
            });
        };

        return msg;
    });
