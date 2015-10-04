require('bootstrap/less/bootstrap.less')
require('./layout.scss')

import React from 'react'
import { Link } from 'react-router'

export default class Layout extends React.Component {
  render() {
    return (
      <div>
        <div className="navbar navbar-default navbar-fixed-top" role="navigation">
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
              <ul className="nav navbar-nav pull-right">
              </ul>
            </div>
          </div>
        </div>

        <div className="container">
          {this.props.children}
        </div>
      </div>
    )
  }
}
