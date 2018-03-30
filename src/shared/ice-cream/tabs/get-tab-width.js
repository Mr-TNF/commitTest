const directive = function($timeout) {
  const link = function(scope, element, attrs, iTabsCtrl) {
    $timeout(() => {
      let data = {}
      data[attrs.key] = element.css('width')
      scope.$emit('tabWidth', data)
    })
  }
  return {
    restrict: 'A',
    require: '^^iTabs',
    link: link
  }
}

export default ['$timeout', directive]
