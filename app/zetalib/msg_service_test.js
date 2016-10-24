/**
 * @license Ulakbus-UI
 * Copyright (C) 2015 ZetaOps Inc.
 *
 * This file is licensed under the GNU General Public License v3
 * (GPLv3).  See LICENSE.txt for details.
 */

describe('msg service', function () {

    var defer;
    var $q;
    var $rootScope;

    beforeEach(module('ulakbus'));

    beforeEach(inject(function(_$q_, _$rootScope_) {
        $q = _$q_;
        $rootScope = _$rootScope_;
        defer = _$q_.defer();
    }));

    describe('addToQueue',function () {
        it('should return defered object', inject(
            function (msgService){
                var data = {test:123};
                var response = msgService.addToQueue(data);
                expect(response).toEqual(defer.promise);
            })
        )
    });

    describe('deleteFromQueue', function(){
        it('should delete if object exist in queue', inject(
            function(msgService) {
                var data = {
                    callbackID: 123
                };
                msgService.addToQueue(data);
                var responseTrue = msgService.deleteFromQueue({callbackID:123}),
                responseFalse = msgService.deleteFromQueue({callbackID:321});
                expect(responseTrue).toBe(true);
                expect(responseFalse).toBe(false);
            })
        )
    });

    describe('clearQueue', function(){
        it('should empty queue', inject(
            function(msgService) {
                function data(){
                    return {
                        callbackID: parseInt(Math.random()*1e10)
                    };
                };
                msgService.addToQueue(data());
                msgService.addToQueue(data());

                var response = msgService.clearQueue({callbackID:123});
                expect(response).toBe(true);
            })
        )
    });

    describe('read', function(){
        it('should should do action in cmd', inject(
            function(msgService, $rootScope) {


                var data = {
                    callbackID: 123,
                    cmd: 'task_list',
                    tasklist: '123'
                };
                msgService.addToQueue(data);

                var response = msgService.read(data);
                $rootScope.$on('task_list', function(data){
                    expect(data).toEqual('123');
                });
                expect(response).toBe(true);
            })
        )
    });

})