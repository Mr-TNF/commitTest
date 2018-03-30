import angular from 'angular'

const directive = function () {
  const prefixCls = 'ivu-steps'
  const template = `
    <div ng-class="classes()">
        <ng-transclude></ng-transclude>
    </div>
`

  const link = function (scope, elements, attrs, ctrl) {
    // 初始化
    scope.direction = scope.direction || 'horizontal'
    scope.status = scope.status || 'process'
    scope.current = scope.current || 0
    scope.size = scope.size || ''
    scope.classes = () => {
      return [
        `${prefixCls}`,
        `${prefixCls}-${scope.direction}`,
        {
          [`${prefixCls}-${scope.size}`]: !!scope.size
        }
      ]
    }
    scope.updateChildProps = (isInit) => {
      const steps = angular.element(elements[0]).find('ng-transclude').children()
      const total = steps.length
      scope.steps.forEach((stepScope, index) => {
        stepScope.stepNumber = index + 1

        if (scope.direction === 'horizontal') {
          stepScope.total = total
        }
        // 如果已存在status,且在初始化时,则略过
        // todo 如果当前是error,在current改变时需要处理
        if (!(isInit && stepScope.currentStatus)) {
          if (index === scope.current) {
            if (scope.status !== 'error') {
              stepScope.currentStatus = 'process'
            }
          } else if (index < scope.current) {
            stepScope.currentStatus = 'finish'
          } else {
            stepScope.currentStatus = 'wait'
          }
        }

        if (stepScope.currentStatus !== 'error' && index !== 0) {
          scope.steps[index - 1].nextError = false
        }
      })
    }
    scope.setNextError = () => {
      scope.steps.forEach((stepScope, index) => {
        if (stepScope.currentStatus === 'error' && index !== 0) {
          scope.steps[index - 1].nextError = true
        }
      })
    }
    scope.updateCurrent = (isInit) => {
      // 防止溢出边界
      if (scope.current < 0 || scope.current >= scope.steps.length) {
        return
      }
      if (isInit) {
        const currentStatus = scope.steps[scope.current].currentStatus
        if (!currentStatus) {
          scope.steps[scope.current].currentStatus = scope.status
        }
      } else {
        scope.steps[scope.current].currentStatus = scope.status
      }
    }
    scope.updateSteps = () => {
      scope.updateChildProps(true)
      scope.setNextError()
      scope.updateCurrent(true)
    }
    scope.$watch(() => scope.current, function () {
      scope.updateChildProps()
    })
    scope.$watch(scope.status, function () {
      scope.updateCurrent()
    })
  }

  const controller = function stepsCtrl(scope) {
    let steps = scope.steps = []
    this.addStep = (stepScope) => {
      steps.push(stepScope)
    }
    this.$oninit = () => {
      scope.updateSteps()
    }
  }

  return {
    restrict: 'E',
    transclude: true,
    template: template,
    link: link,
    controller: ['$scope', controller],
    scope: {
      current: '<?',
      status: '@?',
      size: '@?',
      direction: '@?'
    }
  }
}

export default directive
