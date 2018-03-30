import './breadcrumb-item.css'
const directive = function() {
  const template = `
     <span>
        <span class="ivu-breadcrumb-item-link">
           <ng-transclude>
           </ng-transclude>
        </span>
        <span class="ivu-breadcrumb-item-separator" ng-bind-html = "separatorIcon" ng-if="showSeparator"></span>
        <span class="ivu-breadcrumb-item-separator"  ng-if="!showSeparator">/</span>
    </span>
  `
  const link = function menuItemCtrl(scope, element, attrs, ctrl) {
    const breadcrumbCtrl = ctrl[0]
    scope.showSeparator = breadcrumbCtrl.separator !== undefined && breadcrumbCtrl.separator !== ''
    scope.separatorIcon = breadcrumbCtrl.separator
  }
  return {
    template,
    transclude: true,
    require: ['^^iBreadcrumb'],
    scope: {
    },
    link: link
  }
}

export default directive
