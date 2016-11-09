/**
 * @license Ulakbus-UI
 * Copyright (C) 2015 ZetaOps Inc.
 *
 * This file is licensed under the GNU General Public License v3
 * (GPLv3).  See LICENSE.txt for details.
 */

describe('Web Socket service', function () {


    var defer;
    var $q;
    var $rootScope;

    beforeEach(module('ulakbus'));

    beforeEach(inject(function(_$q_, _$rootScope_) {
        $q = _$q_;
        $rootScope = _$rootScope_;
        defer = _$q_.defer();
    }));
/*
    var $websocketBackend;

    beforeEach(angular.mock.module('ngWebSocket', 'ngWebSocketMock'));

    beforeEach(inject(function (_$websocketBackend_) {
        $websocketBackend = _$websocketBackend_;
        $websocketBackend.expectConnect('ws://api.ulakbus.net/ws');
    }));
*/

    describe('send', function () {
        it('should return promise', inject(
            function (WSOps) {
                var data = {cmd:"dashboard"};
                var res = WSOps.send(data);
                expect((typeof res == 'object' && typeof res.then == 'function')).toBe(true);
            })
        )
    });

    // TODO: write close ws test
    /* describe('close', function(){
        it('should close connection and return promise',inject(
            function (WSOps) {
                WSOps.close();
                expect($rootScope.websocketIsOpen).toBe(true);
            })
        )
    })
    */
})