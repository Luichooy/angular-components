/**
 * @Author: luichooy
 * @Date:   2017-06-19 14:06
 * @Email:  luichooy@163.com
 * @Last modified by:   luichooy
 * @Last modified time: 2017-07-13 13:07
 */





angular.module('app').directive('checkbox',[function(){
    return {
        restrict: 'E',
        replace: true,
        transclude: true,
        templateUrl: '/static/tpl/checkbox.html',
        scope: {
            id: '@',
            value: '@?',
            ngTrueValue: '=?',
            ngFalseValue: '=?',
            ngModel: '='
        },
        controller: function($scope,$element){
            console.log($scope.ngModel)
        },
        link: function(scope,elem,attrs){
            scope.checked = false;

            if('disabled' in attrs){
                elem.find('input').attr('disabled',true);
                elem.find('label').addClass('disabled');
            }
            if('checked' in attrs){
                scope.checked = true;
            }
        }
    }
}]);
