require('bootstrap/less/bootstrap.less')
require('./layout.scss')

import React from 'react'
import { Link } from 'react-router'
import NavLink from './navlink.js'
import SignInButton from '../signin/signin.js'

class NavAnonymous extends React.Component {
  render() {
    return <div className="collapse navbar-collapse">
             <ul className="nav navbar-nav navbar-right">
               <li><SignInButton /></li>
             </ul>
           </div>
  }
}

class NavUser extends React.Component {
  render() {
    return <div className="collapse navbar-collapse">
             <ul className="nav navbar-nav">
               <NavLink to="/dashboard">Dashboard</NavLink>
             </ul>
             <ul className="nav navbar-nav navbar-right">
               <NavLink to="/settings">Settings</NavLink>
             </ul>
           </div>
  }
}

export default class Layout extends React.Component {
  render() {
    return (
      <div>
        <div className="navbar navbar-default" role="navigation">
          <div className="container">
            <div className="navbar-header">
              <Link className="navbar-brand" to="/">tmate</Link>
            </div>
            <NavAnonymous />
          </div>
        </div>

        {this.props.children}
      </div>
    )
  }
}
