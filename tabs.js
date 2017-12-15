/**
 * @Author: luichooy
 * @Date:   2017-06-20 16:06
 * @Email:  luichooy@163.com
 * @Last modified by:   luichooy
 * @Last modified time: 2017-07-13 13:07
 */





angular.module('app').directive('tabs', ['$state', function ($state) {
  return {
    restrict: 'E',
    template: '<div id="tabs" class="tabs"><div ng-transclude></div></div>',
    transclude: true,
    controller: ['$scope', function ($scope) {
      this.panels = [];
  
      this.links = [];
      
      this.addTabAttrs = function (t) {
        this.panels.push(t);
      }
      
      this.addLinks = function(t){
        this.links.push(t);
      }
    }],
    link: function (scope, elem, attrs, ctrl) {
      var hasActiveAttr = false;
      
      // 如果存在 active属性 ，路由跳转至active
      for (var i = 0; i < ctrl.panels.length; i++) {
        if ('active' in ctrl.panels[i]) {
          $state.go(ctrl.panels[i].href);
          hasActiveAttr = true;
          break;
        }
      }
      
      // 如果 active 属性不存在，默认跳转第一个路由
      if (!hasActiveAttr) {
        $state.go(ctrl.panels[0].href);
        ctrl.links[0].addClass('active');
        
      }
    }
  }
}]);

angular.module('app').directive('tabPanel', ['$state', function ($state) {
  return {
    restrict: 'E',
    template: '<div class="tab-item"><a ng-click="transitionTo($event);" to="{{href}}" ng-transclude></a></div>',
    transclude: true,
    require: '^^tabs',
    scope: {
      href: '@'
    },
    link: function (scope, elem, attrs, ctrl) {
      ctrl.addTabAttrs(attrs);
      ctrl.addLinks(angular.element(elem[0].querySelector('a')));
      
      scope.transitionTo = function (event) {
        var $target = angular.element(event.currentTarget);
        
        if ($target.hasClass('active')) {
          return;
        }else{
          var href = event.currentTarget.getAttribute('to');
          angular.forEach(ctrl.links,function(link){
            if(!link.hasClass('active')) return;
            link.removeClass('active');
          });
          $target.addClass('active');
  
          $state.transitionTo(href);
        }
      }
    }
  }
}]);
