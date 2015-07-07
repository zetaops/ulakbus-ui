/**
 * Copyright (C) 2015 ZetaOps Inc.
 *
 * This file is licensed under the GNU General Public License v3
 * (GPLv3).  See LICENSE.txt for details.
 */

var form_generator = angular.module('formService', ['general']);

form_generator.factory('Generator', function ($http, $q, $log, $timeout, RESTURL, FormDiff) {
    var generator = {};
    generator.generate = function (modelObject) {
        return generator.group(modelObject);
    };
    generator.group = function (form_items) {
        return form_items;
    };
    generator.get_form = function (url, getParams) {
        //if (getParams) {
        //    // if form for edit then url will be
        //    var params = "";
        //    for (var k in getParams) {
        //        params += k + "=" + getParams[k] + "&";
        //    }
        //    var formUrl = RESTURL.url + url + '?' + params;
        //} else {
        //    // if form for create then url will be
        //    var formUrl = RESTURL.url + url;
        //}
        console.log(getParams);
        return $http
            .post(RESTURL.url + url, getParams)
            .then(function (res) {
                if (res.status == 200) {
                    console.log(res);
                    return generator.generate(res.data);
                }
                // todo: cover all other exceptions (4xx, 5xx)
            });
    };
    generator.isValidEmail = function (email) {
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
    generator.submit = function (url, $scope) {
        var get_diff = FormDiff.get_diff($scope.model,$scope.initialModel);
        $log.info(get_diff);
        $http.post(RESTURL.url + url, get_diff).then(function (res) {
            // todo: for now fake rest api returns 'ok' no data to
            // manipulate on ui. therefor used just a log
            $log.info(res);
        });
    };
    return generator;
});