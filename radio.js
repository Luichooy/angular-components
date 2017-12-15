/**
 * @Author: luichooy
 * @Date:   2017-06-20 10:06
 * @Email:  luichooy@163.com
 * @Last modified by:   luichooy
 * @Last modified time: 2017-07-13 13:07
 */





angular.module('app').directive('radio',function(){
    return {
        restrict: 'E',
        replace: true,
        transclude: true,
        templateUrl: '/static/tpl/radio.html',
        scope: {
            radioId: '=',
            name: '@',
            value: '=',
            ngModel: '='
        },
        controller: function(){

        },
        link: function(scope){

        }
    }
});
