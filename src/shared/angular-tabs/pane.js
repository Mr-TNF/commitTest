// import angular from 'angular'

const template =
  `
  <div tab-content="$ctrl.paneContent" ></div>
  `

const controller = function ($scope) {
  let ctrl = this
  ctrl.$onChanges = function(obj) {
    if (obj.active && ctrl.active) {
      if (ctrl.active) {
        $scope.$broadcast('tabOnActive')
      }
    }
  }
}
export default {
  template: template,
  bindings: {
    paneContent: '=',
    active: '<isActive'
  },
  controller: ['$scope', controller]
}
