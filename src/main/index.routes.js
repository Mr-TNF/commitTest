routes.$inject = ['$stateProvider']

export default function routes($stateProvider) {
  $stateProvider
    .state('login', {
      url: '/login',
      template: `
                <div>登录界面</div>
                <form>
                  <input type="text" data-ng-model="login.username"  placeholder="请输入账号"/>
                  <input type="password" data-ng-model="login.password" placeholder="请输入密码"/>
                  <input type="button" data-ng-click="loginFunc()" value="登录"/>
                  <input type="button" data-ng-click="clearFunc()" value="取消"/>
                </form>
                `,
      controller: ['$scope', '$state', 'authService', function($scope, $state, authService) {
        $scope.login = {
          username: '',
          password: ''
        }
        $scope.loginFunc = () => {
          authService.setCookies($scope.login)
          $state.go('index.home')
        }
        $scope.clearFunc = () => {
          $scope.login = {
            username: '',
            password: ''
          }
        }
      }]
    })
    .state('index', {
      url: '/',
      abstract: true,
      template: `
        <header></header>
        <navbar></navbar>
        <ui-view></ui-view>
      `,
      controller: ['$scope', '$state', 'authService', function($scope, $state, authService) {
        // $scope.exit = () => {
        //   authService.removeCookies()
        //   $state.go('login')
        // }
      }]
    })
    .state('index.home', {
      url: '',
      template: '<div>home</div>'
    })
    .state('index.container', {
      url: 'container',
      template: ` <container></container>`
    })
}
