import style from '../style/slider.css'

export default ['$rootScope', '$timeout', function($rootScope, $timeout) {
  return {
    template: `<i-menu on-select="onSelectItem(key)"  width="250px" active-key="{{activeKey}}" accordion="true" ng-show="sliderItems">
    <div ng-repeat="item in sliderItems">
      <i-submenu key="{{item.id}}" name="{{item.name}}">
        <i-menu-item ng-repeat="childItem in item.children" key="{{childItem.id}}" title="{{childItem.name}}">
          {{childItem.name}}
        </i-menu-item>
      </i-submenu>
    </div>
  </i-menu>`,
    link: function(scope, element) {
      const menu = element.find('ul')
      console.log(menu)
      menu.addClass(`${style.menu}`)
      const register = {}
      scope.$on('openSlider', function(event, msg, activeKey) {
        scope.sliderItems = msg
        scope.sliderItems.forEach(item => {
          item.children.forEach(item => {
            register[item.id] = { name: item.name }
          })
        })
        $timeout(() => {
          scope.activeKey = activeKey
        })
      })
      scope.onSelectItem = (key) => {
        $rootScope.$broadcast('openTab', {id: key, name: register[key].name})
      }
    }
  }
}]
