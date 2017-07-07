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
    return generator;
});