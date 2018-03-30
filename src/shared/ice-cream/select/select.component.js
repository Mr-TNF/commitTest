import angular from 'angular'
// import $ from 'jquery'

const template = () => (`
  <div ng-class="classes()" ng-style=selectStyles() tabindex='-1' ng-blur="$ctrl.handleClose($event)">
        <div
            ng-class="selectionCls()"
            ref="reference"
            ng-click="$ctrl.toggleMenu()" style="white-space:normal;">
                <div class="ivu-tag ivu-tag-checked" ng-repeat="item in selectedMultiple">
                    <span class="ivu-tag-text">{{ item.label }}</span>
                    <i-icon type="ios-close-empty" ng-click="$ctrl.removeTag($index, $event)"></i-icon>
                </div>
                <span class="ivu-select-placeholder" ng-show="!$ctrl.ngModel && !$ctrl.filterable">{{$ctrl.placeholder}}</span>
                <span class="ivu-select-selected-value" ng-show="$ctrl.ngModel && !$ctrl.multiple && !$ctrl.filterable">{{ $ctrl.ngModel.label }}</span>
                <input
                    type="text"
                    ng-if="$ctrl.filterable"
                    ng-model="$ctrl.putNgModel"
                    ng-disabled="$ctrl.disabled"
                    class="ivu-select-input"
                    placeholder="{{$ctrl.placeholder}}"
                    ng-blur="$ctrl.handleClose($event)"
                    ng-style="inputStyle()"
                    ref="input">
                <i-icon type="ios-close" class="ivu-select-arrow" ng-show="!$ctrl.multiple && $ctrl.clearable && !!$ctrl.ngModel" ng-click="$ctrl.clearSingleSelect($event)"></i-icon>
                <i-icon type="arrow-down-b" class="ivu-select-arrow" ng-if="!remote" ng-hide="$ctrl.clearable && !!$ctrl.ngModel"></i-icon>
        </div>
        <div ng-class="dropdownCls()" class="ivu-select-dropdown" ng-class="className()" ng-style="styles()" ng-show="$ctrl.dropVisible()">
          <ul ng-show="$ctrl.notFoundShow" class="ivu-select-not-found"><li>无匹配数据</li></ul>
          <ul ng-show="(!notFound && !remote) || (remote && !loading && !notFound)" class="ivu-select-dropdown-list" ng-if="$ctrl.optionGroup">
            <li class="ivu-select-group-wrap" ng-show="!hidden" ng-repeat="item in $ctrl.iOptionData">
              <div class="ivu-select-group-title">{{ item.optionGroup }}</div>
              <ul>
                <li class="ivu-select-group">
                  <li ref="options" style="display: block;white-space: normal" ng-class="[optionClasses(),{true:'ivu-select-item-disabled',false:''}[optionItem.disabled],{true:'ivu-select-item-selected',false:''}[optionItem.selected]]" ng-mousedown="$ctrl.select('group',$parent.$index,$index,$event)" ng-mouseout="$ctrl.blur()" ng-show="!hidden" ng-repeat="optionItem in item.option">{{ optionItem.label }}</li>
                 </li>
              </ul>
            </li>
          </ul>
          <ul ng-show="(!notFound && !remote) || (remote && !loading && !notFound)" class="ivu-select-dropdown-list" ng-if="!$ctrl.optionGroup">
            <li ref="options" style="display: block;white-space: normal" ng-class="[optionClasses(),{true:'ivu-select-item-disabled',false:''}[item.disabled],{true:'ivu-select-item-selected',false:''}[item.selected]]" ng-mousedown="$ctrl.select('',0,$index,$event)" ng-mouseout="$ctrl.blur()" ng-show="!hidden" ng-repeat="item in $ctrl.iOptionData">{{ item.label }}</li>
          </ul>
          <ul ng-show="loading" class="ivu-select-loading">{{ localeLoadingText }}</ul>
        </div>
    </div>
`)

const controller = function selectCtrl ($scope) { // 多选功能未完成，差键盘上下选中和分组选中
  var ctrl = this
  this.$onInit = () => {
    $scope.selectedMultiple = []
    document.addEventListener('keydown', this.handleKeydown)
    $scope.filterable = this.filterable || false
    $scope.clearable = this.clearable || false
    $scope.optionGroup = this.optionGroup || false
    $scope.size = this.size
    $scope.disabled = this.disabled || false
    $scope.placeholder = this.placeholder
    $scope.focusIndex = this.focusIndex
    $scope.notFoundShow = this.notFoundShow
    // 事件
    $scope.handleClose = this.handleClose
    $scope.hideMenu = this.hideMenu
    $scope.toggleMenu = this.toggleMenu
    $scope.dropVisible = this.dropVisible
    $scope.clearSingleSelect = this.clearSingleSelect
    $scope.removeTag = this.removeTag
    if (this.ngModel) {
      if (this.multiple) {
        $scope.selectedMultiple = this.ngModel
        if (this.optionGroup) {
          for (let i = 0; i < this.iOptionData.length; i++) {
            for (let j = 0; j < this.iOptionData[i].option.length; j++) {
              if (this.iOptionData[i].option[j].value === this.ngModel.value) {
                this.iOptionData[i].option[j].selected = true
              }
            }
          }
        } else {
          for (let i = 0; i < this.iOptionData.length; i++) {
            for (let j = 0; j < this.ngModel.length; j++) {
              if (this.iOptionData[i].value === this.ngModel[j].value) {
                this.iOptionData[i].selected = true
              }
            }
          }
        }
      } else {
        if (this.optionGroup) {
          for (let i = 0; i < this.iOptionData.length; i++) {
            for (let j = 0; j < this.iOptionData[i].option.length; j++) {
              if (this.iOptionData[i].option[j].value === this.ngModel.value) {
                this.iOptionData[i].option[j].selected = true
              }
            }
          }
        } else {
          for (let i = 0; i < this.iOptionData.length; i++) {
            if (this.iOptionData[i].value === this.ngModel.value) {
              this.iOptionData[i].selected = true
            }
          }
        }
      }
    }
  }
  const prefixCls = 'ivu-select'
  const prefixClsOption = 'ivu-select-item'
  this.$onChanges = () => {
    $scope.classes = () => {
      return [
        `${prefixCls}`,
        {
          [`${prefixCls}-visible`]: this.visible,
          [`${prefixCls}-disabled`]: this.disabled,
          [`${prefixCls}-multiple`]: this.multiple,
          [`${prefixCls}-single`]: !this.multiple,
          [`${prefixCls}-show-clear`]: this.showCloseIcon,
          [`${prefixCls}-${this.size}`]: !!this.size
        }
      ]
    }
    $scope.dropdownCls = () => {
      return {
        [prefixCls + '-dropdown-transfer']: this.transfer,
        [prefixCls + '-multiple']: this.multiple && this.transfer,
        'ivu-auto-complete': this.autoComplete
      }
    }
    $scope.selectionCls = () => {
      return {
        [`${prefixCls}-selection`]: !this.autoComplete
      }
    }
    $scope.inputStyle = () => {
      let style = {}
      if (this.multiple) {
        style.width = '100%'
      }
      return style
    }
    $scope.selectStyles = () => {
      return {
        width: `${this.width}px` || '100%',
        outline: 0
      }
    }
    $scope.styles = () => {
      let style = {}
      if (this.width) style.width = `${this.width}px`
      return style
    }
    $scope.optionClasses = () => {
      return [
        `${prefixClsOption}`,
        {
          [`${prefixClsOption}-focus`]: this.isFocus
        }
      ]
    }
  }
  this.handleClose = (e) => {
    this.hideMenu(e)
  }
  this.hideMenu = (e) => {
    angular.element(e.target).children().find('li.ivu-select-item').removeClass('ivu-select-item-focus')
    if (ctrl.notFoundShow === true) {
      ctrl.ngModel = ''
      ctrl.putNgModel = ''
    }
    this.visible = false
  }
  this.toggleMenu = () => {
    if (this.disabled || this.autoComplete) {
      return false
    }
    this.visible = !this.visible
    this.focusIndex = -1
  }
  this.dropVisible = () => {
    let status = true
    if (!this.loading && this.remote) status = false
    if (this.autoComplete) status = false
    return this.visible && status
  }
  this.select = (type, group, item, e) => {
    if (this.multiple) {
      if (type) {
        if (this.iOptionData[group].option[item].disabled) {
          return false
        } else {
          this.ngModel = this.iOptionData[group].option[item]
          this.putNgModel = angular.copy(this.ngModel.label)
          ctrl.changeafter({changeData: this.ngModel})
          angular.element(e.target).addClass('ivu-select-item-selected')
          angular.element(e.target).siblings().removeClass('ivu-select-item-selected')
          angular.element(e.target).parent().parent().siblings().children().find('li').removeClass('ivu-select-item-selected')
        }
      } else {
        if (this.iOptionData[item].disabled) {
          return false
        } else {
          let hasData = false
          $scope.hasTemp = 0
          for (let i = 0; i < $scope.selectedMultiple.length; i++) {
            if ($scope.selectedMultiple[i].value === this.iOptionData[item].value) {
              hasData = true
              $scope.hasTemp = i
            }
          }
          if (!hasData) {
            $scope.selectedMultiple.push(this.iOptionData[item])
          } else {
            $scope.selectedMultiple.splice($scope.hasTemp, 1)
          }
          if ($scope.selectedMultiple.length === 0) {
            this.ngModel = ''
          } else {
            this.ngModel = angular.copy($scope.selectedMultiple)
          }
          ctrl.changeafter({changeData: this.ngModel})
          angular.element(e.target).toggleClass('ivu-select-item-selected')
          e.stopPropagation()
          e.preventDefault()
        }
      }
    } else {
      if (type) {
        if (this.iOptionData[group].option[item].disabled) {
          return false
        } else {
          this.ngModel = this.iOptionData[group].option[item]
          this.putNgModel = angular.copy(this.ngModel.label)
          ctrl.changeafter({changeData: this.ngModel})
          angular.element(e.target).addClass('ivu-select-item-selected')
          angular.element(e.target).siblings().removeClass('ivu-select-item-selected')
          angular.element(e.target).parent().parent().siblings().children().find('li').removeClass('ivu-select-item-selected')
          this.hideMenu(e)
        }
      } else {
        if (this.iOptionData[item].disabled) {
          return false
        } else {
          this.ngModel = this.iOptionData[item]
          this.putNgModel = angular.copy(this.ngModel.label)
          ctrl.changeafter({changeData: this.ngModel})
          angular.element(e.target).addClass('ivu-select-item-selected').siblings().removeClass('ivu-select-item-selected')
          this.hideMenu(e)
        }
      }
    }
  }
  this.removeTag = (num, e) => {
    $scope.selectedMultiple.splice(num, 1)
    if ($scope.selectedMultiple.length === 0) {
      this.ngModel = ''
    } else {
      this.ngModel = angular.copy($scope.selectedMultiple)
      if (this.optionGroup) {
      } else {
        angular.element(e.target).parent().parent().parent().siblings().children().find('li.ivu-select-item').removeClass('ivu-select-item-selected')
        for (let i = 0; i < angular.element(e.target).parent().parent().parent().siblings().children().find('li.ivu-select-item').length; i++) {
          for (let j = 0; j < $scope.selectedMultiple.length; j++) {
            if (angular.element(e.target).parent().parent().parent().siblings().children().find('li.ivu-select-item')[i].innerHTML === $scope.selectedMultiple[j].label) {
              angular.element(e.target).parent().parent().parent().siblings().children().find('li.ivu-select-item').eq(i).addClass('ivu-select-item-selected')
            }
          }
        }
      }
    }
    e.stopPropagation()
    e.preventDefault()
  }
  $scope.$watch('$ctrl.ngModel', function (n, o) {
    if (n === '' || n === null) {
      if (ctrl.optionGroup) {
        for (let i = 0; i < ctrl.iOptionData.length; i++) {
          for (let j = 0; j < ctrl.iOptionData[i].option.length; j++) {
            if (ctrl.iOptionData[i].option[j].selected) {
              ctrl.iOptionData[i].option[j].selected = false
            }
          }
        }
      } else {
        for (let i = 0; i < ctrl.iOptionData.length; i++) {
          if (ctrl.iOptionData[i].selected) {
            ctrl.iOptionData[i].selected = false
          }
        }
      }
      $scope.selectedMultiple = []
      ctrl.iOptionData = angular.copy(ctrl.iOptionData)
    } else {
      if (n) {
        if (ctrl.multiple) {
          if (ctrl.optionGroup) {
            for (let i = 0; i < ctrl.iOptionData.length; i++) {
              for (let j = 0; j < ctrl.iOptionData[i].option.length; j++) {
                if (ctrl.iOptionData[i].option[j].value === ctrl.ngModel.value) {
                  ctrl.iOptionData[i].option[j].selected = true
                }
              }
            }
          } else {
            for (let i = 0; i < ctrl.iOptionData.length; i++) {
              for (let j = 0; j < ctrl.ngModel.length; j++) {
                if (ctrl.iOptionData[i].value === ctrl.ngModel[j].value) {
                  ctrl.iOptionData[i].selected = true
                }
              }
            }
          }
        } else {
          if (ctrl.optionGroup) {
            for (let i = 0; i < ctrl.iOptionData.length; i++) {
              for (let j = 0; j < ctrl.iOptionData[i].option.length; j++) {
                if (ctrl.iOptionData[i].option[j].selected) {
                  ctrl.iOptionData[i].option[j].selected = false
                }
                if (ctrl.iOptionData[i].option[j].value === ctrl.ngModel.value) {
                  ctrl.iOptionData[i].option[j].selected = true
                }
              }
            }
          } else {
            for (let i = 0; i < ctrl.iOptionData.length; i++) {
              if (ctrl.iOptionData[i].selected) {
                ctrl.iOptionData[i].selected = false
              }
              if (ctrl.iOptionData[i].value === ctrl.ngModel.value) {
                ctrl.iOptionData[i].selected = true
              }
            }
          }
        }
      }
    }
  }, true)
  this.handleKeydown = (e) => {
    if (this.visible) {
      const keyCode = e.keyCode
      // Esc slide-up
      if (keyCode === 27) {
        e.stopPropagation()
        e.preventDefault()
        this.hideMenu(e)
        $scope.$apply()
      }
      // next
      if (keyCode === 40) {
        e.preventDefault()
        this.navigateOptions('next', e)
      }
      // prev
      if (keyCode === 38) {
        e.preventDefault()
        this.navigateOptions('prev', e)
      }
      // enter
      if (keyCode === 13) {
        e.stopPropagation()
        e.preventDefault()
        if (this.filterable) {
          for (let i = 0; i < angular.element(e.target).parent().siblings().find('li.ivu-select-item').length; i++) {
            if (angular.element(e.target).parent().siblings().find('li.ivu-select-item').eq(i).hasClass('ivu-select-item-focus')) {
              if (this.optionGroup) {
                for (let m = 0; m < this.iOptionData.length; m++) {
                  for (let n = 0; n < this.iOptionData[m].option.length; n++) {
                    if (this.iOptionData[m].option[n].label === angular.element(e.target).children().find('li.ivu-select-item').eq(i)[0].innerHTML) {
                      this.ngModel = this.iOptionData[m].option[n]
                      this.putNgModel = angular.copy(this.ngModel.label)
                      ctrl.changeafter({changeData: this.ngModel})
                    }
                  }
                }
                angular.element(e.target).parent().siblings().find('li.ivu-select-item').eq(i).removeClass('ivu-select-item-focus')
                angular.element(e.target).parent().siblings().find('li.ivu-select-item').eq(i).addClass('ivu-select-item-selected')
                angular.element(e.target).parent().siblings().find('li.ivu-select-item').eq(i).siblings().removeClass('ivu-select-item-selected')
                angular.element(e.target).parent().siblings().find('li.ivu-select-item').eq(i).parent().parent().siblings().children().find('li').removeClass('ivu-select-item-selected')
                this.hideMenu(e)
              } else {
                this.ngModel = ctrl.iOptionData[i]
                this.putNgModel = angular.copy(this.ngModel.label)
                angular.element(e.target).parent().siblings().find('li.ivu-select-item').eq(i).removeClass('ivu-select-item-focus')
                angular.element(e.target).parent().siblings().find('li.ivu-select-item').eq(i).addClass('ivu-select-item-selected').siblings().removeClass('ivu-select-item-selected')
                this.hideMenu(e)
              }
            }
          }
        } else {
          for (let i = 0; i < angular.element(e.target).children().find('li.ivu-select-item').length; i++) {
            if (angular.element(e.target).children().find('li.ivu-select-item').eq(i).hasClass('ivu-select-item-focus')) {
              if (this.optionGroup) {
                for (let m = 0; m < this.iOptionData.length; m++) {
                  for (let n = 0; n < this.iOptionData[m].option.length; n++) {
                    if (this.iOptionData[m].option[n].label === angular.element(e.target).children().find('li.ivu-select-item').eq(i)[0].innerHTML) {
                      this.ngModel = this.iOptionData[m].option[n]
                      ctrl.changeafter({changeData: this.ngModel})
                    }
                  }
                }
                angular.element(e.target).children().find('li.ivu-select-item').eq(i).removeClass('ivu-select-item-focus')
                angular.element(e.target).children().find('li.ivu-select-item').eq(i).addClass('ivu-select-item-selected')
                angular.element(e.target).children().find('li.ivu-select-item').eq(i).siblings().removeClass('ivu-select-item-selected')
                angular.element(e.target).children().find('li.ivu-select-item').eq(i).parent().parent().siblings().children().find('li').removeClass('ivu-select-item-selected')
                this.hideMenu(e)
              } else {
                this.ngModel = this.iOptionData[i]
                angular.element(e.target).children().find('li.ivu-select-item').eq(i).removeClass('ivu-select-item-focus')
                angular.element(e.target).children().find('li.ivu-select-item').eq(i).addClass('ivu-select-item-selected').siblings().removeClass('ivu-select-item-selected')
                this.hideMenu(e)
              }
            }
          }
        }
        $scope.$apply()
      }
      // delete
      if (this.filterable) {
        $scope.$watch('$ctrl.putNgModel', function (n, o) {
          if (n) {
            if (n.length >= 0) {
              for (let i = 0; i < angular.element(e.target).parent().siblings().find('li.ivu-select-item').length; i++) {
                if (angular.element(e.target).parent().siblings().find('li.ivu-select-item').eq(i)[0].innerHTML.indexOf(n) === -1) {
                  angular.element(e.target).parent().siblings().find('li.ivu-select-item').eq(i)[0].style.display = 'none'
                } else {
                  angular.element(e.target).parent().siblings().find('li.ivu-select-item').eq(i)[0].style.display = 'block'
                }
              }
              $scope.noFound = 0
              for (let i = 0; i < angular.element(e.target).parent().siblings().find('li.ivu-select-item').length; i++) {
                if (angular.element(e.target).parent().siblings().find('li.ivu-select-item').eq(i)[0].style.display === 'none') {
                  $scope.noFound++
                }
              }
              if ($scope.noFound === angular.element(e.target).parent().siblings().find('li.ivu-select-item').length) {
                ctrl.notFoundShow = true
              } else {
                ctrl.notFoundShow = false
              }
            }
          } else {
            for (let j = 0; j < angular.element(e.target).parent().siblings().find('li.ivu-select-item').length; j++) {
              angular.element(e.target).parent().siblings().find('li.ivu-select-item').eq(j)[0].style.display = 'block'
              angular.element(e.target).parent().siblings().find('li.ivu-select-item').eq(j).removeClass('ivu-select-item-selected')
              ctrl.notFoundShow = false
            }
          }
        }, true)
      }
    }
  }
  this.navigateOptions = (direction, e) => {
    if (this.filterable) {
      if (direction === 'next') {
        this.focusIndex = this.focusIndex + 1
        angular.element(e.target).parent().siblings().find('li.ivu-select-item').removeClass('ivu-select-item-focus')
        angular.element(e.target).parent().siblings().find('li.ivu-select-item').eq(this.eqNext(direction, e, this.focusIndex)).addClass('ivu-select-item-focus')
        this.focusIndex = (this.focusIndex === angular.element(e.target).parent().siblings().find('li.ivu-select-item').length) ? 0 : this.focusIndex
      } else if (direction === 'prev') {
        this.focusIndex = this.focusIndex - 1
        angular.element(e.target).parent().siblings().find('li.ivu-select-item').removeClass('ivu-select-item-focus')
        angular.element(e.target).parent().siblings().find('li.ivu-select-item').eq(this.eqNext(direction, e, this.focusIndex)).addClass('ivu-select-item-focus')
        this.focusIndex = (this.focusIndex < 0) ? angular.element(e.target).parent().siblings().find('li.ivu-select-item').length - 1 : this.focusIndex
      }
    } else {
      if (direction === 'next') {
        this.focusIndex = this.focusIndex + 1
        angular.element(e.target).children().find('li.ivu-select-item').removeClass('ivu-select-item-focus')
        angular.element(e.target).children().find('li.ivu-select-item').eq(this.eqNext(direction, e, this.focusIndex)).addClass('ivu-select-item-focus')
        this.focusIndex = (this.focusIndex === angular.element(e.target).children().find('li.ivu-select-item').length) ? 0 : this.focusIndex
      } else if (direction === 'prev') {
        this.focusIndex = this.focusIndex - 1
        angular.element(e.target).children().find('li.ivu-select-item').removeClass('ivu-select-item-focus')
        angular.element(e.target).children().find('li.ivu-select-item').eq(this.eqNext(direction, e, this.focusIndex)).addClass('ivu-select-item-focus')
        this.focusIndex = (this.focusIndex < 0) ? angular.element(e.target).children().find('li.ivu-select-item').length - 1 : this.focusIndex
      }
    }
  }
  this.clearSingleSelect = (e) => {
    this.ngModel = ''
    this.putNgModel = ''
    e.stopPropagation()
    angular.element(e.target).parent().parent().next().children().find('li').removeClass('ivu-select-item-selected')
  }
  this.eqNext = (direction, e, next) => {
    if (this.filterable) {
      if (direction === 'next') {
        next = (this.focusIndex === angular.element(e.target).parent().siblings().find('li.ivu-select-item').length) ? 0 : this.focusIndex
        if (angular.element(e.target).parent().siblings().find('li.ivu-select-item').eq(next).hasClass('ivu-select-item-disabled') || angular.element(e.target).parent().siblings().find('li.ivu-select-item').eq(next)[0].style.display === 'none') {
          this.focusIndex = this.focusIndex + 1
          this.focusIndex = (this.focusIndex === angular.element(e.target).parent().siblings().find('li.ivu-select-item').length) ? 0 : this.focusIndex
          return this.eqNext(direction, e, this.focusIndex)
        } else {
          return next
        }
      } else if (direction === 'prev') {
        next = (this.focusIndex < 0) ? angular.element(e.target).parent().siblings().find('li.ivu-select-item').length - 1 : this.focusIndex
        if (angular.element(e.target).parent().siblings().find('li.ivu-select-item').eq(next).hasClass('ivu-select-item-disabled') || angular.element(e.target).parent().siblings().find('li.ivu-select-item').eq(next)[0].style.display === 'none') {
          this.focusIndex = this.focusIndex - 1
          this.focusIndex = (this.focusIndex < 0) ? angular.element(e.target).parent().siblings().find('li.ivu-select-item').length - 1 : this.focusIndex
          return this.eqNext(direction, e, this.focusIndex)
        } else {
          return next
        }
      }
    } else {
      if (direction === 'next') {
        next = (this.focusIndex === angular.element(e.target).children().find('li.ivu-select-item').length) ? 0 : this.focusIndex
        if (angular.element(e.target).children().find('li.ivu-select-item').eq(next).hasClass('ivu-select-item-disabled')) {
          this.focusIndex = this.focusIndex + 1
          this.focusIndex = (this.focusIndex === angular.element(e.target).children().find('li.ivu-select-item').length) ? 0 : this.focusIndex
          return this.eqNext(direction, e, this.focusIndex)
        } else {
          return next
        }
      } else if (direction === 'prev') {
        next = (this.focusIndex < 0) ? angular.element(e.target).children().find('li.ivu-select-item').length - 1 : this.focusIndex
        if (angular.element(e.target).children().find('li.ivu-select-item').eq(next).hasClass('ivu-select-item-disabled')) {
          this.focusIndex = this.focusIndex - 1
          this.focusIndex = (this.focusIndex < 0) ? angular.element(e.target).children().find('li.ivu-select-item').length - 1 : this.focusIndex
          return this.eqNext(direction, e, this.focusIndex)
        } else {
          return next
        }
      }
    }
  }
}

export default {
  transclude: true,
  template: template(),
  controller: ['$scope', controller],
  bindings: {
    width: '@?',
    ngModel: '=?',
    multiple: '<?',
    filterable: '<?',
    iOptionData: '<?',
    optionGroup: '<?',
    size: '@?',
    disabled: '<?',
    clearable: '<?',
    placeholder: '@?',
    // 事件绑定部分
    changeafter: '&iSelectChange'
  }
}
