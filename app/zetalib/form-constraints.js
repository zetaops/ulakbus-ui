/**
 * Copyright (C) 2015 ZetaOps Inc.
 *
 * This file is licensed under the GNU General Public License v3
 * (GPLv3).  See LICENSE.txt for details.
 *
 * @author Evren Kutar
 */
angular.module('ulakbus')
    .factory('FormConstraints', function ($q, $log, $timeout) {
        // Generic functions
        /**
         * gets expression and returns reject/resolve promise
         * @param condition {Expression}
         * @returns {Promise}
         */
        var cond = function (condition) {
            return !condition;
        };
        var cond_generator = function () {
            return {
                lt: function (a, b) {
                    return !(a < b);
                },
                gt: function (a, b) {
                    return !(a > b);
                }
            }
        };
        /**
         *
         * @param va1 {String} value of input
         * @param val2 {Array} values of other inputs
         * @param condition {String}
         */
        var cond_multiple = function (val1, val2, condition) {
            var valid = true;
            angular.forEach(val2, function (value, key) {
                inputval = angular.element(document.querySelector('#' + value)).val();
                if (cond_generator()[condition](val1, inputval)) {
                    valid = false;
                }
            });
            return valid;
        };

        var fo_co = {};
        /**
         * lesser than
         * @param value {String,Number}
         * @param ref_val {String,Number}
         * @param type {String}
         * @returns {Promise}
         */
        fo_co.lt = function (value, ref_val, input_name) {
            return cond(value > ref_val);
        };
        /**
         * lesser than date
         * @param value {String,Number}
         * @param ref_val {String,Number}
         * @param type {String}
         * @returns {Promise}
         */
        fo_co.lt_date = function (value, ref_val, input_name) {
            return cond(value > ref_val);
        };
        /**
         * lesser than multiple
         * @param value {String,Number}
         * @param ref_vals {Array}
         * @param type {String}
         * @returns {Promise}
         */
        fo_co.ltm = function (value, ref_vals, input_name) {
            return cond_multiple(value, ref_vals, 'lt');
        };
        /**
         * greater than
         * @param value {String,Number}
         * @param ref_val {String,Number}
         * @param type {String}
         * @returns {Promise}
         */
        fo_co.gt = function (value, ref_val, input_name) {
            return cond(value < ref_val);
        };
        /**
         * greater than date
         * @param value {String,Number}
         * @param ref_val {String,Number}
         * @param type {String}
         * @returns {Promise}
         */
        fo_co.gt_date = function (value, ref_val, input_name) {
            return cond(value < ref_val);
        };
        /**
         * greater than multiple
         * @param value {String,Number}
         * @param ref_vals {Array}
         * @param type {String}
         * @returns {Promise}
         */
        fo_co.gtm = function (value, ref_vals, input_name) {
            return cond_multiple(value, ref_vals, 'gt');
        };
        /**
         * disable fields when input has value
         * @param value {String,Number}
         * @param fields {Array} they must be schemaform schema property items
         * @param type {String}
         */
        fo_co.selectbox_fields = function (value, fields, input_name) {
            // use disableErrorState to disable hidden field validations

            var form_items = angular.element(document.querySelectorAll('bootstrap-decorator'));
            angular.forEach(form_items, function (v, k) {
                angular.element(v).removeClass('hide');
                var checkpoint;
                try{
                    if (angular.isDefined(v.querySelector('input')) && v.querySelector('input') !== null ) {
                        checkpoint = v.querySelector('input').name
                    } else {
                        checkpoint = v.querySelector('select').name;
                    }
                    if (checkpoint !== input_name[0] && checkpoint !== fields[value][0]) {
                        angular.element(v).addClass('hide');
                        $log.debug(checkpoint, fields[value], angular.isDefined(fields[checkpoint]));
                    }
                } catch(e){
                    $log.error(e.message);
                }
            });
        };
        return fo_co;
    });