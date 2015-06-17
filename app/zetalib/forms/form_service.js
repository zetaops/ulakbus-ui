/**
 * Copyright (C) 2015 ZetaOps Inc.
 *
 * This file is licensed under the GNU General Public License v3
 * (GPLv3).  See LICENSE.txt for details.
 */

var form_generator = angular.module('formService', []);

form_generator.factory('Generator', function ($http, $q, $timeout, RESTURL) {
    var generator = {};
    generator.generate = function (modelObject) {
        return generator.group(modelObject);
    };
    generator.group = function (form_items) {
        return form_items;
    };
    generator.get_form = function (url, getParams) {
        var params;
        for (var k in getParams) {
            params += k + "=" + getParams[k] + "&";
        }
        return $http
            .get(RESTURL.url + url + '?' + params)
            .then(function (res) {
                if (res.status == 200) {
                    // todo: remove 0 index with real api
                    return generator.generate(res.data[0]);
                }
            });
    };
    generator.isValidEmail = function(email){
        var re = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;
        return re.test(email);
    };
    generator.asyncValidators = {
        emailNotValid: function (value) {
            var deferred = $q.defer();
            $timeout(function () {
                if (generator.isValidEmail(value)) {
                    deferred.resolve();
                } else {
                    deferred.reject();
                }
            }, 500);
            return deferred.promise;
        }
    };
    return generator;
});