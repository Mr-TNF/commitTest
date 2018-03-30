import angular from 'angular'
export default {
  template: `<div id="menuTap">
                <ul>
                    <li data-ng-repeat="item in tabs" data-ng-click="selectTap(item)">
                        <span data-ng-bind="item.name"></span>
                        <span>{{item.select}}</span>
                        <a data-ng-click="closeTap($index, $event)">关闭</a>
                    </li>
                </ul>
               </div>
               <div id="tap-content">
               </div>
                `,
  controller: ['$rootScope', '$scope', '$compile', function($rootScope, $scope, $compile) {
    let ctrl = this
    $scope.tabs = []
    ctrl.openTab = (data) => {
      let index = ctrl.findTab(data)
      if (index === -1) {
        if ($scope.tabs.length >= 5) {
          alert('超出范围了')
          $scope.tabs[$scope.tabIndex].select = true
          return
        }
        $scope.tabs.push(data)
        index = $scope.tabs.length - 1
      }
      $scope.tabs[index].select = true
      $scope.tabIndex = index
      let element = angular.element(document.getElementById('tap-content'))
      element.html(data.template)
      $compile(element.contents())($scope)
    }

    ctrl.newTab = (data) => {
      return {
        id: null,
        pId: data.id,
        name: data.name,
        template: ctrl.bulidTemplate(data.id),
        select: false
      }
    }

    ctrl.findTab = (data) => {
      let index = -1
      $scope.tabs.forEach((item, i) => {
        item.select = false
        if (item.pId === data.pId) {
          index = i
        }
      })
      return index
    }

    ctrl.bulidTemplate = (data) => {
      return '<n' + data + '></n' + data + '>'
    }

    $scope.closeTap = (index, event) => {
      event.stopPropagation()
      let l = 0
      if ($scope.tabs[index].select) {
        if (index !== 0 && index + 1 > $scope.tabs.length - 1) {
          l = index - 1
        } else if (index !== 0 && index + 1 < $scope.tabs.length - 1) {
          l = index + 1
        } else {
          l = index + 1
        }
        ctrl.openTab($scope.tabs[l])
      }
      $scope.tabs.splice(index, 1)
      if ($scope.tabs.length === 0) {
        let element = angular.element(document.getElementById('tap-content'))
        element.html('')
        $compile(element.contents())($scope)
      }
    }
    $scope.selectTap = (data) => {
      ctrl.openTab(data)
      $rootScope.$broadcast('change-slide-bar', data.pId)
    }

    $scope.$on('openTab', function(event, msg) {
      ctrl.openTab(ctrl.newTab(msg))
    })
  }]
}
