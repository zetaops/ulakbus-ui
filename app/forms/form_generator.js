/**
 * Created by Evren Kutar on 09/06/15.
 */

var form_generator = angular.module('FormGenerator', []);

form_generator.factory('Generator', function(){
    var generator ={};
    generator.generate = function(modelObject){
        var form = modelObject;
        return form;
    };
    return generator;
});