require('bootstrap/less/bootstrap.less')
require('./layout.scss')

import React from 'react'
import { Link } from 'react-router'
import NavLink from './navlink.js'

export default class Layout extends React.Component {
  render() {
    return (
      <div>
        <div className="navbar navbar-default" role="navigation">
          <div className="container">
            <div className="navbar-header">
              <button type="button" className="navbar-toggle" data-toggle="collapse" data-target=".navbar-collapse">
                <span className="sr-only">Toggle navigation</span>
                <span className="icon-bar"></span>
                <span className="icon-bar"></span>
                <span className="icon-bar"></span>
              </button>
              <Link className="navbar-brand" to="/">tmate</Link>
            </div>
            <div className="collapse navbar-collapse">
              <ul className="nav navbar-nav">
                <NavLink to="/dashboard">Dashboard</NavLink>
              </ul>
            </div>
          </div>
        </div>

        {this.props.children}
      </div>
    )
  }
}
