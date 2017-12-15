/**
 * @Author: hangbale
 * @Date:   2017-06-12
 * @Email:  571312070@qq.com
 * @Last modified by:   hangbale
 * @Last modified time: 2017-06-19
 */



angular.module('app')
.directive('breadcrumb', ['$state', '$rootScope', function ($state, $rootScope) {
    return {
        restrict: 'E',
        scope: {
            separator: '@'
        },
        template: '<div class="breadcrumb">\
            <ul class="breadcrumb-list">\
                <li class="breadcrumb-item" ng-repeat="item in matched track by $index">\
                    <a ui-sref="{{item.name}}">{{item.title}}</a>\
                    <span class="separator" ng-show="!$last">&nbsp;{{separator}}&nbsp;</span>\
                </li>\
            </ul>\
        </div>',
        link: function (scope, ele, attr) {
            scope.matched = [];
            var matched;

            function update () {
                scope.matched = [];
                var matched = $state.$current.path;
                for (var i = 0; i < matched.length; i++) {
                    scope.matched.push(matched[i].self);
                }
            }
            update();
            scope.$on('$stateChangeSuccess', function (e) {
                update();
            })

        }
    }
}])
