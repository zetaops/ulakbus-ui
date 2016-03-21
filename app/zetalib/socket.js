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
    .factory('WSOps', function (WSUri, $q, $log, $rootScope, $timeout, ErrorService, WS) {
        $rootScope.$on('ws_turn_on', function () {
            generate_ws();
        });

        var websocket;
        var refresh_count = 0;
        var refresh_websocket = refresh_count < 5 ? 1000 : 5000;
        var isSupported = function() {
            // return "WebSocket" in window;
            return false;
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
        wsOps.onOpen = function (evt) {
            $rootScope.websocketIsOpen = true;
            $log.info("CONNECTED", evt);
            wsOps.loggedOut === false;
        };
        wsOps.onClose = function (event) {
            $rootScope.websocketIsOpen = false;
            $log.info("DISCONNEDTED", event);

        };
        // two types of data can be come from websocket: with / without callback
        //
        wsOps.callbacks = {};
        wsOps.onMessage = function (event) {
            var data = angular.fromJson(event.data);
            if (data.hasOwnProperty('error')) {
                ErrorService.handle(data, 'ws');
            }
            if (angular.isDefined(wsOps.callbacks[data.callbackID])) {
                var callback = wsOps.callbacks[data.callbackID];
                delete wsOps.callbacks[data.callbackID];
                callback.resolve(data);
            } else {
                $log.info("Data without callback: %o", data);
            }


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
            var request = {
                callbackID: Math.random().toString(36).substring(7),
                data: data
            };
            var deferred = $q.defer();
            wsOps.callbacks[request.callbackID] = deferred;
            websocket.send(angular.toJson(request));
            $log.info('SENT:', data);
            return deferred.promise.then(function (response) {
                    request.response = response;
                    return response;
                }
            );
        };

        wsOps.close = function () {
            wsOps.loggedOut = true;
            websocket.close();
            $log.info("CLOSED");
            delete websocket;
        }

        wsOps.waitForSocketConnection = function (socket, callback) {
            $timeout(
                function () {
                    if (angular.isDefined(socket)) {
                        if (socket.readyState === 1) {
                            $log.info("Connection made.");
                            if (callback != null) {
                                callback();
                            }
                        } else {
                            $log.info("waiting for connection...");
                            wsOps.waitForSocketConnection(socket, callback);
                        }
                    } else {
                        $log.info("waiting for connection...");
                        wsOps.waitForSocketConnection(socket, callback);
                    }
                }, 50); // wait 50 milisecond for the connection...
        };
        return wsOps;
    });