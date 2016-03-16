/**
 * Copyright (C) 2015 ZetaOps Inc.
 *
 * This file is licensed under the GNU General Public License v3
 * (GPLv3).  See LICENSE.txt for details.
 *
 * @author Evren Kutar
 */

angular.module('ulakbus')
    .factory('ErrorService', function (toastr, $rootScope, $location, $log) {
        var error_service = {};

        error_service.handle = function (rejection, prtcl) {
            var errorInModal;
            if (prtcl === 'http') {
                if (rejection.data) {
                    errorInModal = ('error' in rejection.data);
                } else {
                    errorInModal = false;
                }
            }
            if (prtcl === 'ws') {
                rejection.status = rejection.status || rejection.code;
                rejection.data = {error: rejection.error};
                errorInModal = true;
            }

            var errorModal = function () {
                if ($rootScope.loginAttempt === 0 && prtcl === 'http') {
                    $log.debug('not logged in, no alert message triggered');
                    return;
                }
                var codefield = "";
                if (rejection.data.error) {
                    codefield = '<p><pre>' +
                        rejection.data.error +
                        '</pre></p>';
                }

                $('<div class="modal">' +
                    '<div class="modal-dialog" style="width:100%;" role="document">' +
                    '<div class="modal-content">' +
                    '<div class="modal-header">' +
                    '<button type="button" class="close" data-dismiss="modal" aria-label="Close"><span' +
                    ' aria-hidden="true">&times;</span></button>' +
                    '<h4 class="modal-title" id="exampleModalLabel">' +
                    "Error Status: " + rejection.status + "<br>Error Title: " + rejection.data.title +
                    '</h4>' +
                    '</div>' +
                    '<div class="modal-body">' +
                    '<div class="alert alert-danger">' +
                    '<strong>' +
                    rejection.data.description +
                    '</strong>' +
                    codefield +
                    '</div>' +
                    '</div>' +
                    '<div class="modal-footer">' +
                    '<button type="button" class="btn btn-default" data-dismiss="modal">Kapat</button>' +
                    '</div>' +
                    '</div>' +
                    '</div>' +
                    '</div>').modal();
                try {
                    $('pre:not(.hljs)').each(function (i, block) {
                        hljs.highlightBlock(block);
                    });
                }
                catch (e) {
                    $log.debug('Exception: ', e.message);
                }
            };

            var errorInAlertBox = function (alertContent) {
                if (errorInModal) {
                    errorModal();
                } else {
                    if ($rootScope.loginAttempt > 0) {
                        toastr.error(alertContent.msg, alertContent.title);
                    }
                }
            };

            var errorForAlertBox = {
                title: rejection.status,
                msg: rejection.data ? rejection.data.description : 'Error',
                type: 'error'
            };

            var errorDispatch = {
                "-1": function () {
                    $log.error('-1 returned:', rejection);
                },
                "400": function () {
                    $location.reload();
                },
                "401": function () {
                    $location.path('/login');
                    if ($location.path() === "/login") {
                        $log.debug("show errors on login form");
                    }
                },
                "403": function () {
                    if (rejection.data.is_login === true) {
                        $rootScope.loggedInUser = true;
                        if ($location.path() === "/login") {
                            $location.path("/dashboard");
                        }
                    }
                },
                "404": function () {
                    errorInAlertBox(errorForAlertBox);
                },
                "500": function () {
                    errorInAlertBox(errorForAlertBox);
                },
                "503": function () {
                    rejection.data = {description: "Servise erişilemiyor."};
                    errorInAlertBox(errorForAlertBox);
                }
            };

            errorDispatch[rejection.status || rejection.code]();
        };

        return error_service;
    });