import angular from 'angular'
import style from './angular-tabs.css'

const template =
  `
  <div id='{{$ctrl.componentId}}' style='position: relative;'>
    <div class='tab-label'>
      <div class='ivu-tabs ivu-tabs-card'>
        <div class='ivu-tabs-bar' style='margin-bottom:0' ng-show='$ctrl.showPanes.length !== 0'>
          <div class='ivu-tabs-nav-scroll' style='margin-bottom:-1px;'>
        <ul class='ivu-tabs-nav' style='padding-left: 18px;'>
          <li  class='ivu-tabs-tab tab-style' ng-repeat='pane in $ctrl.showPanes' ng-class='{active:pane.selected}' ng-mousedown='$ctrl.paneClick($event,pane,$index)' onmousemove='javascript:return false;' oncontextmenu='javascript:return false;' >
            <span title='{{pane.title}}' style='font-size: 12px'>{{pane.title}}</span><i ng-mousedown='$ctrl.close(pane,$event)' class='ivu-icon ivu-icon-ios-close-empty' style='font-size:22px;'></i>
          </li>
        </ul>
        </div>
        </div>
      </div>

      <div ng-show='$ctrl.rightMenu' class='tab-menu' style='position: relative;height:200px;' ng-style='$ctrl.menuStyle' oncontextmenu='javascript:return false;'>
        <ul class='dropdownMenu'>
          <li ng-click='$ctrl.closeAll()'>关闭全部</li>
          <li ng-click='$ctrl.closeOther()'>关闭其他</li>
        </ul>
      </div>
      <div ng-show='$ctrl.moreTab' class='moreTab'>
        <i ng-click='$ctrl.openMoreTab()' class='ivu-icon ivu-icon-navicon more-tab-btn' style='font-size: 22px;cursor: pointer'></i>
      </div>
      <ul ng-show='$ctrl.moreTabContent' class='more-content dropdownMenu' style='position: absolute;width:150px;right:0;top:28px;'>
        <li ng-repeat='pane in $ctrl.morePanes' class='more-panes' ng-click='$ctrl.show(pane)'>
          <label title='{{pane.title}}'>{{pane.title}}</label>
          <i ng-click='$ctrl.close(pane,$event)' class='ivu-icon ivu-icon-ios-close-empty' style='font-size:22px;'></i>
        </li>
      </ul>
    </div>
    <div class='tab-content' style='background:#fff;'>
      <div id='{{pane.id}}' ng-show='pane.selected' ng-repeat='pane in $ctrl.panes' style='overflow-y: scroll; height:calc(100vh - 176px)' class='contentStyle'>
        <pane pane-content='pane' is-active='pane.selected'></pane>
      </div>
    </div>
  </div>
  `
const controller = function ($rootScope, $scope, $document, $compile, $animate, moduleTabsService) {
  let ctrl = this
  let tabLength = 130
  ctrl.$onInit = function () {
    ctrl.componentId = 'angular-tabs-' + getRandomId()
    ctrl.panes = []
    ctrl.moreTab = false
    ctrl.moreTabContent = false
    ctrl.showLength = getShowLength()
    ctrl.rightPane = null
    angular.forEach(ctrl.initTabs, function (item) {
      ctrl.openPane(newPane(item))
    })
  }
  // 监听屏幕变化，控制moreTab按钮
  angular.element(window).resize(function () {
    $scope.$apply(function () {
      ctrl.moreTabContent = false
      ctrl.rightMenu = false
      ctrl.showLength = getShowLength()
    })
  })
  // 监听打开的tab页总数，控制moreTab按钮
  $scope.$watchCollection(function () {
    return ctrl.panes
  }, function (newValue, oldValue) {
    ctrl.showLength = getShowLength()
    ctrl.panes.length > ctrl.showLength ? ctrl.moreTab = true : ctrl.moreTab = false
    ctrl.moreTabContent = false
    ctrl.showPanes = ctrl.panes.slice(0, ctrl.showLength)
    ctrl.morePanes = ctrl.panes.slice(ctrl.showLength, ctrl.panes.length)
  })
  // 监听可显示的标签数，控制moreTab按钮
  $scope.$watch(function () {
    return ctrl.showLength
  }, function (newValue) {
    ctrl.panes.length > ctrl.showLength ? ctrl.moreTab = true : ctrl.moreTab = false
    ctrl.showPanes = ctrl.panes.slice(0, newValue)
    ctrl.morePanes = ctrl.panes.slice(newValue, ctrl.panes.length)
    let selectedIndex = null
    angular.forEach(ctrl.panes, function (value, index) {
      if (value.selected) {
        selectedIndex = index
        return
      }
    })
    ctrl.select(selectedIndex)
  })
  $document.bind('click', function (event) {
    let isButton = angular.element(event.target).hasClass('more-tab-btn')
    let rightMenu = angular.element(event.target).hasClass('tab-menu')
    $scope.$apply(function () {
      if (!isButton) {
        ctrl.moreTabContent = false
      }
      if (!rightMenu) {
        ctrl.rightMenu = false
      }
    })
  })
  ctrl.openPane = function (pane) {
    let index = ctrl.findPane(pane, true)
    if (angular.isNumber(index)) {
      if (index === -1) {
        if (ctrl.panes.length >= ctrl.maxLength) {
          alert('已达到标签页数上限，请先关闭其他标签!')
          ctrl.select(moduleTabsService.actIndex)
          return
        }
        pane.id = 'tab-pane-' + getRandomId()
        ctrl.panes.push(pane)
        index = ctrl.panes.length - 1
        if (ctrl.panes.length > ctrl.showLength) {
          ctrl.moreTab = true
        }
      } else {
        ctrl.panes[index].data = pane.data
        ctrl.panes[index].template = buildTemplate(ctrl.panes[index].name, ctrl.panes[index].data)
        if (ctrl.panes[index].reBuild) {
          let element = angular.element(document.getElementById(ctrl.panes[index].id))
          angular.extend($scope, ctrl.panes[index].data)
          if (ctrl.panes[index].controller) {
            $controller(ctrl.panes[index].controller, angular.extend({}, {
              $scope: $scope
            }))
          }
          element.html(ctrl.panes[index].template)
          $compile(element.contents())($scope)
        }
      }
    }
    ctrl.select(index)
  }
  ctrl.deleteTab = function (pane) {
    let idx = ctrl.findPane(pane)
    let deletePane = ctrl.panes.splice(idx, 1)[0]
    if (deletePane.selected && ctrl.panes[idx]) {
      ctrl.select(idx)
    } else if (deletePane.selected && ctrl.panes[idx - 1]) {
      ctrl.select(idx - 1)
    }
    angular.element(document.getElementById(pane.id)).remove()
  }
  ctrl.findPane = function (pane, reset) {
    let index = -1
    angular.forEach(ctrl.panes, function (item, i) {
      if (reset) {
        item.selected = false
      }
      if (item.name === 'n1041') {
        if (item.name === pane.name && (item.pId + '') === pane.pId) {
          index = i
          item.reBuild = false
          return
        }
      }
      if (item.name === pane.name && item.pId === pane.pId) {
        index = i
        return
      }
    })
    return index
  }
  ctrl.select = function (index) {
    if (angular.isNumber(index) && index !== -1) {
      ctrl.panes[index].selected = true
      $rootScope.$broadcast('change-side-bar', ctrl.panes[index].pId)
      moduleTabsService.actTab = ctrl.panes[index]
      moduleTabsService.actIndex = index
      if (index >= ctrl.showLength) {
        let selectedPane = ctrl.panes.splice(index, 1)
        let replacePane = ctrl.panes.splice(ctrl.showLength - 1, 1, selectedPane[0])
        ctrl.panes.push(replacePane[0])
        moduleTabsService.actIndex = ctrl.showLength - 1
      }
    }
  }
  ctrl.show = function (pane) {
    let idx = ctrl.findPane(pane, true)
    ctrl.select(idx)
  }
  ctrl.close = function (pane, event) {
    event.stopPropagation()
    ctrl.deleteTab(pane)
    ctrl.panes.length <= ctrl.showLength ? ctrl.moreTab = false : ''
  }
  ctrl.closeAll = function () {
    ctrl.panes = []
  }
  ctrl.closeOther = function () {
    ctrl.panes = []
    ctrl.panes.push(ctrl.rightPane)
    ctrl.show(ctrl.rightPane)
    ctrl.rightPane = null
  }
  ctrl.openMoreTab = function () {
    ctrl.moreTabContent = !ctrl.moreTabContent
  }
  // tab标签方法
  ctrl.paneClick = function ($event, pane, index) {
    ctrl.moreTabContent = false
    ctrl.rightMenu = false
    if ($event.button === 2) {
      ctrl.rightPane = pane
      ctrl.menuStyle = {
        'position': 'fixed',
        'z-index': '1000',
        'top': $event.clientY,
        'left': $event.clientX
      }
      ctrl.rightMenu = true
    } else if ($event.button === 0) {
      ctrl.show(pane)
    }
  }

  // 工具方法
  function newPane (msg) {
    let name = null
    let template = null
    let controller = null
    if (angular.isString(msg)) {
      name = msg
      template = buildTemplate(msg)
    } else if (angular.isObject(msg)) {
      name = msg.name
      controller = msg.controller
      template = msg.template
      if (!msg.template) {
        // template = buildTemplate(msg.name, msg.data)
        template = buildTemplate(msg.id, msg.data)
      }
    }
    /*
     *  tab对象属性构成
     */
    let paneObj = {
      id: null,
      pId: msg.id || 0,
      name: name,
      title: msg.title || name,
      template: template,
      selected: false,
      controller: controller,
      data: msg.data,
      reBuild: msg.reBuild
    }
    return paneObj
  }

  function buildTemplate (name, data) {
    let template = '<n' + name
    if (data) {
      angular.forEach(data, function (value, key) {
        if (angular.isString(value) || angular.isNumber(value)) {
          template += ' ' + key + '="' + value + '"'
        } else if (angular.isObject(value)) {
          template += ' ' + key + '="' + key + '"'
        }
      })
    }
    template += '></n' + name + '>'
    return template
  }

  function getRandomId () {
    let timestamp = new Date().getTime()
    let rand = Math.floor(Math.random() * Math.pow(10, String(timestamp).length) + 1)
    return timestamp + rand
  }

  function getShowLength () {
    let iWidth = angular.element(ctrl.container || window).width()
    return parseInt((iWidth - 14 - 20 - 40) / tabLength)
  }
// 通过非菜单新开tab页方法
  $scope.$on('openTab', function (event, msg) {
    ctrl.openPane(newPane(msg))
  })
}

export default {
  bindings: {
    container: '@',
    maxLength: '@',
    initTabs: '='
  },
  template: template,
  controller: ['$rootScope', '$scope', '$document', '$compile', '$animate', 'moduleTabsService', controller]
}

