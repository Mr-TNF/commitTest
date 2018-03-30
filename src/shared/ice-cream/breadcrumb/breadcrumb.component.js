const directive = function() {
  const template = `
   <div class="ivu-breadcrumb">
     <ng-transclude></ng-transclude>
   </div>
  `
  const controller = function breadcrumbCtrl($scope, $sce) {
    this.$onInit = () => {
      this.separator = $scope.separator
    }
  }
  return {
    template,
    controller: ['$scope', '$sce', controller],
    transclude: true,
    scope: {
      separator: '@'
    }
  }
}

export default directive
