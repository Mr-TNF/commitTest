import './alert.css'

const template = `
  <div ng-class="fadeClasses()">
    <div ng-if="!$ctrl.closed" ng-class="wrapClasses()">
        <span ng-class="iconClasses()" ng-if="$ctrl.showIcon" ng-transclude="icon">
          <i-icon type="{{iconType()}}"></i-icon>
        </span>
        <span ng-class="messageClasses()" ng-transclude></span>
        <span ng-class="descClasses()" ng-transclude="desc"></span>
        <a ng-class="closeClasses()" ng-if="$ctrl.closable" ng-click="close($event)" ng-transclude="close">
          <i-icon type="ios-close-empty"></i-icon>
        </a>
    </div>
  </div>
`
const controller = function alertCtrl($scope) {
  const prefixCls = 'ivu-alert'
  this.$onInit = () => {
    this.type = this.type || 'info'
    this.closable = this.closable || false
    this.showIcon = this.showIcon || false
    this.banner = this.banner || false
    $scope.fadeClasses = () => {
      return [`${prefixCls}-fade`]
    }
    $scope.wrapClasses = () => {
      return [
        `${prefixCls}`,
        `${prefixCls}-${this.type}`,
        {
          [`${prefixCls}-with-icon`]: this.showIcon,
          [`${prefixCls}-with-desc`]: this.desc,
          [`${prefixCls}-with-banner`]: this.banner
        }
      ]
    }
    $scope.messageClasses = () => {
      return `${prefixCls}-message`
    }
    $scope.descClasses = () => {
      return `${prefixCls}-desc`
    }
    $scope.closeClasses = () => {
      return `${prefixCls}-close`
    }
    $scope.iconClasses = () => {
      return `${prefixCls}-icon`
    }
    $scope.iconType = () => {
      let type = ''

      switch (this.type) {
        case 'success':
          type = 'checkmark-circled'
          break
        case 'info':
          type = 'information-circled'
          break
        case 'warning':
          type = 'android-alert'
          break
        case 'error':
          type = 'close-circled'
          break
      }

      return type
    }
    // 事件
    $scope.close = (e) => {
      this.closed = true
      this.onClose(e)
    }
  }
}
export default {
  template,
  transclude: {
    'icon': '?iAlertIcon',
    'desc': '?iAlertDesc',
    'close': '?iClose'
  },
  controller: ['$scope', controller],
  bindings: {
    type: '@?',
    closable: '<',
    showIcon: '<',
    banner: '<',
    desc: '<',
    onClose: '&'
  }
}
