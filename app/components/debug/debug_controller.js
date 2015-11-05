/**
 * Copyright (C) 2015 ZetaOps Inc.
 *
 * This file is licensed under the GNU General Public License v3
 * (GPLv3).  See LICENSE.txt for details.
 */

'use strict';

app.config(['$routeProvider', function ($routeProvider) {
    $routeProvider
        .when('/debug/list', {
            templateUrl: 'components/debug/debug.html',
            controller: 'DebugCtrl'
        });
}]);

angular.module('ulakbus.debug', ['ngRoute'])
    .controller('DebugCtrl', function ($scope, $rootScope, $location) {
        // todo: define breadcrumb
        //$scope.$on("debug_queries", function (event, data) {
        //    $scope.debug_queries.push(data);
        //});

        $scope.debug_queries = $rootScope.debug_queries;


        //$scope.debug_queries = [{
        //    "url": "http://ulakbus-remote-dev.zetaops.io:18188/notify",
        //    "queries": [
        //        {
        //            "TIMESTAMP": 1446666305.753408,
        //            "TIME": 0.0362,
        //            "BUCKET": "models_personel",
        //            "QUERY_PARAMS": {
        //                "sort": "timestamp desc",
        //                "rows": 1000
        //            },
        //            "QUERY": "tckn:123* AND -deleted:True"
        //        },
        //        {
        //            "TIMESTAMP": 1446666492.017113,
        //            "BUCKET": "models_kurum_disi_gorevlendirme_bilgileri",
        //            "SERIALIZATION": 0.00078,
        //            "SAVE_IS_NEW": true,
        //            "KEY": "ZZjOPrcdfW1w8EASYRastvEWKaA",
        //            "TIME": 0.01684
        //        },
        //        {
        //            "TIMESTAMP": 1446666305.789678,
        //            "BUCKET": "models_personel",
        //            "KEY": "TILjcZZpBzbVXdFMCWkYjNMnDSi",
        //            "TIME": 0.00425
        //        },
        //        {
        //            "TIMESTAMP": 1446666305.798089,
        //            "BUCKET": "models_personel",
        //            "KEY": "2yBUSlyr2WQp4l6xL79ehPCDR35",
        //            "TIME": 0.00335
        //        },
        //        {
        //            "TIMESTAMP": 1446666305.810038,
        //            "BUCKET": "models_personel",
        //            "KEY": "WTbiwac9tjtEQ2TZxmJh7eSb3CF",
        //            "TIME": 0.00548
        //        },
        //        {
        //            "TIMESTAMP": 1446666305.819372,
        //            "BUCKET": "models_personel",
        //            "KEY": "FmV5il0bAIwCBE1Zuk63WXfC9Vd",
        //            "TIME": 0.00305
        //        },
        //        {
        //            "TIMESTAMP": 1446666305.82646,
        //            "BUCKET": "models_personel",
        //            "KEY": "6SZXvENlJKuDtD8e9b1mHxDqc4Y",
        //            "TIME": 0.00305
        //        },
        //        {
        //            "TIMESTAMP": 1446666305.832966,
        //            "BUCKET": "models_personel",
        //            "KEY": "YPjWATvtR54JdY5BxVWYUh5AbeB",
        //            "TIME": 0.04506
        //        },
        //        {
        //            "TIMESTAMP": 1446666305.882205,
        //            "BUCKET": "models_personel",
        //            "KEY": "UGYo52etHUacK5uP1v91oGX8JDU",
        //            "TIME": 0.01335
        //        },
        //        {
        //            "TIMESTAMP": 1446666305.899335,
        //            "BUCKET": "models_personel",
        //            "KEY": "doZJrm6phbFwyuWZk9LYf05u4z",
        //            "TIME": 0.00291
        //        },
        //        {
        //            "TIMESTAMP": 1446666305.906138,
        //            "BUCKET": "models_personel",
        //            "KEY": "CZDKGx57MKufxrZNgNb2j9EQ9Mz",
        //            "TIME": 0.0098
        //        },
        //        {
        //            "TIMESTAMP": 1446666305.919088,
        //            "BUCKET": "models_personel",
        //            "KEY": "BW6nTAnpBQAIuj8LL98wOV1DJMC",
        //            "TIME": 0.00257
        //        }
        //    ]}]

    });