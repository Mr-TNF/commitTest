// import angular from 'angular'
import $ from 'jquery'
import './tooltip.css'
const template = () => (`
  <div class="ivu-tooltip" ng-mouseenter="handleShowPopper($event)" ng-mouseleave="handleClosePopper($event)">
     <div class="ivu-tooltip-rel" ref="reference" ng-style=relStyles() ng-transclude>
     </div>
     <div
        class="ivu-tooltip-popper"
        ref="popper"
        ng-show="!$ctrl.disabled && (visible || $ctrl.always)"
        data-transfer="false"
        x-placement="{{$ctrl.placement}}"
        ng-style=popperStyle()
        >
        <div class="ivu-tooltip-content">
            <div class="ivu-tooltip-arrow"></div>
            <div class="ivu-tooltip-inner" ng-if="!$ctrl.ishtml" style="word-wrap: break-word;white-space: normal;">{{$ctrl.content}}</div>
            <div class="ivu-tooltip-inner" ng-bind-html = "$ctrl.content" ng-if="$ctrl.ishtml" style="word-wrap: break-word;white-space: normal;"></div>
        </div>
     </div>
  </div>
`)

const controller = function tooltipCtrl ($scope, $sce) {
  this.$onInit = () => {
    $scope.relStyles = () => {
      return {
        position: `relative`,
        display: `inline-block`
      }
    }
    $scope.popperStyle = () => {
      return {
        position: `absoulte`,
        zIndex: `1060`
      }
    }
    this.placement = this.placement || 'bottom'
    this.disabled = this.disabled || false
    this.always = this.always || false
    this.delay = this.delay || '0'
    this.content = this.content || ''
    this.ishtml = this.ishtml || false
    if (this.ishtml) {
      this.content = $sce.trustAsHtml(!this.content ? '' : this.content)
    }
    $scope.visible = this.visible || false
    // $scope.handleShowPopper = this.onPopperShow
    // $scope.handleClosePopper = this.onPopperHide
    this.controlled = false
  }
  $scope.handleShowPopper = (e) => {
    if (this.timeout) {
      clearTimeout(this.timeout)
    }
    this.timeout = setTimeout(() => {
      if (!this.disabled) {
        $scope.visible = true
        $scope.$apply()
        this.show(e)
      }
    }, Number(this.delay))
  }
  $scope.handleClosePopper = (e) => {
    if (this.timeout) {
      clearTimeout(this.timeout)
      if (!this.controlled) {
        this.timeout = setTimeout(() => {
          $scope.visible = false
          this.onPopperHide()
          $scope.$apply()
        }, 100)
      }
    }
  }
  this.show = (e) => {
    let placementMap = {top: 'bottom', bottom: 'top', left: 'right', right: 'left'}
    let placement = this.placement.split('-')[0]
    let origin = placementMap[placement]
    let placeStyle = ['top', 'bottom'].indexOf(placement) > -1 ? 'center ' + origin : origin + ' center'
    const popov = $(e.target.closest('.ivu-tooltip')).find('.ivu-tooltip-popper')
    const popover = popov[0]
    const trigger = e.target.closest('.ivu-tooltip-rel')
    // 通过placement计算出位子
    this.position = {
      top: 0,
      left: 0
    }
    switch (this.placement) {
      case 'top' :
        this.position.left = trigger.offsetLeft - popover.offsetWidth / 2 + trigger.offsetWidth / 2
        this.position.top = trigger.offsetTop - popover.offsetHeight
        break
      case 'top-start' :
        this.position.left = trigger.offsetLeft
        this.position.top = trigger.offsetTop - popover.offsetHeight
        break
      case 'top-end' :
        this.position.left = trigger.offsetLeft + trigger.offsetWidth - popover.offsetWidth
        this.position.top = trigger.offsetTop - popover.offsetHeight
        break
      case 'left':
        this.position.left = trigger.offsetLeft - popover.offsetWidth
        this.position.top = trigger.offsetTop + trigger.offsetHeight / 2 - popover.offsetHeight / 2
        break
      case 'left-start':
        this.position.left = trigger.offsetLeft - popover.offsetWidth
        this.position.top = trigger.offsetTop
        break
      case 'left-end':
        this.position.left = trigger.offsetLeft - popover.offsetWidth
        this.position.top = trigger.offsetTop + trigger.offsetHeight - popover.offsetHeight
        break
      case 'right':
        this.position.left = trigger.offsetLeft + trigger.offsetWidth
        this.position.top = trigger.offsetTop + trigger.offsetHeight / 2 - popover.offsetHeight / 2
        break
      case 'right-start':
        this.position.left = trigger.offsetLeft + trigger.offsetWidth
        this.position.top = trigger.offsetTop
        break
      case 'right-end':
        this.position.left = trigger.offsetLeft + trigger.offsetWidth
        this.position.top = trigger.offsetTop + trigger.offsetHeight - popover.offsetHeight
        break
      case 'bottom':
        this.position.left = trigger.offsetLeft - popover.offsetWidth / 2 + trigger.offsetWidth / 2
        this.position.top = trigger.offsetTop + trigger.offsetHeight
        break
      case 'bottom-start':
        this.position.left = trigger.offsetLeft
        this.position.top = trigger.offsetTop + trigger.offsetHeight
        break
      case 'bottom-end':
        this.position.left = trigger.offsetLeft + trigger.offsetWidth - popover.offsetWidth
        this.position.top = trigger.offsetTop + trigger.offsetHeight
        break
      default:
        console.log('Wrong placement prop')
    }
    popov.css({'transform-origin': placeStyle, 'top': this.position.top + 'px', 'left': this.position.left + 'px'})
    this.onPopperShow()
  }
}

export default {
  transclude: true,
  template: template(),
  controller: ['$scope', '$sce', controller],
  bindings: {
    ishtml: '<?',
    content: '@?',
    placement: '@?',
    disabled: '<?',
    delay: '@?',
    // always: '@?', 待测
    // 事件绑定部分
    onPopperShow: '&',
    onPopperHide: '&'
  }
}
