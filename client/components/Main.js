import React, { Component } from 'react';
import { Route, Switch, Redirect, withRouter } from 'react-router-dom';
import { connect } from 'react-redux'
import Sidebar from './Sidebar';
import Navbar from './Navbar';
import MessagesList from './MessagesList';
import { fetchMessages } from '../store'
import Scene from './Scene'

export class Main extends Component {

  componentDidMount () {
    this.props.loadMessages()
  }

  render () {
    return (
      <div>
        <Sidebar />
        {/* <Navbar /> */}
        <main>
          <Scene />

        </main>
      </div>
    );
  }
}

const mapDispatchToProps = dispatch => ({
  loadMessages: () => dispatch(fetchMessages()),
})

export default withRouter(connect(null, mapDispatchToProps)(Main))
