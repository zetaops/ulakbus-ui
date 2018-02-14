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

    socketService.$inject = ['$websocket', 'RESTURL', '$rootScope', '$log', 'msgService','$q', 'IsOnline', 'DevSettings', '$window'];

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

        var socket = void 0;
        var pinger = undefined;
        $rootScope.$on('ws_turn_on', connect);

        /**
         * for debugging in developer console.
         */
        if(RESTURL.ws.match(/127.0.0.1|localhost/)){
            window.socket = socket;
        }

        return {
            connect: connect,
            close: close,
            send: send,
            request: send
        };


        /**
         * Web socket functions
         * Methods can be called from controllers.
         */

        function connect(){
            if(angular.isDefined(socket)) return;

            socket = $websocket(RESTURL.ws);
            /**
             * Web socket events
             * Actions when socket events triggered.
             */
            socket.ping = 0;
            socket.onOpen(function (evt) {
                socket.ping = 1;
                ping(); // starts ping interval
                $log.info("CONNECTED", JSON.stringify(evt));
            });

            socket.onClose(function (evt) {
                $log.info("DISCONNECTED", JSON.stringify(evt));
            });

            socket.onError(function (evt) {
                $log.error("ERROR :: " + JSON.stringify(evt));
            });

            socket.onMessage(function (evt) {
                var message = angular.fromJson(evt.data);
                if (angular.isUndefined(message)){return}
                if (message.msg === 'pong') {
                    pong();
                    return;
                }
                $log.info("MESSAGE:", JSON.stringify(evt), "Data:", angular.copy(message));
                msgService.read(message);
            });
            window.send = send;
        }


        /**
         * @name close
         * @description closes ws connection
         * @param reason
         */
        function close(reason){
            msgService.clearQueue();
            $log.info("CLOSED :", reason || "");
            if (!angular.isUndefined(socket) && reason === "loggedout") {
                socket.close();
                socket = undefined;
            }
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
             * @name genData
             * @param data
             * @returns {{data: *, callbackID: string}}
             */
            connect();
            var d=$q.defer();
            if (socket.ping === 0) {
                 waitTillConnection(function(){
                     sendData(data).then(function(result){
                        d.resolve(result);
                     });
                });
                //waiting state
                return d.promise;
            } else if (socket.ping > 3) {
                clearInterval(pinger);
                socket.reconnect();
                waitTillConnection(function(){
                   sendData(data).then(function(result){
                       d.resolve(result);
                    });
                });
                return d.promise;
            }else{
               return sendData(data);
            }
        }
        function sendData(data){
            var genData = {
                data: data,
                callbackID: 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
                    var r = Math.random() * 16 | 0, v = c == 'x' ? r : r & 0x3 | 0x8;
                    return v.toString(16)
                })
            };

            return socket.send(genData).then(
                function () {
                    return msgService.addToQueue(genData);
                },
                function () {
                    return $q.reject();
                }
            );
        }
         function waitTillConnection(cb){
             var socketInterval = setInterval(
                  function () {
                      if (socket.ping <= 3 && socket.ping>=1) {
                          clearInterval(socketInterval);
                         return cb();
                      }
                  }, 500);
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
            pinger = setInterval(function () {
                if (
                    check()
                    && IsOnline.get_status()
                    && DevSettings.settings.keepAlive === 'on'
                ) {
                    /**
                     * sends ping message to ws
                     */
                    send({view: "ping"});
                    /**
                     * increase ping count for tracking
                     */
                    socket.ping++;
                    console.log(socket.ping)
                }
            }, 30000);

            function check(){
                if (socket.ping > 3){
                    clearInterval(pinger);
                    socket.reconnect();
                    $log.debug("websocket not pong");
                    return false
                }
                return true
            }
        }

        /**
         * Ping-Pong
         * @description resets ping count when requested
         */
        function pong(){
                socket.ping = 1;
        }
    }
}());
