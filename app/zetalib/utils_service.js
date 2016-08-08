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

        // check if obj1 has properties values equal to corresponding properties in obj2
        function hasEqualProperties(obj1, obj2){
            var result = true;
            for (var prop in obj2){
                if(obj2.hasOwnProperty(prop)){
                    result = result && obj2[prop] == obj1[prop];
                }
            }
            return result;
        }

        /**
         * @param list {Array} Array of objects to group
         * @param propName {String} property name to group array by
         * @param initialObject {Object} initial object for groups setup
         * @returns {Object}
         */

        this.groupBy = function (list, propName,  initialObject) {
            if (!initialObject) initialObject = {};
            return list.reduce(function(acc, item) {
                (acc[item[propName]] = acc[item[propName]] || []).push(item);
                return acc;
            }, initialObject);
        };

        /**
         * @param list {Array} Array of objects to group
         * @param condition {Object} conditions object. If object in collection has same values as in conditions object it will be removed
         * @returns {Object}|undefined removed object or undefined
         */
        this.deleteWhere = function(list, condition){
            for (var i = 0; i < list.length; i++){
                if (hasEqualProperties(list[i], condition)){
                    list.splice(i, 1);
                    return list[i];
                }
            }
        };

        /**
         * @param list {Array} Array of objects to group
         * @param condition {Object} conditions object. If object in collection has same values as in conditions object found object will be returned
         * @returns {Object}|undefined
         */
        this.findWhere = function(list, condition){
            for (var i = 0; i < list.length; i++){
                if (hasEqualProperties(list[i], condition)){
                    return list[i];
                }
            }
        }
    });
