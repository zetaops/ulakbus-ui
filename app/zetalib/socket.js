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
     * WSOps operates all websocket interactions
     */
    .service('WSOps', function (WSUri, $log) {
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
        wsOps.onMessage = function(event) {
            $log.info("MESSAGE:", event.data);
        };
        wsOps.onError = function(evt) {
            $log.error("Error :: " + evt);
        };
        wsOps.doSend = function(data) {
            websocket.send(data);
            $log.info('SENT:', data);
        };
        return wsOps;
    });