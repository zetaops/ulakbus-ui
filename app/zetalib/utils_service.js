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
            var result = true
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
         * @returns {Object}
         */

        this.groupBy = function (list, propName) {
            return list.reduce(function(acc, item) {
                (acc[item[propName]] = acc[item[propName]] || []).push(item);
                return acc;
            }, {});
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
        }

        /**
         * @param collection {Array|Object} Array of objects to group
         * @param callback {Function} Callback to apply to every element of the collection
         * @returns None
         */
        this.iterate = function(collection, callback){
            angular.forEach(collection, function(val, key){
                // don't iterate over angular binding indexes
                if (key.indexOf && key.indexOf('$$') == 0){
                    return;
                }
                callback(val, key);
            })
        }
    })


    .filter("formatJson", function(){
        return function(val){
            try {
                return JSON.stringify(val, null, 4);
            } catch(e){
                return val;
            }
        }
    });
