require('./register_user.scss')

import React from 'react'

export default class RegisterUser extends React.Component {
  signUp(event) {
    event.preventDefault()
  }

  render() {
    return (
      <div className="user-registration">
        <h3>Registration</h3>
        <form>
          <div className="form-group">
            <label for="nickname">Nickname</label>
            <input className="form-control" id="nickname" placeholder="Nickname" value={this.props.location.query.login} />
          </div>
          <div className="form-group">
            <label for="name">Name</label>
            <input className="form-control" id="name" placeholder="Name" value={this.props.location.query.name}/>
          </div>
          <div className="form-group">
            <label for="email">Email</label>
            <input type="email" className="form-control" id="email" placeholder="Email" value={this.props.location.query.email} />
          </div>
          <div className="btn-group pull-right">
            <button type="submit" className="btn btn-default btn-primary" onClick={this.signUp.bind(this)}>Sign up</button>
          </div>
        </form>
      </div>)
  }
}
