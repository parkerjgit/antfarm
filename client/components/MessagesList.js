import React, { Component } from 'react'
import Message from './Message'
import NewMessageEntry from './NewMessageEntry'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'

export const MessagesList = props => {
    const channelId = Number(props.match.params.channelId) // because it's a string "1", not a number!
    const messages = props.messages
    const filteredMessages = messages.filter(
        message => message.channelId === channelId
    )

    return (
        <div>
            {/* <ul className="media-list"> */}
            <ul>
                {filteredMessages.map(message => (
                    <Message message={message} key={message.id} />
                ))}
            </ul>
            <NewMessageEntry channelId={ channelId }/>
        </div>
    )
}

const mapStateToProps = state => ({
    messages: state.messages,
})

export default withRouter(connect(mapStateToProps)(MessagesList))
