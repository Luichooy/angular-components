/**
 * @Author: hangbale
 * @Date:   2017-06-23
 * @Email:  571312070@qq.com
 * @Last modified by:   hangbale
 * @Last modified time: 2017-06-23
 */



angular.module('app')
.directive('viewtypeToggle', function () {
    return {
        restrict: 'A',
        link: function (scope, ele, attr) {
            var types = attr.viewtypeToggle;
            types = types.split(',');
            var index = 0;
            scope.viewtype = types[index];
            var iconMap = [
                '&#xe60d;',
                '&#xe606;'
            ]
            function changeIcon() {
                var iTag = ele.find('i');
                iTag.html(iconMap[index]);
            }
            ele.on('click', function () {
                index = index === 0 ? 1 : 0;
                scope.viewtype = types[index];
                scope.$apply();
                changeIcon();
            })
        }
    }
})
