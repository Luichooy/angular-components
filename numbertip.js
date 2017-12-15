/**
 * @Date:   2017-07-21 18:07
 * @Email:  luichooy@163.com
 * @Last modified time: 2017-07-24 16:07
 */





angular.module('app').directive('numberTip', ['$compile', function ($compile) {
    return {
        restrict: 'A',
        scope: {
            charNum: '@'
        },
        controller: function ($scope, $element, $attrs) {

        },
        link: function (scope, elem, attrs) {
            var posiLeft = elem[0].offsetLeft;

            scope.show_num = scope.charNum;

            elem[0].oninput = function (event) {
                var value = event.target.value;

                scope.calsulateTextShow(value, event);
            }

            elem.css('position', 'relative');
            var tip = angular.element('<p>还可输入<strong><i style="color:red;">{{show_num}}</i></strong> 个字符</p>');
            tip.css({
                "position": "absolute",
                "left": posiLeft + "px",
                "padding": "11px 0",
                "fontSize": "14px",
                "z-index": 20
            });
            $compile(tip)(scope);
            elem.after(tip);



            scope.calsulateTextShow = function (value, event) {
                var max_chars = scope.charNum;
                var cur_num = max_chars - scope.getStrLen(value);

                if (cur_num >= 0) {
                    scope.show_num = cur_num;
                    console.log(scope.show_num)
                } else {
                    scope.show_num = 0;

                    var realLen = 0;
                    for (var i = 0; i < value.length; i++) {
                        realLen += scope.getStrLen(value[i]);

                        if (realLen > max_chars) {
                            event.target.value = value.slice(0, (i));
                            break;
                        }
                    }
                }

                scope.$digest();
            }

            scope.getStrLen = function (str) {
                return str.replace(/[^\x00-\xff]/g, "**").length;
            }
        }
    }
}]);
