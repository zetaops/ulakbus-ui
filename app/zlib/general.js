/**
 * Created by Evren Kutar on 09/06/15.
 */

//angular.module('FormDiff', [])
/**
 *  this file contains general functions of app.
 */
var general = angular.module('general', []);

general.factory('FormDiff', function(){
    /**
     * function to return diff of models of submitted form
     * @type {{}}
     * @params obj1, obj2
     */
    var formDiff = {};
    formDiff.get_diff = function (obj1, obj2) {
        var result = {};
        for (key in obj1) {
            if (obj2[key] != obj1[key]) result[key] = obj2[key];
            if (typeof obj2[key] == 'array' && typeof obj1[key] == 'array')
                result[key] = arguments.callee(obj1[key], obj2[key]);
            if (typeof obj2[key] == 'object' && typeof obj1[key] == 'object')
                result[key] = arguments.callee(obj1[key], obj2[key]);
        }
        return result;
    };
    return formDiff;
});