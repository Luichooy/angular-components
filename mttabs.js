angular.module('app').directive('mtTabs', [function ($scope) {
  return {
    restrict: 'E',
    transclude: {
      panel: 'tabsPanel',
      body: 'tabsBody'
    },
    template: '<div class="mt-tabs">\
                  <div ng-transclude="panel"></div>\
                  <div ng-transclude="body"></div>\
                </div>',
    scope: {},
    controller: function ($scope, $element, $attrs) {
      $scope.selectType = '';
      
      this.setSelectType = function (type) {
        $scope.selectType = type;
      }
      
      
    },
    link: function (scope, element, attrs, ctrl) {
      
      scope.$watch('selectType', function (newval) {
        scope.$broadcast('changeType', newval);
      });
    }
  };
}]);

angular.module('app').directive('tabsPanel', [function ($scope) {
  return {
    restrict: 'E',
    template: '<div class="tabs-panel">\
                    <ul class="panel-list">\
                        <li class="panel-item" ng-class="{\'active\':option.active}" ng-repeat="option in options" ng-click="selectTab($event,option)"><a>{{option.text}}</a></li>\
                    </ul>\
                </div>',
    require: '^^mtTabs',
    scope: {
      options: '='
    },
    controller: function ($scope, $element, $attrs) {
    },
    link: function (scope, elem, attrs, ctrl) {
      function addDefaultSelect() {
        var flag = 0;
        angular.forEach(scope.options, function (option) {
          if (option.active) {
            ctrl.setSelectType(option.type);
            flag++;
          }
        });
        
        if (flag === 1) return;
        
        if (flag > 1) {
          throw Error('数据源options中“active”值为“true”的项大于1');
        }
        
        if (flag === 0) {
          scope.options[0].active = true;
          ctrl.setSelectType(scope.options[0].type);
        }
      }
      
      addDefaultSelect();
      
      scope.selectTab = function (event, option) {
        var target = angular.element(event.currentTarget);
        if (target.hasClass('active')) {
          return;
        }
        target.parent().children().removeClass('active');
        target.addClass('active');
        ctrl.setSelectType(option.type);
      };
    }
  };
}]);

angular.module('app').directive('tabsBody', [function ($scope) {
  return {
    restrict: 'E',
    transclude: true,
    replace: true,
    template: '<div class="tabs-body" ng-transclude></div>',
    require: '^^mtTabs',
    controller: function ($scope, $element, $attrs) {
    
    },
    link: function (scope, elem, attrs, ctrl) {
      var slotNodes = elem.children();
      
      function toggleContent(type) {
        angular.forEach(slotNodes, function (slotNode) {
          var node_id = slotNode.getAttribute('id');
          if (node_id !== type) {
            slotNode.style.display = 'none';
          } else {
            slotNode.style.display = 'block';
          }
        });
      }
      
      
      scope.$on('changeType', function (event, type) {
        console.log(type)
        toggleContent(type);
      });
    }
  };
}]);