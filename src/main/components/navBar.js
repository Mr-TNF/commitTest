import style from '../style/navbar.css'
export default function() {
  return {
    template: `<div id="navbar">
                    <i-menu mode="horizontal" theme="primary">
                        <div id="navbar-items" class="${style.navbarItems}">
                            <i-menu-item data-ng-click="goHome()">首页</i-menu-item>
                            <i-menu-item data-ng-click="openSilder(item.children)" data-ng-repeat="item in navItems" >{{item.name}}</i-menu-item>
                        </div>
                    </i-menu>
                </div>`,
    controller: ['$rootScope', '$scope', '$state', 'dataService', function($rootScope, $scope, $state, dataService) {
      $scope.navItems = dataService.getData()
      $scope.openSilder = function(sliderItem, activeKey) {
        $state.go('index.container').then(() => {
          $rootScope.$broadcast('openSlider', sliderItem, activeKey)
        })
      }
      $scope.$on('change-side-bar', function (event, data) {
        $scope.navItems.forEach(first => {
          first.children.forEach(second => {
            second.children.forEach(third => {
              if (third.id === parseInt(data)) {
                $scope.activeKey = first.id
                $scope.openSilder(first.children, third.id)
              }
            })
          })
        })
      })
      // $scope.$on('change-slide-bar', function(event, msg) {
      //   $scope.openSilder($scope.navItems[(msg / 100).toFixed(0) - 1].children)
      // })
      $scope.goHome = function () {
        $state.go('index.home')
      }
    }]
  }
}
