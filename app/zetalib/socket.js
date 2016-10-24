(function () {
    'use strict';

    /**
     * Principle of this service:
     * socket used with different styles.
     *
     * 1- socket is used like normal request-response system like ajax.
     *      when socket send called it return deferred.promise onject.
     *      defered object is resolved when socket service get message with same id.
     *      object poll stored in message service.
     * 2- backend change action
     *      this actions trigger events in directions. e.g. reload ui , task list.
     * 3- messages
     *      messages and notifications for chat and informative purposes
     */

    /**
     * @ngdoc service
     * @name socket
     * @description socket service handles all web socket connections and events
     */



    angular.module('ulakbus')
        .service("WSOps", socketService);

    socketService.$inject = ['$websocket', 'RESTURL', '$rootScope', '$log', 'msgService','$q', 'IsOnline', 'DevSettings'];

    function socketService($websocket, RESTURL, $rootScope, $log, msgService, $q, IsOnline, DevSettings) {
        /**
         * Check for web socket support of browser
         */
        if (!('MozWebSocket' in window || 'WebSocket' in window)){
            var error = {
                error: "Tarayıcınız websocket desteklememektedir. Lütfen güncel bir tarayıcı kullanınız.",
                code: 500,
                title: "Uyumsuz Tarayıcı",
                no_highlight: true
            };
            ErrorService.handle(error, "ws");
            return;
        }

        var socket = $websocket(RESTURL.ws);

        /**
         * Web socket events
         * Actions when socket events triggered.
         */

        socket.ping = 0;
        socket.loginStatus = false;

        socket.onOpen(function (evt) {
            $rootScope.websocketIsOpen = true;
            socket.loginStatus = true;
            ping(); // starts ping interval
            $log.info("CONNECTED", evt);
        });

        socket.onClose(function (evt) {
            $rootScope.websocketIsOpen = false;
            $log.info("DISCONNECTED", evt);
            //socket.reconnect(); //reconnects to ws when connection drops
        });

        socket.onError(function (evt) {
            $log.error("ERROR :: " + evt);
        });

        socket.onMessage(function (evt) {
            console.log(evt)
            var message = angular.fromJson(evt.data);
            console.log(message);
            if (angular.isUndefined(message)){return};
            if (message.msg === 'pong') {
                pong();
                return;
            }
            $log.info("MESSAGE:", evt, "Data:", angular.copy(message));
            msgService.read(message);
        });

        /**
         * for debugging in developer console.
         */
        if(RESTURL.ws.match(/127.0.0.1|localhost/)){
            window.socket = socket;
        }

        return {
            close: close,
            send: send,
            request: send
        };


        /**
         * Web socket functions
         * Methods can be called from controllers.
         */

        /**
         * @name close
         * @description closes ws connection
         * @param reason
         */
        function close(reason){
            socket.loginStatus = false;
            msgService.clearQueue();
            $log.info("CLOSED :", reason || "");
            socket.close();
            return true;
        }

        /**
         * Socket send
         * @name send
         * @description adds id to data for tracking and sends data to ws
         * @param data
         */
        function send(data) {
            /**
             * @name callbackID
             * @description generetes UUID for unique id
             * @type {string}
             */
            var callbackID = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {var r = Math.random()*16|0,v=c=='x'?r:r&0x3|0x8;return v.toString(16);});
            data = {
                data :data,
                callbackID: callbackID
            };
            return socket.send(data).then(
                function(data){
                    return msgService.addToQueue(data)
                },
                function(){
                    return $q.reject();
                }
            );
        }

        /**
         * Private Methods
         */

        /**
         * Ping-Pong
         * @description pinging ws to check network connection and to keep connection alive.
         * interval set to 15000ms, max time for reconnect will be 30s.
         */
        function ping(interval){
            /**
             * if 30s exceeded will close connection and clear interval
             */
            if (socket.ping > 2){
                close();
                $log.debug("websocket not pong");
                socket.ping = 0;
                clearInterval(pinger);
                return;
            }
            var pinger = setInterval(function () {
                if (
                    $rootScope.websocketIsOpen
                    && IsOnline.get_status()
                    && DevSettings.settings.keepAlive === 'on'
                ) {
                    /**
                     * sends ping message to ws
                     */
                    send({view: "ping"})
                    /**
                     * increase ping count for tracking
                     */
                        .then(function(){
                            socket.ping++
                        });

                }
            }, 15000);
        }

        /**
         * Ping-Pong
         * @description resets ping count when requested
         */
        function pong(){
            socket.ping = 0;
        }
    };
}());