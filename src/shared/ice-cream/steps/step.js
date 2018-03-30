const directive = function () {
  const prefixCls = 'ivu-steps'
  const iconPrefixCls = 'ivu-icon'
  const template = `
  <div ng-class="wrapClasses()" ng-style="styles()">
        <div class="${prefixCls}-tail"><i></i></div>
        <div class="${prefixCls}-head">
            <div class="${prefixCls}-head-inner">
                <span ng-if="!icon && currentStatus !== 'finish' && currentStatus !== 'error'">{{ stepNumber }}</span>
                <span ng-if="icon || currentStatus === 'finish' || currentStatus === 'error'" ng-class="iconClasses()"></span>
            </div>
        </div>
        <div class="${prefixCls}-main">
            <div class="${prefixCls}-title">{{ iTitle }}</div>
            <div ng-transclude="">
                <div ng-if="content" class="${prefixCls}-content">{{ content }}</div>
            </div>
        </div>
    </div>
`
  const link = function (scope, elements, attrs, ctrl) {
    ctrl.addStep(scope)
    // 初始化
    scope.status = scope.status || ''
    scope.iTitle = scope.iTitle || ''
    scope.content = scope.content || ''
    scope.currentStatus = scope.status || ''
    scope.stepNumber = ''
    scope.nextError = false
    scope.total = 1

    scope.wrapClasses = () => {
      return [
        `${prefixCls}-item`,
        `${prefixCls}-status-${scope.currentStatus}`,
        {
          [`${prefixCls}-custom`]: !!scope.icon,
          [`${prefixCls}-next-error`]: scope.nextError
        }
      ]
    }
    scope.iconClasses = () => {
      let icon = ''

      if (scope.icon) {
        icon = scope.icon
      } else {
        if (scope.currentStatus === 'finish') {
          icon = 'ios-checkmark-empty'
        } else if (scope.currentStatus === 'error') {
          icon = 'ios-close-empty'
        }
      }

      return [
        `${prefixCls}-icon`,
        `${iconPrefixCls}`,
        {
          [`${iconPrefixCls}-${icon}`]: icon !== ''
        }
      ]
    }
    scope.styles = () => {
      return {
        width: `${1 / scope.total * 100}%`
      }
    }
  }
  const controller = function stepCtrl($scope) {
  }

  return {
    restrict: 'E',
    transclude: true,
    require: '^^iSteps',
    replace: true,
    template: template,
    link: link,
    scope: {
      status: '@?',
      iTitle: '@?',
      content: '@?',
      icon: '@?'
    },
    controller: ['$scope', controller]
  }
}

export default directive
