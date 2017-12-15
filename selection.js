/**
 * @Author: luichooy
 * @Date:   2017-06-20 15:06
 * @Email:  luichooy@163.com
 * @Last modified by:   hangbale
 * @Last modified time: 2017-07-19
 */





angular.module('app').directive('mtSelect', ['$document', function ($document) {
    return {
        restrict: 'E',
        // templateUrl: '/static/tpl/selection.html',
        template: '<div class="mt-select">\
            <div class="select-wrapper" ng-click="toggleMenu($event);">\
                <div class="tag-wrapper" ng-if="multiple">\
                    <span class="tag-list">\
                        <span class="tag-item" ng-repeat="item in selected">\
                            <span class="tag-item-text">{{item.label}}</span>\
                            <i class="tag-item-remove iconfont icon-sm-remove" ng-click="removeSelectItem(item,$event);"></i>\
                        </span>\
                    </span>\
                </div>\
                <div class="input-wrapper">\
                    <input type="text" class="select-input" placeholder="{{placeholder}}" ng-model="selected.label">\
                    <i class="select-icon iconfont icon-caret-down" ng-class="isOpen?\'reserve\':\'\'"></i>\
                </div>\
            </div>\
            <div class="option-wrapper" ng-transclude ng-show="isOpen"></div>\
        </div>',
        transclude: true,
        scope: {
            width: '@?',
            placeholder: '@?',
            selected: '=ngModel'
        },
        controller: function ($scope, $attrs) {

            $scope.selected = [];

            this.setResult = function (selected) {
                $scope.selected = [];

                $scope.selected = selected;
            };

            this.isMultiple = function () {
                if ('multiple' in $attrs) {
                    return true;
                }
                else {
                    return false;
                }
            };

            this.closeOption = function () {
                $scope.isOpen = false;
            };

            this.getSelected = function () {
                $scoppe.$watch('selected', function (selected) {
                    return selected;
                });
            }
        },
        link: function (scope, elem, attrs, ctrl) {

            // 是否多选
            scope.multiple = ctrl.isMultiple();

            // 多选情况下  默认宽度为300px
            if (scope.multiple) {
                scope.width = "300px";
            }

            // 设置mt-select的宽度
            var mt_select = elem.children();
            mt_select.css('width', scope.width);


            // 控制 input右侧icon的翻转和 menu的折叠
            scope.isOpen = false;

            scope.toggleMenu = function (event) {
                scope.isOpen = !scope.isOpen;
            }

            scope.removeSelectItem = function (obj, event) {
                event.stopPropagation();
                angular.forEach(scope.selected, function (item, index) {
                    if (item.value === obj.value) {
                        scope.selected.splice(index, 1);
                        scope.$broadcast('removeItemFormSelected', scope.selected);
                    }
                });
            }


            $document[0].onclick = function (event) {
                event.stopPropagation();
                var ROOT_CLASS = 'mt-select'
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
                    scope.$apply();
                }
            }
        }
    }
}]);

// mt-option
angular.module('app').directive('mtOption', function () {
    return {
        restrict: 'E',
        // templateUrl: '/static/tpl/option.html',
        template: '<div class="mt-option">\
            <ul class="option-menu">\
                <li class="option-menu-item iconfont" data="{{option}}" ng-repeat="option in options" ng-class="option.disabled?\'disabled\':\'\'" ng-click="selectItem(option,$event);">\
                    {{option[label]}}\
                </li>\
            </ul>\
        </div>',
        replace: true,
        require: '^mtSelect',
        scope: {
            options: '=',
            label: '@?',
            value: '@?'
        },
        controller: function ($scope) {
            // 设置label和value的默认值
            $scope.label = "label";
            $scope.value = "value";

            // 控制 option 的显示隐藏
            $scope.isOpen = false;
        },
        link: function (scope, elem, attrs, ctrl) {

            // 监听父scope中的 removeItemFormSelected事件，删除menu-item上的CLASS_ACTIVE类
            scope.$on('removeItemFormSelected', function (event, data) {

                // 获取menu-item的集合
                var $li_arr = elem.find('li');

                var CLASS_ACTIVE = 'multiple-active icon-duihao';

                // 循环遍历所以的menu-item
                angular.forEach($li_arr, function (li) {

                    $li = angular.element(li);

                    // 如果当前节点的类名集合中含有 CLASS_ACTIVE,说明该节点被选中，
                    if ($li.hasClass(CLASS_ACTIVE)) {
                        // 获取该节点的数据
                        var dataAttr = JSON.parse($li.attr('data'));

                        var flag = false;
                        // 循环遍历selected数组，找出selected中没有，但是节点上有CLASS_ACTIVE类名的节点
                        angular.forEach(data, function (item) {
                            if (item.value === dataAttr.value) {
                                flag = true;
                            }
                        });

                        // remove该节点上的 CLASS_ACTIVE;
                        if (!flag) {
                            $li.removeClass(CLASS_ACTIVE);
                        }
                    }
                });
            });



            // 是否为多选
            scope.multiple = ctrl.isMultiple();

            scope.selectItem = function (option, event) {
                var $elem = angular.element(event.target);
                if ($elem.hasClass('disabled')) {
                    return;
                }

                if (scope.multiple) {
                    scope.checkbox(option, $elem);
                }
                else {
                    scope.radio(option, $elem);
                }
            }

            // 单选逻辑
            scope.radio = function (option, $elem) {
                console.log('单选');
                $elem.parent().children().removeClass('active');
                $elem.addClass('active');

                ctrl.setResult(option);

                ctrl.closeOption();
            }

            // 多选逻辑
            scope.checkbox = function (option, $elem) {
                console.log('多选');

                if ($elem.hasClass('multiple-active')) {
                    $elem.removeClass('multiple-active icon-duihao');
                }
                else {
                    $elem.addClass('multiple-active icon-duihao');
                }

                scope.setValue($elem.parent().children());
            }

            //设置 选中值
            scope.setValue = function (options) {
                var selected = [];
                angular.forEach(options, function (option) {
                    var item = angular.element(option);
                    if (item.hasClass('multiple-active')) {
                        var obj = JSON.parse(item.attr('data'));
                        selected.push(obj);
                    }
                });
                ctrl.setResult(selected);
            }

            scope.closeMenu = function () {
                console.log(1);
            }
        }
    }
});
