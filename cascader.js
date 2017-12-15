/**
 * @Author: luichooy
 * @Date:   2017-07-07 14:07
 * @Email:  luichooy@163.com
 * @Last modified by:
 * @Last modified time: 2017-08-03 09:08
 */




/* 参数说明
 * width---String   可选值，设置cascader的宽度  默认为222px     例如 width="300px"
 * only-show-last ---cascader属性  写上该属性，则只显示选择结果的最后一级
 * data --- Array   cascader数据源，对象数组  数组元素： {label:'显示文本'，value:'值',children: []}
 * 通过在数据源中设置 disabled 字段来声明该选项是禁用的
 * ng-model --- 绑定父scope中的数组，用来存储cascader选择的值
 */

angular.module('app').directive('cascader', ['$rootScope', '$compile', '$document', function ($rootScope, $compile, $document) {
    return {
        restrict: 'E',
        // templateUrl: 'static/tpl/cascader.html',
        template: '<div class="cascader">\
                        <div class="cascader-select" ng-click="toggleMenu();">\
                            <input type="text" class="cascader-input" placeholder="{{placeholder}}" disabled ng-model="show">\
                            <i class="cascader-icon iconfont icon-caret-down"  ng-class="isOpen?\'reserve\':\'\'"></i>\
                        </div>\
                        <div class="cascader-menu-wrapper" ng-show="isOpen">\
                            <ul class="cascader-menu">\
                                <li class="cascader-menu-item clearfix" ng-repeat="option in options" data="{{option}}" ng-class="option.disabled?\'disabled\':\'\'" ng-click="selectItem(option,$event);">\
                                    <span class="left">{{option.label}}</span>\
                                    <i ng-if="option.children" class="right iconfont icon-caretright"></i>\
                                </li>\
                            </ul>\
                        </div>\
                    </div>',
        scope: {
            width: '@?',
            placeholder: '@?',
            options: '=data',
            selected: '=ngModel'
        },
        controller: function ($scope, $attrs) {
            this.isOnlyShowLast = function () {
                if ('onlyShowLast' in $attrs) {
                    return true;
                }
                else {
                    return false;
                }
            };
        },
        link: function (scope, elem, attrs, ctrl) {
            var $cascader = elem.children();
            $cascader.css('width', scope.width);

            // 存放input框中显示的内容
            scope.show = "";

            scope.isOpen = false;

            scope.$watch('selected', function (newVal) {
                scope.show = "";

                angular.forEach(newVal, function (item, index) {
                    scope.show += (item.text + '/');
                });

                // 去掉最后一个 “/”
                scope.show = scope.show.slice(0, -1);

                // 是否只显示最后一级
                scope.only_show_last = ctrl.isOnlyShowLast();

                if (scope.only_show_last) {
                    var arr = scope.show.split('/');
                    scope.show = arr[arr.length - 1];
                }


            }, true);

            scope.toggleMenu = function () {
                scope.isOpen = !scope.isOpen;
            }


            $document[0].onclick = function (event) {
                event.stopPropagation();
                var ROOT_CLASS = 'cascader'
                var target = angular.element(event.target);
                var parent = target;
                var flag = false;
                // console.log(parent.name);
                while (parent && parent[0].localName !== "html") {
                    if (parent.hasClass(ROOT_CLASS)) {
                        flag = true;
                        break;
                    }
                    else {
                        flag = false;
                    }
                    parent = parent.parent();
                }

                // 父元素中没有 ROOT_CLASS，说明点击该组件外部，则关闭menu
                if (!flag) {
                    scope.isOpen = false;
                    scope.$digest();
                }
            }

            scope.selectItem = function (option, event) {

                scope.selected = [];

                // var $elem = angular.element(event.target);
                if (event.target.classList.contains('cascader-menu-item')) {
                    var $elem = angular.element(event.target);
                }
                else {
                    $elem = angular.element(event.target).parent();
                }

                // cascader-menu-item 如果包含类名 disabled  则禁用该选项
                if ($elem.hasClass('disabled')) {
                    return;
                }

                $elem.parent().children().removeClass('active');
                $elem.addClass('active');

                var next = $elem.parent().next();

                // 删除点击的菜单  下面的菜单
                while (next.length) {
                    var temp = next;
                    next = temp.next();
                    temp.remove();
                }

                if (option.children) {
                    scope.addMenu(option, $elem);
                }
                else {

                    var menus = $elem.parent().parent().children();

                    angular.forEach(menus, function (menu) {
                        var $menu = angular.element(menu);
                        var menu_item = $menu.children();

                        angular.forEach(menu_item, function (item) {

                            if (item.classList.contains('active')) {
                                var attr_data_val = JSON.parse(item.getAttribute('data'));
                                var obj = {};
                                obj.value = attr_data_val.value;
                                obj.text = attr_data_val.label;
                                scope.selected.push(obj);
                            }
                        });
                    });

                    // 关闭 menu 下拉框
                    scope.isOpen = false;
                }
            };

            // 动态生成 menu  并编译添加到dom树中
            scope.addMenu = function (option, $elem) {
                var menuScope = scope.$new();
                menuScope.options = option.children;

                var html = '<ul class="cascader-menu">\
                                <li class="cascader-menu-item" ng-repeat="option in options"  ng-class="option.disabled?\'disabled\':\'\'" data="{{option}}" ng-click="selectItem(option,$event);">\
                                    <span class="left">{{option.label}}</span>\
                                    <i ng-if="option.children" class="right iconfont icon-caretright"></i>\
                                </li>\
                            </ul>';
                var template = angular.element(html);
                var menu = $compile(template)(menuScope);
                $elem.parent().parent().append(menu);
            };
        }
    };
}]);
