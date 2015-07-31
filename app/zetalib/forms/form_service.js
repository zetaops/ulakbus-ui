/**
 * Copyright (C) 2015 ZetaOps Inc.
 *
 * This file is licensed under the GNU General Public License v3
 * (GPLv3).  See LICENSE.txt for details.
 */

var form_generator = angular.module('formService', ['general']);

form_generator.factory('Generator', function ($http, $q, $log, $timeout, RESTURL, FormDiff) {
    var generator = {};
    generator.makeUrl = function (url) {
        return RESTURL.url + url;
    };
    generator.generate = function (scope, forms) {
        for (var key in forms)
            scope[key] = forms[key];
        scope.initialModel = angular.copy(scope.model);
        scope.form.push(
            {
                type: "submit",
                title: "Save"
            }
        );
        scope.isCollapsed = false;
        scope.object_id = scope.form_params['object_id'];
        return generator.group(scope);
    };
    generator.group = function (formObject) {
        return formObject;
    };
    generator.get_form = function (scope) {
        return $http
            .post(generator.makeUrl(scope.url), scope.form_params)
            .then(function (res) {
                return generator.generate(scope, res.data.forms);
                // todo: cover all other exceptions (4xx, 5xx)
            });
    };
    generator.get_list = function (scope) {
        return $http
            .post(generator.makeUrl(scope.url), scope.form_params)
            .then(function (res) {
                return res;
                // todo: cover all other exceptions (4xx, 5xx)
            });
    };
    generator.get_single_item = function (scope) {
        return $http
            .post(generator.makeUrl(scope.url), scope.form_params)
            .then(function (res) {
                return res;
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
    generator.submit = function ($scope) {
        if ($scope.object_id) {
            var get_diff = FormDiff.get_diff($scope.model, $scope.initialModel);
            var data = {
                "object_id": $scope.object_id,
                "form": get_diff,
                "cmd": "do"
            };
        }
        else {
            data = {"form": $scope.model, "cmd": "do"};
        }
        return $http
            .post(generator.makeUrl($scope.url), data)
            //.then(function (res) {
            //    // todo: for now fake rest api returns 'ok' no data to
            //    // manipulate on ui. therefor used just a log
            //    $log.info(res);
            //});
    };
    return generator;
});