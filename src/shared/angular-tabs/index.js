import moduleTab from './moduleTabs.js'
import pane from './pane.js'
import angular from 'angular'

export default angular.module('moduleTabs',[],['$compileProvider', function($compileProvider) {
  $compileProvider.directive('tabContent', ['$compile','$controller', function($compile,$controller) {
    return function(scope, element, attrs) {
      scope.$watch(
        function(scope) {
          return scope.$eval(attrs.tabContent);
        },function(pane) {
          let locals = {};
          angular.extend(scope,pane.data);
          if (pane.controller) {
            $controller(pane.controller, angular.extend(locals,{
              $scope: scope
            }));
          }
          element.html(pane.template);
          $compile(element.contents())(scope);
        }
      );
    };
  }]);
}]).factory('moduleTabsService',function(){
  return {
    actIndex : null,
    actTab : null,
  }
})
  .component('moduleTab',moduleTab)
  .component('pane',pane)
  .name
