/**
 * Copyright (C) 2015 ZetaOps Inc.
 *
 * This file is licensed under the GNU General Public License v3
 * (GPLv3).  See LICENSE.txt for details.
 *
 * @author Vladimir Baranov
 */

angular.module("ulakbus")

.service("Utils", function($rootScope, $q) {
    var self = this;

    // check if obj1 has properties values equal to corresponding properties in obj2
    function hasEqualProperties(obj1, obj2) {
        var result = true;
        for (var prop in obj2) {
            if (obj2.hasOwnProperty(prop)) {
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

    this.groupBy = function(list, propName, initialObject) {
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
    this.deleteWhere = function(list, condition) {
        for (var i = 0; i < list.length; i++) {
            if (hasEqualProperties(list[i], condition)) {
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
    this.findWhere = function(list, condition) {
        for (var i = 0; i < list.length; i++) {
            if (hasEqualProperties(list[i], condition)) {
                return list[i];
            }
        }
    }

    /**
     * @param collection {Array|Object} Array of objects to group
     * @param callback {Function} Callback to apply to every element of the collection
     * @returns None
     */
    this.iterate = function(collection, callback) {
        angular.forEach(collection, function(val, key) {
            // don't iterate over angular binding indexes
            if (key.indexOf && key.indexOf('$$') == 0) {
                return;
            }
            callback(val, key);
        })
    };

    /**
     * 
     * returns date formated like   "5 Eylül 2016 - Pazartesi" 
     * @param {Date} data
     * @returns {string}
     */
    this.genDate = function(date) {
        date = date.contructor == Date ? date : new Date(date);
        var months = new Array("Ocak", "Şubat", "Mart", "Nisan", "Mayıs", "Haziran", "Temmuz", "Ağustos", "Eylül", "Ekim", "Kasım", "Aralık");
        var days = new Array("Pazar", "Pazartesi", "Salı", "Çarşamba", "Perşembe", "Cuma", "Cumartesi");

        var year = date.getFullYear();
        var month = date.getMonth();
        var day = date.getDate();
        var weekly = date.getDay();
        return day + " " + months[month] + " " + year + " - " + days[weekly];
    }

    this.formatDate = function(date){
        date = date.contructor == Date ? date : new Date(date);
        var yil = date.getFullYear();
        var ay = addzero(date.getMonth()+1);
        var gun = addzero(date.getDate());
        return gun + "." + ay + "." + yil

        function addzero(number){
            var num = ""+number;
            return num.length == 1 ? "0" + num : num;
        }
    }

    // a method for saving files to disk
    this.saveToDisk = function(fileURL, fileName) {
        // for non-IE
        if (!window.ActiveXObject) {
            var save = document.createElement('a');
            save.href = fileURL;
            save.target = '_blank';
            save.download = fileName || 'unknown';

            var evt = new MouseEvent('click', {
                'view': window,
                'bubbles': true,
                'cancelable': false
            });
            save.dispatchEvent(evt);

            (window.URL || window.webkitURL).revokeObjectURL(save.href);
        }

        // for IE < 11
        else if ( !! window.ActiveXObject && document.execCommand)     {
            var _window = window.open(fileURL, '_blank');
            _window.document.close();
            _window.document.execCommand('SaveAs', true, fileName || fileURL)
            _window.close();
        }
    }
})


.filter("formatJson", function() {
    return function(val) {
        try {
            return JSON.stringify(val, null, 4);
        } catch (e) {
            return val;
        }
    }
});