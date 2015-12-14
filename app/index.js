require('babel-polyfill')
import jQuery from "jquery"
window.jQuery = jQuery

import React from 'react'
import ReactDOM from 'react-dom'
import { Router, IndexRoute, Route } from 'react-router'
import { createHistory } from 'history'

import Session from './term/session'
import Layout from './layout/layout'
import Dashboard from './dashboard/dashboard'
import RegisterUser from './signin/register_user'

ReactDOM.render((
  <Router history={createHistory()}>
    <Route path='/' component={Layout}>
      <Route path='t/:session_token' component={Session} />
      <Route path='dashboard' component={Dashboard} />
      <Route path='/register' component={RegisterUser} />
    </Route>
  </Router>
), document.getElementById('app-container'))
