import React, { Component } from 'react';
import ChannelList from './ChannelList';
import { Route, Switch, Redirect, withRouter } from 'react-router-dom';
import MessagesList from './MessagesList';

export default class Sidebar extends Component {

  render () {
    return (
      <section className="sidebar">
        <div className="sidebar-header">
          <h3 href="#">
            <div>flatland</div>
            {/* <i alt="Brand" className="glyphicon glyphicon-comment">
            </i> */}
          </h3>
        </div>
        <h5>Channels</h5>
        <ChannelList />
        <h5>Chat</h5>
        <Switch>
          <Route path="/channels/:channelId" component={MessagesList} />
          <Redirect to="/channels/1" />
        </Switch>
      </section>
    );
  }
}
