require('./signin.scss')

import React from 'react'
import { Link } from 'react-router'
import Modal from 'react-modal'

const customStyles = {
  overlay : {
    position          : 'fixed',
    top               : 0,
    left              : 0,
    right             : 0,
    bottom            : 0,
    backgroundColor   : 'rgba(15, 15, 15, 0.75)'
  },
  content : {
    top                   : '70px',
    left                  : '50%',
    right                 : 'auto',
    bottom                : 'auto',
    marginRight           : '-50%',
    transform             : 'translate(-50%, 0)',
    border                : 'none',
    backgroundColor       : 'transparent'
  }
};

export default class SignIn extends React.Component {
  constructor(props) {
    super()
    this.state = {modalIsOpen: false}
  }

  handleSignInGithub() {
    window.location.href = "/auth/github/init"
  }

  handleSignInEmail() {
  }

  handleLinkClick(event) {
    event.preventDefault()
    this.setState({modalIsOpen: true})
  }

  handleModalCloseRequest() {
    this.setState({modalIsOpen: false})
  }

  render() {
    return (
      <a href="#" onClick={this.handleLinkClick.bind(this)}>
        Sign In / Sign Up

        <Modal className="modal-dialog modal-signup"
               style={customStyles}
               closeTimeoutMS={150}
               isOpen={this.state.modalIsOpen}
               onRequestClose={this.handleModalCloseRequest.bind(this)}>
          <div className="modal-content">
            <div className="modal-header">
              <button type="button" className="close" onClick={this.handleModalCloseRequest.bind(this)}>
                <span aria-hidden="true">&times;</span>
                <span className="sr-only">Close</span>
              </button>
              <h4 className="modal-title">Sign In or Sign Up</h4>
            </div>
            <div className="modal-body">
              <button type="button" className="btn btn-primary" onClick={this.handleSignInGithub.bind(this)}>Sign in or sign up with GitHub</button>
              <button type="button" className="btn btn-primary" onClick={this.handleSignInEmail.bind(this)}>Sign in or sign up with email</button>
            </div>
          </div>
        </Modal>
      </a>
    )
  }
}

        // Sign in with SSH
        // ---
        // Signup with Github
        // ---
        // Signup with email

      // </div>
