/**
 * @Author: luichooy
 * @Date:   2017-06-15 18:06
 * @Email:  luichooy@163.com
 * @Last modified by:
 * @Last modified time: 2017-07-18 19:07
 */





angular.module('app').directive('pagination', function () {
    return {
        restrict: 'E',
        replace: true,
        // templateUrl: '/static/tpl/pagination.html',
        template: '<div class="pagination">\
            <div class="page-total">共{{total}}条</div>\
            <div class="page-size">\
                <select ng-model="pageSize">\
                    <option ng-repeat="option in options" ng-value="{{option}}">{{option}}条/页</option>\
                </select>\
            </div>\
            <div class="pager">\
                <ul>\
                    <li class="btn btn-prev" ng-class="{disabled:prevActive}" ng-click="prev()"><a href="javascript:;"><</a></li>\
                    <li ng-repeat="page in pages track by $index" ng-class="{active: page === currentPage,icon:page === \'...\',\'icon-prev\':page === \'...\' && $index === 1,\'icon-next\':page === \'...\' && $index === 7}" ng-click="clickPage(page,$index,$first,$last)" class="btn" ><a href="javascript:;">{{page===\'...\'?\'\':page}}</a></li>\
                    <li class="btn btn-next" ng-class="{disabled:nextActive}" ng-click="next()"><a href="javascript:;">></a></li>\
                </ul>\
            </div>\
        </div>',
        scope: {
            total: '=',
            currentPage: '=',
            pageSize: '=',
            options: '='
        },
        controller: function ($scope, $element, $attrs, $transclude) {

        },
        link: function (scope, elem, attrs) {

            // scope.otions 为可选项，如果没有传值，则用默认值
            scope.options = scope.options || [5, 10, 15, 20, 30, 50];

            /*  scope.pageSize 为可选项，
             *  如果没有传值，则scope.options选项必须有，且默认为scope.options的第一项
             *  如果传值，必须为scope.options数组中的值，否则默认为scope.options的第一项
             */
            scope.pageSize = scope.options.indexOf(scope.pageSize) > -1 ? scope.pageSize : scope.options[0];

            // 总页码
            scope.pageCount = Math.ceil(scope.total / scope.pageSize);

            // 当前页如果大于总页数，则将当前页重置为1
            scope.currentPage = scope.currentPage <= scope.pageCount ? scope.currentPage : 1;

            // 页码数组
            scope.pages = [];

            /*
             * scope.first---第一页
             * scope.last---最后一页
             */
            scope.first = 1;
            scope.last = scope.pageCount;

            // 控制prev/next按钮的disabled
            scope.prevActive = false;
            scope.nextActive = false;

            // 监控当前页码，当页码为第一个或最后一个时，控制prev/next按钮的样式
            scope.$watch('currentPage', function (newVal) {
                // 当前页为第一页是，prev---disabled
                if (newVal === 1) {
                    scope.prevActive = true;
                } else {
                    scope.prevActive = false;
                }

                // 当前页是最后一页，next---disabled
                if (newVal === scope.last) {
                    scope.nextActive = true;
                } else {
                    scope.nextActive = false;
                }
                scope.pages = [];
                scope.getPagination(newVal);
            });


            scope.clickPage = function (page, index, first, last) {
                if (page === '...') {
                    if (index === 7) {
                        scope.currentPage += 5;
                    } else if (index == 1) {
                        scope.currentPage -= 5;
                    }
                } else {
                    scope.currentPage = page;
                }
            };

            scope.prev = function () {
                if (scope.currentPage === 1) {
                    return;
                } else {
                    scope.currentPage--;
                }
            };

            scope.next = function () {
                if (scope.currentPage === scope.last) {
                    return;
                }
                scope.currentPage++;
            }

            scope.getPagination = function (currentPage) {

                // 总页数小于8的情况
                if (scope.pageCount < 9) {
                    for (var i = 1; i <= scope.pageCount; i++) {
                        scope.pages.push(i);
                    }
                } else {
                    // 总页数大于等于9的情况

                    // 当前页小于6的情况
                    // 左边没有
                    if (currentPage < 6) {
                        for (i = 1; i < 8; i++) {
                            scope.pages.push(i);
                        }
                        scope.pages.push('...');
                        scope.pages.push(scope.pageCount);
                    }

                    // scope.pageCount - (currentPage-2) <= 5 的情况
                    // 右边没有的情况   --- 即右边显示6个数
                    if (scope.pageCount - (currentPage - 2) <= 6 && currentPage >= 6) {
                        scope.pages.push(1);
                        scope.pages.push('...');
                        for (var i = scope.pageCount - 6; i <= scope.pageCount; i++) {
                            scope.pages.push(i);
                        }
                    }


                    // 两边都有
                    if (currentPage >= 6 && scope.pageCount - (currentPage - 2) > 6) {
                        scope.pages.push(1);
                        scope.pages.push('...');
                        for (var i = currentPage - 2; i <= currentPage + 2; i++) {
                            scope.pages.push(i);
                        }
                        scope.pages.push('...');
                        scope.pages.push(scope.pageCount);
                    }
                }
            }
        }
    }
});
