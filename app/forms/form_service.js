/**
 * Copyright (C) 2015 ZetaOps Inc.
 *
 * This file is licensed under the GNU General Public License v3
 * (GPLv3).  See LICENSE.txt for details.
 */

var form_generator = angular.module('formService', []);

form_generator.factory('Generator', function ($http, RESTURL) {
    var generator = {};
    generator.generate = function (modelObject) {
        return generator.group(modelObject);
    };
    generator.group = function (form_items) {
        return form_items;
    };
    generator.get_form = function (url, getParams) {
        return $http
            .get(RESTURL.url + url + getParams)
            .then(function (res) {
                if (res.data) {
                    return res.data;
                }
            });
    };
    return generator;
});