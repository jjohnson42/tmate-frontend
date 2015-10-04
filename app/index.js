require('babel-core/polyfill')

import React from 'react'
import { Router, IndexRoute, Route } from 'react-router'
import { createHistory } from 'history'

import Session from './term/session'
import Layout from './layout/layout'

class Root extends React.Component {
  render() {
    return <div>Welcome to tmate</div>
  }
}

React.render((
  <Router history={createHistory()}>
    <Route path='/' component={Layout}>
      <IndexRoute component={Root} />
      <Route path='t/:session_token' component={Session} />
    </Route>
  </Router>
), document.body)
