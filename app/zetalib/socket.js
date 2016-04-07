/**
 * Copyright (C) 2015 ZetaOps Inc.
 *
 * This file is licensed under the GNU General Public License v3
 * (GPLv3).  See LICENSE.txt for details.
 *
 * @author Evren Kutar
 */

angular.module('ulakbus')
    /**
     * WSUri returns websocket uri
     */
    .service('WSUri', function (RESTURL) {
        var base = RESTURL.url.replace('http', 'ws');
        return {url: base + 'ws'}
    })
    /**
     * websocket with callbackId
     * use when need to retrieve special data
     */
    .service('WSWithCallback', function () {
        return {"cbs": []};
    })
    /**
     * WSOps operates all websocket interactions
     */
    .factory('WSOps', function (WSUri, $q, $log, $rootScope, $timeout, ErrorService, WS, IsOnline) {
        $rootScope.$on('ws_turn_on', function () {
            generate_ws();
        });

        var websocket;
        var refresh_count = 0;
        var refresh_websocket = refresh_count < 5 ? 1000 : 5000;
        var isSupported = function() {
            return "WebSocket" in window;
        };
        var generate_ws = function () {
            if (isSupported()) {
                $log.info('Openning web socket...');
                websocket = new WS(WSUri.url);
                websocket.onopen = function (evt) {
                    wsOps.onOpen(evt);
                    refresh_count = 0;
                };
                websocket.onclose = function (evt) {
                    wsOps.onClose(evt);
                    if (wsOps.loggedOut === true) {return;}
                    $timeout(function () {
                        generate_ws();
                        refresh_count += 1;
                    }, refresh_websocket);
                };
                websocket.onmessage = function (evt) {
                    wsOps.onMessage(evt)
                };
                websocket.onerror = function (evt) {
                    wsOps.onError(evt)
                };
            } else {
                var error = {
                    error: "Tarayıcınız websocket desteklememektedir. Lütfen güncel bir tarayıcı kullanınız.",
                    code: 500,
                    title: "Uyumsuz Tarayıcı",
                    no_highlight: true
                };
                ErrorService.handle(error, "ws");
            }

        };

        var wsOps = {};
        var pingCounter = 0;
        var checkPing = function () {
            if (pingCounter > 2) {
                websocket.close();
                $log.debug("websocket not pong");
                pingCounter = 0;
            }
        };
        var keepAlivePing = function (interval) {
            return setInterval(function () {
                if ($rootScope.websocketIsOpen && IsOnline.get_status()) {
                    wsOps.doSend(angular.toJson({data: {view: "ping"}}));
                    pingCounter += 1;
                    checkPing();
                } else {
                    $timeout(function () {
                        this(interval);
                    }, 1000);
                }
            }, interval);
        };
        wsOps.onOpen = function (evt) {
            $rootScope.websocketIsOpen = true;
            $log.info("CONNECTED", evt);
            keepAlivePing(20000);
            wsOps.loggedOut = false;
        };
        wsOps.onClose = function (event) {
            $rootScope.websocketIsOpen = false;
            $log.info("DISCONNEDTED", event);

        };
        // two types of data can be come from websocket: with and without callback
        //
        wsOps.callbacks = {};
        wsOps.onMessage = function (event) {
            // msg_methods are dispatch methods for incoming events. init is the default method to run
            var msg_methods = {
                init: function (data) {
                    if (angular.isDefined(wsOps.callbacks[data.callbackID])) {
                        var callback = wsOps.callbacks[data.callbackID];
                        delete wsOps.callbacks[data.callbackID];
                        callback.resolve(data);
                    } else {
                        $log.info("Data without callback: %o", data);
                        // if pong in msg
                        if (msg_data.msg === 'pong') {pingCounter -= 1;}
                    }
                },
                error: function () {
                    ErrorService.handle(msg_data, 'ws');
                },
                notification: function () {
                    $rootScope.$broadcast('notifications', msg_data["notifications"]);
                },
                dashboard: function () {
                    var callback = wsOps.callbacks[msg_data.callbackID];
                    delete wsOps.callbacks[msg_data.callbackID];
                    callback.resolve(msg_data);
                },
                task_list: function () {
                    $rootScope.$broadcast('task_list', msg_data["task_list"]);
                }
            };
            // do_action is the dispatcher function for incoming events
            var do_action = function (options) {
                var args = [].slice.call(arguments, 0),
                    initialized = false,
                    action = 'init';
                if (typeof msg_methods[args[1]] === 'function') {
                    action = args[1];
                    args.shift();
                }
                return msg_methods[action](args[0]);
            };
            var msg_data = angular.fromJson(event.data);
            if (msg_data.error) {msg_data.cmd = 'error';}
            do_action(msg_data, msg_data.cmd);

            $log.info("MESSAGE:", event, "Data:", JSON.parse(event.data));
        };
        wsOps.onError = function (evt) {
            $log.error("ERROR :: " + evt);
        };
        wsOps.doSend = function (data) {
            websocket.send(data);
            $log.info('SENT:', data);
        };
        // reactor with promise
        wsOps.request = function (data) {
            if ($rootScope.websocketIsOpen) {
                var request = {
                    callbackID: Math.random().toString(36).substring(7),
                    data: data
                };
                var deferred = $q.defer();
                wsOps.callbacks[request.callbackID] = deferred;
                websocket.send(angular.toJson(request));
                $log.info('SENT:', data);
                // todo: add success & error promises
                return deferred.promise.then(function (response) {
                        request.response = response;
                        return response;
                    }
                );
            } else {
                // is $rootScope.websocketIsOpen is not true try again in one second
                $timeout(function () {
                    wsOps.request(data);
                }, 1000);
            }
        };

        wsOps.close = function () {
            wsOps.loggedOut = true;
            websocket.close();
            $log.info("CLOSED");
            delete websocket;
        };

        return wsOps;
    });