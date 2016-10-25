/**
 * @license Ulakbus-UI
 * Copyright (C) 2015 ZetaOps Inc.
 *
 * This file is licensed under the GNU General Public License v3
 * (GPLv3).  See LICENSE.txt for details.
 */

/*describe('interceptor module', function () {

    beforeEach(module('ulakbus'));

    var $httpBackend, $rootScope;
    beforeEach(inject(function ($injector) {
        //$httpBackend = $injector.get('$httpBackend');
        $rootScope = $injector.get('$rootScope');
    }));

    describe('http interceptor', function () {
        it('should handle errors properly', inject(function ($http, $rootScope, RESTURL) {
            this.statuses = [-1, 404, 500];

            angular.forEach(this.statuses, function (value, key) {
                var resp = {data: {title: 'test', description: 'test', is_login: true}};
                //if (modal) { resp.data.error = 'some error'; }
                $httpBackend.expectGET(RESTURL.url + 'testforerror').respond(value, resp);

                var listener = jasmine.createSpy('listener');
                $rootScope.$on('alertBox', listener);

                $http.get(RESTURL.url + 'testforerror').error(function (data) {
                    expect(listener).toHaveBeenCalled();
                });
                $httpBackend.flush();
            });


            var resp2 = {data: {title: 'test', description: 'test', is_login: true, error: 'test error'}};
            $httpBackend.expectGET(RESTURL.url + 'testforerror2').respond(500, resp2);

            var listener2 = jasmine.createSpy('listener2');
            $rootScope.$on('alertBox', listener2);

            $http.get(RESTURL.url + 'testforerror2').error(function (data) {
                expect(listener2).toHaveBeenCalled();
            });
            $httpBackend.flush();


            var resp3 = {is_login: true, _debug_queries: [{query: ''}]};
            $httpBackend.expectGET(RESTURL.url + 'testforerror3').respond(200, resp3);

            $http.get(RESTURL.url + 'testforerror3').success(function (data) {
                expect($rootScope.debug_queries[0].queries).toEqual([{query: ''}]);
            });
            $httpBackend.flush();


        }));
    });
})*/