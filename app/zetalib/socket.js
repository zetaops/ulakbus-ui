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
     * WSOps operates all websocket interactions
     */
    .factory('WSOps', function (WSUri, $q, $log, $rootScope, $timeout, $document, ErrorService, WS, IsOnline, DevSettings) {
        $rootScope.$on('ws_turn_on', function () {
            generate_ws();
        });
        // websocket object
        var websocket;
        // when websocket tries to reconnect it counts
        var refresh_count = 0;
        // an interval integer in miliseconds depending on refresh_count
        var refresh_websocket = refresh_count < 5 ? 1000 : 5000;
        // check and return if browser supports websocket
        var isSupported = function () {
            return "WebSocket" in window;
        };
        /**
         * generate_ws generates web socket with necessary functions to configure
         */
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
                    if (wsOps.loggedOut === true) {
                        return;
                    }
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

        // wsOps is service object when WSOps called
        var wsOps = {};
        var pingCounter = 0;
        // ping is to keep alive websocket session when ui is open and used
        // backend needs it to refresh session in order to not timeout
        // checkPing is control function if 3 ping sent without response 'pong' refresh websocket object by closing it
        // keepAlivePing is a function sends ping data when socket opens
        var checkPing = function () {
            if (pingCounter > 2) {
                websocket.close();
                $log.debug("websocket not pong");
                pingCounter = 0;
            }
        };
        var keepAlivePing = function (interval) {
            return setInterval(function () {
                if ($rootScope.websocketIsOpen && IsOnline.get_status() && DevSettings.settings.keepAlive === 'on') {
                    wsOps.doSend(angular.toJson({data: {view: "ping"}}));
                    pingCounter += 1;
                    checkPing();
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
            $log.info("DISCONNECTED", event);
        };
        // two types of data can be come from websocket: with and without callback
        // if callback in callbacks list it will run the callback and delete it
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
                        if (data.msg != 'pong') {
                            $log.info("Data without callback: %o", data);
                        };
                        // if pong in msg reduce pingCounter
                        if (msg_data.msg === 'pong') {
                            pingCounter -= 1;
                        }
                    }
                },
                error: function () {
                    // when error in message redirect to ErrorService with error data
                    return ErrorService.handle(msg_data, 'ws');
                },
                message: function () {
                    // broadcast notifications data to notifications directive
                    // parse messages by type
                    // (1, "Info Notification"),
                    // (11, "Error Notification"),
                    // (111, "Success Notification"),
                    // (2, "Direct Message"),
                    // (3, "Broadcast Message"),
                    // (4, "Channel Message")
                    var type = {
                        1: "notifications",
                        11: "notifications",
                        111: "notifications",
                        2: "message",
                        3: "message",
                        4: "message"
                    };
                    // this way it broadcasts to relevant listener
                    // i group messages and notifications into 2 groups
                    // necessary actions will taken where it is listened
                    $timeout(function(){
                        $rootScope.$broadcast(type[msg_data["type"]], msg_data);
                    });
                },
                dashboard: function () {
                    // dashboard consists of menu and user specifications
                    var callback = wsOps.callbacks[msg_data.callbackID];
                    delete wsOps.callbacks[msg_data.callbackID];
                    callback.resolve(msg_data);
                },
                task_list: function () {
                    // broadcast task list to task_list directive in dashboard_widget_directives.js
                    $rootScope.$broadcast('task_list', msg_data["task_list"]);
                }
            };
            // do_action is the dispatcher function for incoming events
            var do_action = function (options) {
                // remove mask from crud here
                // togglePageReadyMask(0);
                // $log.info("togglePageReadyMask off");
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
            if (msg_data.error) {
                msg_data.cmd = 'error';
            }
            do_action(msg_data, msg_data.cmd);
            if (msg_data.msg != "pong"){
                $log.info("MESSAGE:", event, "Data:", angular.copy(msg_data));
            }
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
                // togglePageReadyMask(1);
                // $log.info("togglePageReadyMask on");
                //
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
        };
        /**
         * below elements used by togglePageReadyMask function
         * when data with callback function sent to websocket it toggles on the mask
         * so the user not able to interact with interface
         */
        var pageReady;
        var mask = angular.element('<div class="body-mask"><div class="loader"></div>' +
            '</div>');
        mask.css({zIndex: '2010', opacity: '0.6'});
        var body = $document.find('body').eq(0);
        var togglePageReadyMask = function (st) {
            var toggle = [
                function () {
                    if (pageReady === 0) {
                        return;
                    }
                    $timeout(function () {
                        mask.remove();
                        pageReady = 0;
                    }, 1000);
                },
                function () {
                    if (pageReady === 1) {
                        return;
                    }
                    body.append(mask);
                    pageReady = 1;
                }
            ];
            toggle[st]();
        };

        return wsOps;
    });
