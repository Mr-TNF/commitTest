import style from '../style/container.css'
export default {
  template: `
        <div class=${style.container} style="width: 100%;">
            <slider  ng-class="sidebarClass()" style="width: 250px; float:left"></slider>
            <div ng-class="collapseClass()" ng-show="show" ng-click="active = !active" ng-mouseenter="hover = !hover" ng-mouseleave="hover = !hover">
              <i-button type="text" ng-show="!hover" class=${style.button}>
                <i-icon type="navicon-round"></i-icon>
              </i-button>
              <i-button type="text" ng-show="!active && hover" title="收起侧边栏" class=${style.button}>
                <i-icon type="close-round"></i-icon>
              </i-button>
              <i-button type="text" ng-show="active && hover" title="展开侧边栏" class=${style.button}>
                <i-icon type="arrow-right-c"></i-icon>
              </i-button>
            </div>
            <!--<content></content>-->
            <div id="container" class="${style.content}" style="width:auto;margin-left:260px ">
                <module-tab container="#container" max-length="10">
                </module-tab>
             </div>
        </div>
    `,
  controller: ['$rootScope', '$scope', 'screenSize', '$timeout', function($rootScope, $scope, screenSize, $timeout) {
    $scope.clickHandler = () => {
      $scope.active = !$scope.active
      $scope.transaction = !$scope.transaction
      $timeout(() => {
        $scope.transaction = !$scope.transaction
      }, 400)
    }
    $scope.sidebarClass = () => {
      let classObj = {}
      classObj[style.active] = $scope.active
      classObj[style.sidebar] = true
      return classObj
    }
    $scope.collapseClass = () => {
      let classObj = {}
      classObj[style.active] = $scope.active
      classObj[style.collapse] = true
      if ($scope.active === true) {
        document.getElementById('container').style.marginLeft = 0
      } else {
        document.getElementById('container').style.marginLeft = 260 + 'px'
      }
      return classObj
    }
    $scope.$on('openSlider', () => {
      $scope.show = true
      $scope.active = false
    })
    $scope.$watch(() => screenSize.get() === 'xs' || screenSize.get() === 'sm', (newValue, oldValue, t) => {
      if (oldValue !== newValue) {
        if (newValue && !$scope.active || !newValue && $scope.active) {
          $scope.active = !$scope.active
        }
      }
    })
  }]
}
