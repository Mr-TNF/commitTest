'use strict'

import angular from 'angular'
import uirouter from '@uirouter/angularjs'
import ngCookies from 'angular-cookies'
import 'angular-media-queries/match-media'

import routes from './index.routes'

import header from './components/header'
import navbar from './components/navBar'
import slider from './components/slider'
import container from './components/container'
import content from './components/content'

import dataService from './service/dataServices'
import authService from './service/AuthService'

import n111 from './views/01/n111'
import n112 from './views/01/n112'
import n121 from './views/01/n121'
import n122 from './views/01/n122'
import n211 from './views/02/n211'
import n212 from './views/02/n212'
import n221 from './views/02/n221'
import n222 from './views/02/n222'
import n311 from './views/03/n311'
import n312 from './views/03/n312'
import n321 from './views/03/n321'
import n322 from './views/03/n322'
import n411 from './views/04/n411'
import n412 from './views/04/n412'
import n421 from './views/04/n421'
import n422 from './views/04/n422'

import './style/style.css'

const main = angular.module('main', [uirouter, ngCookies, 'matchMedia'])
  .run(['$transitions', ($transitions) => {
    $transitions.onStart({to: state => state.name !== 'login'}, function (trans) {
      console.log('login')
      var auth = trans.injector().get('authService')
      if (!auth.isAuthenticated()) {
        console.log(auth.isAuthenticated())
        return trans.router.stateService.target('login')
      }
    })
  }])
  .config(routes)
  .service('dataService', dataService)
  .service('authService', authService)
  .component('header', header)
  .component('container', container)
  .directive('navbar', navbar)
  .directive('slider', slider)
  .component('content', content)
  .component('n111', n111)
  .component('n112', n112)
  .component('n121', n121)
  .component('n122', n122)
  .component('n211', n211)
  .component('n212', n212)
  .component('n221', n221)
  .component('n222', n222)
  .component('n311', n311)
  .component('n312', n312)
  .component('n321', n321)
  .component('n322', n322)
  .component('n411', n411)
  .component('n412', n412)
  .component('n421', n421)
  .component('n422', n422)
  .name
export default main
