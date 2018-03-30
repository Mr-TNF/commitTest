const template = () => (
  `
  <div data-ng-bind="$ctrl.title"></div>
  `
)

const controller = function () {
  let ctrl = this
  ctrl.title = '第2个导航的第2个左标签的第1个页面'
}

export default {
  template: template(),
  controller: [controller]
}

