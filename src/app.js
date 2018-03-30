'use strict'

import angular from 'angular'
import moment from 'moment'
import uirouter from '@uirouter/angularjs'

import routes from './app.route'

import main from './main'

import iceCream from './shared/ice-cream'
import moduleTabs from './shared/angular-tabs'
moment.locale('zh-cn')
angular.module('myApp', [uirouter, iceCream, moduleTabs, main])
  .config(routes)
