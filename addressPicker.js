/**
 * @Author: luichooy
 * @Date:   2017-07-04
 * @Email:  571312070@qq.com
 * @Last modified by:
 * @Last modified time: 2017-07-18 19:07
 */



// 省市区---数据

/*
 * layer  默认选择到区/县
 * 传入2  选择到 市
 */

var ADDS = require('./addressData.js');

angular.module('app').directive('addressPicker', ['$document',function ($document) {
    return {
        restrict: 'E',
        template: '<div class="addressPicker">\
                        <div class="content">\
                            <input type="text" class="form-control" ng-focus="showPicker()" ng-model="addressText">\
                        </div>\
                        <div id="picker" class="picker" ng-show="togglePicker">\
                            <div class="picker-body">\
                                <ul>\
                                    <li class="province">\
                                        <ul>\
                                            <li class="address-item" ng-repeat="address in ADDRESS" ng-click="getProvince(address,$event)">{{address.text}}</li>\
                                        </ul>\
                                    </li>\
                                    <li class="city" ng-show="cities">\
                                        <ul>\
                                            <li class="address-item" ng-repeat="city in cities" ng-click="getCity(city,$event)">{{city.text}}</li>\
                                        </ul>\
                                    </li>\
                                    <li class="county" ng-if="showCounty" ng-show="counties">\
                                        <ul>\
                                            <li class="address-item" ng-repeat="county in counties" ng-click="getCounty(county,$event)">{{county.text}}</li>\
                                        </ul>\
                                    </li>\
                                </ul>\
                            </div>\
                            <div class="picker-footer clearfix">\
                                <div class="select left">{{province.text+"&nbsp;&nbsp;&nbsp;"+city.text+"&nbsp;&nbsp;&nbsp;"+county.text}}</div>\
                                <div class="btn-wrapper right">\
                                    <button class="btn btn-empty" ng-click="empty()">清空</button>\
                                    <button class="btn btn-confirm" ng-click="confirm()">确定</button>\
                                </div>\
                            </div>\
                        </div>\
                    </div>',
        scope: {
            address: '=',
            layer: '@?'
        },
        controller: function ($scope,$element,$attrs) {
        
        },
        link: function (scope, elem, attrs) {
            scope.ADDRESS = ADDS;

            // 切换 addresspicker
            scope.togglePicker = false;

            scope.province = {};
            scope.city = {};
            scope.county = {};
            // scope.cities = [];
            // scope.counties = [];

            // scope.addressText  用于在input中显示的文本内容
            scope.addressText = '';

            // 是否选择区
            scope.showCounty = true;

            if (scope.layer == 2) {
                scope.showCounty = false;
            }

            // 当前点击选择的元素 dom节点
            // 三个元素，分别保存省市区
            scope.current_click_element = [];

            scope.showPicker = function () {
                scope.togglePicker = true;
            }

            scope.empty = function () {
                console.log(scope.current_click_element);
                scope.province = {};
                scope.city = {};
                scope.county = {};
                scope.cities = undefined;
                scope.counties = undefined;
                scope.current_click_element[0].removeClass('active');
                scope.addressText = '';
            }

            scope.confirm = function () {
                scope.address = {
                    province: scope.province,
                    city: scope.city,
                    county: scope.county
                };
                scope.addressText = scope.address.province.text;
                if (scope.address.city.text) {
                    scope.addressText += scope.address.city.text;
                }
                if (scope.address.county.text) {
                    scope.addressText += scope.address.county.text;
                }
                scope.togglePicker = false;
            }

            scope.getProvince = function (province, event) {
                var $elem = angular.element(event.target);
                scope.current_click_element[0] = $elem;
                $elem.parent().children().removeClass('active');
                $elem.addClass('active');
                scope.province.value = province.value;
                scope.province.text = province.text;
                scope.cities = province.children;
            }

            scope.getCity = function (city, event) {
                var $elem = angular.element(event.target);
                scope.current_click_element[1] = $elem;
                $elem.parent().children().removeClass('active');
                $elem.addClass('active');
                scope.city.value = city.value;
                scope.city.text = city.text;
                scope.counties = city.children;
            }

            scope.getCounty = function (county, event) {
                scope.current_click_element[2] = $elem;
                var $elem = angular.element(event.target);
                $elem.parent().children().removeClass('active');
                $elem.addClass('active');
                scope.county.value = county.value;
                scope.county.text = county.text;
            }

            scope.$watch('province', function (newVal, oldVal) {
                scope.counties = undefined;
                scope.city = {};
                scope.county = {};
            }, true);

            scope.$watch('city', function (newVal, oldVal) {
                scope.county = {};
            }, true);
  
          $document[0].onclick = function (event) {
            event.stopPropagation();
            var ROOT_CLASS = 'addressPicker'
            var target = angular.element(event.target);
            var parent = target;
            var flag = false;
            // console.log(parent);
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
              scope.togglePicker = false;
              scope.$apply();
            }
          }
        }
    }
}]);
