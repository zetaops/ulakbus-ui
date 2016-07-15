/**
 * Copyright (C) 2015 ZetaOps Inc.
 *
 * This file is licensed under the GNU General Public License v3
 * (GPLv3).  See LICENSE.txt for details.
 *
 * @author Vladimir Baranov
 */

angular.module("ulakbus")

    .service("Utils", function(){
        var self = this;

        /**
         * @param list {Array} Array of objects to group
         * @param propName {String} property name to group array by
         * @returns {Object}
         */

        this.groupBy = function (list, propName) {
            return list.reduce(function(acc, item) {
                (acc[item[propName]] = acc[item[propName]] || []).push(item);
                return acc;
            }, {});
        };
    });
