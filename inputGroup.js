/**
 * @Date:   2017-07-17 12:07
 * @Email:  luichooy@163.com
 * @Last modified time: 2017-07-17 15:07
 */



/*
 * @size --- 可选项   组件尺寸，可选值： small,normal,large   默认值：normal
 * @beforeAddon --- 可选项   input前要显示的字符串内容
 * @afterAddon --- 可选项   input后要显示的字符串内容
 * @type: --- input类型 可选值  text/number/email/password/url/tel
 * @placeholder --- input的 placeholder
 * @ngModel --- input的原生 双向绑定
 */

angular.module('app').directive('inputGroup', [function () {
    return {
        restrict: 'E',
        // templateUrl: 'static/tpl/inputGroup.html',
        template: '<div class="input-group" ng-show="show">\
                        <span class="before-addon" ng-if="beforeAddon">{{beforeAddon}}</span>\
                        <input type="{{type}}" placeholder="{{placeholder}}" ng-model="ngModel">\
                        <span class="after-addon" ng-if="afterAddon">{{afterAddon}}</span>\
                    </div>',
        scope: {
            size: '@',
            beforeAddon: '@?',
            afterAddon: '@?',
            type: '@',
            placeholder: '@',
            ngModel: '='
        },
        controller: function ($scope) {

        },
        link: function (scope, elem, attrs) {
            scope.show = true;

            if (!scope.type) {
                scope.type = 'text';
            } else {
                if (scope.type !== 'text' &&
                    scope.type !== 'number' &&
                    scope.type !== 'email' &&
                    scope.type !== 'password' &&
                    scope.type !== 'url' &&
                    scope.type !== 'tel'
                ) {
                    scope.show = false;
                    throw new Error('<input-group></input-group>type的值必须为："text || number || email || password || url || tel"');
                }
            }

            var root_elem = elem.find('div');
            var input_elem = elem.find('input');

            var $small = '30px';
            var $normal = '36px';
            var $large = '42px';

            if (scope.size == 'small') {
                root_elem.css({
                    'height': $small,
                    'line-height': $small
                });
            } else if (scope.size == 'large') {
                root_elem.css({
                    'height': $large,
                    'line-height': $large
                });
            } else {
                root_elem.css({
                    'height': $normal,
                    'line-height': $normal
                });
            }


            if (!scope.beforeAddon) {
                input_elem.css('border-top-left-radius', '5px');
                input_elem.css('border-bottom-left-radius', '5px');
            }

            if (!scope.afterAddon) {
                input_elem.css('border-top-right-radius', '5px');
                input_elem.css('border-bottom-right-radius', '5px');
            }
        }
    };
}]);
