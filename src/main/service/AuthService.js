class AuthService {
  constructor ($cookies, $location) {
    this.$cookies = $cookies
    this.$location = $location
    this.cookieHost = `migu-${this.$location.host()}`
    this.cookieName = 'loginName'
    this.cookiePwd = 'loginPwd'
  }

  setCookies = (params) => {
    this.$cookies.put(this.cookieHost, new Date())
    this.$cookies.put(this.cookieName, params.username)
    this.$cookies.put(this.cookiePwd, params.password)
  }
  removeCookies = () => {
    this.$cookies.remove(this.cookieHost)
    this.$cookies.remove(this.cookieName)
    this.$cookies.remove(this.cookiePwd)
  }

  isAuthenticated = () => {
    return this.$cookies.get(this.cookieHost) && this.$cookies.get(this.cookieName) && this.$cookies.get(this.cookiePwd)
  }
}

export default ['$cookies', '$location', AuthService]
