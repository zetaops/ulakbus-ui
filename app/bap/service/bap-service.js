/**
 * @license Ulakbus-UI
 * Copyright (C) 2015 ZetaOps Inc.
 *
 * This file is licensed under the GNU General Public License v3
 * (GPLv3).  See LICENSE.txt for details.
 */

'use strict';
angular.module('ulakbusBap')
/**
 * @memberof ulakbusBap
 * @ngdoc factory
 * @name Generator
 * @description form service's Generator factory service handles all generic form operations
 */
.factory('Generator', function ($http, RESTURL) {
    var generator = {};
    /**
     * @memberof ulakbusBap
     * @ngdoc function
     * @name makeUrl
     * @description this function generates REST endpoint by combining backend url and the related wf name
     * @param wfName
     * @returns {string}
     */
    generator.makeUrl = function (wfName) {
        return RESTURL.url + wfName;
    };
    /**
     * @memberof ulakbusBap
     * @ngdoc function
     * @name generateParam
     * @description generateParam is a function to generate required params to send backend api.
     * backend needs that params to work without errors
     * @param {object} scope
     * @param {object} routeParams
     * @returns {object} scope
     */
    generator.generateParam = function (scope, routeParams) {
        scope.url = routeParams.wf;

        angular.forEach(routeParams, function (value, key) {
            if (key.indexOf('_id') > -1 && key !== 'param_id') {
                scope.param = key;
                scope.param_id = value;
            }
        });

        scope.form_params = {
            //cmd: cmd,
            // model name in ulakbus
            model: routeParams.model,
            // generic value passing by backend. would be any of these: id, personel_id, etc.
            param: scope.param || routeParams.param,
            // generic value passing by backend. would be the value of param
            id: scope.param_id || routeParams.param_id,
            wf: routeParams.wf,
            object_id: routeParams.key,
            filters: {},
            token: routeParams.token
        };

        if (scope.param_id) {
            scope.form_params.filters[scope.param] = {values: [scope.param_id], type: 'check'};
        }

        scope.model = scope.form_params.model;
        scope.wf = scope.form_params.wf;
        scope.param = scope.form_params.param;
        scope.param_id = scope.form_params.id;
        return scope;
    };

    /**
     * @memberof ulakbusBap
     * @ngdoc function
     * @name get_wf
     * @description get_wf is the main function for client_cmd based api calls
     * based on response content it redirects to related path/controller with pathDecider function
     * @param scope
     * @returns {*}
     */
    generator.get_wf = function (scope) {
        debugger;
        return $http.post(generator.makeUrl(scope.form_params.wf), {})
            .success(function (response, status, headers, config) {
                debugger;
                return generator.pathDecider(data.client_cmd || ['list'], scope, data);
            });
    };


    return generator;
});