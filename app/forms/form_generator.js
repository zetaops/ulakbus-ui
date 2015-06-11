/**
 * Copyright (C) 2015 ZetaOps Inc.
 *
 * This file is licensed under the GNU General Public License v3
 * (GPLv3).  See LICENSE.txt for details.
 */

var form_generator = angular.module('FormGenerator', []);

form_generator.factory('Generator', function(){
    var generator ={};
    generator.generate = function(modelObject){
        return generator.group(modelObject);
    };
    generator.group = function(form_items){
        return form_items;
    };
    return generator;
});