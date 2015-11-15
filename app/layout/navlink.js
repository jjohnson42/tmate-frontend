import React from 'react'
import { Link } from 'react-router'

export default class NavLink extends React.Component {
  static contextTypes = {
    history: React.PropTypes.object
  }

  render() {
    const { history } = this.context

    let className = ""
    if (history && history.isActive(this.props.to, this.props.query, this.props.onlyActiveOnIndex)) {
      className = "active"
    }

    return <li className={className}>
             <Link {...this.props}>{this.props.children}</Link>
           </li>
  }
}
