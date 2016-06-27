/**
 * Copyright (C) 2015 ZetaOps Inc.
 *
 * This file is licensed under the GNU General Public License v3
 * (GPLv3).  See LICENSE.txt for details.
 *
 * @author Evren Kutar
 */

angular.module('ulakbus.messagingService', ['ui.bootstrap'])

/**
 * @memberof ulakbus.formService
 * @ngdoc factory
 * @name Generator
 * @description form service's Generator factory service handles all generic form operations
 */
    .factory('MessagingService', function ($q, $timeout, $sce, $location, $route, $compile, $log, RESTURL, $rootScope, Moment, WSOps, FormConstraints, $uibModal) {
        var msg = {};
        msg.send = function (msg) {
            /**
             * send the message as following structure;
             *
             * MSG_TYPES can be follwing;
             *
             * MSG_TYPES = (
             *      (1, "Info Notification"),
             *      (11, "Error Notification"),
             *      (111, "Success Notification"),
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
        msg.channels = [];

        return msg;
    });