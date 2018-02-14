'use strict';

/**
 * @ngdoc service
 * @name Message service
 * @description socket service handles all web socket connections and events
 */

angular.module('ulakbus')
    .service("msgService", msgService);

msgService.$inject = ['$q', 'ErrorService', '$log', '$rootScope', '$timeout', '$location', 'Utils', '$window'];

function msgService($q, ErrorService, $log, $rootScope, $timeout, $location, Utils, $window) {
        if($window.sessionStorage.userID === undefined) {
            $location.path('/login');
        }
        $rootScope.$broadcast("ws_turn_on");
        var queue = {};

        return {
            addToQueue: addToQueue,
            deleteFromQueue: deleteFromQueue,
            clearQueue: clearQueue,
            read: read
        };

        function addToQueue(data) {
            var defer = $q.defer();
            queue[data.callbackID] = defer;
            return defer.promise;
        }

        function deleteFromQueue(data) {
            return data.callbackID in queue && (delete queue[data.callbackID]);
        }

        function clearQueue() {
            queue = {};
            return Object.keys(queue).length === 0;
        }

        function read(data) {
            if (data.client_cmd && data.client_cmd[0] === 'download') {
                Utils.saveToDisk(data.download_url);
                return;
            }

            data.error && (data.cmd = "error");
            !data.cmd && (data.cmd = "init");

            switch (data.cmd) {
                case "init":
                    (data.callbackID in queue) ?
                        queue[data.callbackID].resolve(data) :
                        $log.info("Data without callback: %o", data);
                    break;
                case "error":
                    ErrorService.handle(data, 'ws');
                    break;
                case "message":
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
                    $timeout(function () {
                        $rootScope.$broadcast(type[data["type"]], data);
                    });
                    break;
                /*case "dashboard":
                    queue[data.callbackID].resolve(data);
                    break;*/
                case "channel_subscription":
                    $timeout(function () {
                        $rootScope.$broadcast('channel_change', 'add', data);
                    });
                    break;
                case "user_status":
                    $timeout(function (data) {
                        $rootScope.$broadcast('channel_change', 'status', data);
                    });
                    break;
                case "reload":
                    if (angular.isDefined(data.msg) ){ //TODO check this if
                        var alert = {
                            type: "warning",
                            title: data.title,
                            msg: data.msg
                        };
                        $rootScope.$broadcast('alertBox', alert);
                        $timeout(function() {
                            window.location.href = "/";
                        },5000);
                    } else {
                        window.location.href = "/";
                    }
                    break;
                case "logout":
                    queue[data.callbackID].resolve(data);
                    break;
                default:
                    $log.info("unknown action", data);
            }
            return deleteFromQueue(data);

        }
    }