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
    .service('WSUri', function () {
        return {url: 'ws://localhost:9001/ws'}
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
    .factory('WSOps', function (WSUri, $q, $log) {
        var websocket = new WebSocket(WSUri.url);
        websocket.onopen = function (evt) {
            wsOps.onOpen(evt)
        };
        websocket.onclose = function (evt) {
            wsOps.onClose(evt)
        };
        websocket.onmessage = function (evt) {
            wsOps.onMessage(evt)
        };
        websocket.onerror = function (evt) {
            wsOps.onError(evt)
        };

        var wsOps = {};
        wsOps.onOpen = function(evt) {
            $log.info("CONNECTED", evt);
        };
        wsOps.onClose = function(event) {
            $log.info("DISCONNEDTED", event);
        };
        // two types of data can be come from websocket: with / without callback
        //
        wsOps.callbacks = {};
        wsOps.onMessage = function(event) {
            var data = angular.fromJson(event.data);
            if (angular.isDefined(callbacks[data.request_id])) {
                var callback = callbacks[data.request_id];
                delete callbacks[data.request_id];
                callback.resolve(data);
            } else {
                $log.info("Data without callback: %o", data);
            }


            $log.info("MESSAGE:", event.data);
        };
        wsOps.onError = function(evt) {
            $log.error("ERROR :: " + evt);
        };
        wsOps.doSend = function(data) {
            websocket.send(data);
            $log.info('SENT:', data);
        };
        // reactor with promise
        wsOps.request = function(data) {
            var request = {
                request_id: Math.random().toString(36).substring(7),
                data: data
            };
            var deferred = $q.defer();
            wsOps.callbacks[request.request_id] = deferred;
            websocket.send(angular.toJson(request));
            return deferred.promise.then(function(response) {
                request.response = response;
                return response;
            });
        };
        return wsOps;
    });