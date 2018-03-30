import style from '../style/header.css'
// import authService from '../service/AuthService'

const template = `
  <div class=${style.layoutCeiling}>
    <div class=${style.layoutCeilingTitle}>
      <span id="dateAndWeek"></span>
      <span>欢迎你回来，TNF</span>
    </div>
    <div class=${style.layoutCeilingMain}>
      <a ng-click="">
        <i-icon type="person" class=${style.iIcon}></i-icon>TNF
      </a>
      <a ng-click="help()">
        <i-icon type="help-circled" class=${style.iIcon}></i-icon>帮助
      </a>
      <a ng-click="logout()">
        <i-icon type="power" class=${style.iIcon}></i-icon>退出
      </a>
    </div>
  </div>

  <i-modal show="showHelp" header="帮助信息" width="500" closable="true" mask-closable="true" width="800">
    <div style="text-align: center">
      <div style="font-weight: bold">小小测试一下</div> 
      <div>版本号： V_1.1.0</div>
    </div>
    <i-modal-footer>
      <i-button type="default" ng-click="close()">关闭</i-button>
    </i-modal-footer>
  </i-modal>
`

const controller = function headerCtrl($scope, $state, authService) {
  $scope.logout = () => {
    authService.removeCookies()
    $state.go('login')
  }

  $scope.help = () => {
    $scope.showHelp = true
  }

  $scope.close = function () {
    $scope.showHelp = false
  }

  function displayDate() {
    let date = new Date()
    let year = date.getFullYear()
    let mouths = date.getMonth() + 1
    let day = date.getDate()
    let weekDay = new Array(7)
    weekDay[0] = '星期日'
    weekDay[1] = '星期一'
    weekDay[2] = '星期二'
    weekDay[3] = '星期三'
    weekDay[4] = '星期四'
    weekDay[5] = '星期五'
    weekDay[6] = '星期六'
    document.getElementById('dateAndWeek').innerHTML = '今天是' + ' ' + year + '/' + mouths + '/' + day + ' ' + weekDay[date.getDay()]
  }

  displayDate()
}

export default {
  template,
  controller: ['$scope', '$state', 'authService', controller]
}
