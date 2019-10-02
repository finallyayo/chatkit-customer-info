import React, { Component } from 'react';
import axios from 'axios';
import Chatkit from '@pusher/chatkit-client';
import Spinner from 'react-spinkit';
import Dialog from './Dialog';
import ChatWidget from './ChatWidget';
import {
  sendMessage,
  handleInput,
  connectToRoom,
} from './sharedMethods';

class Customer extends Component {
  constructor() {
    super();
    document.title = "Customer View";

    this.state = {
      currentUser: null,
      currentRoom: null,
      userId: '',
      username: '',
      newMessage: '',
      messages: [],
      isDialogOpen: false,
      isLoading: false,
    };

    this.sendMessage = sendMessage.bind(this);
    this.handleInput = handleInput.bind(this);
    this.connectToRoom = connectToRoom.bind(this);
  }

  showDialog = () => {
    this.setState({
      isDialogOpen: !this.state.isDialogOpen,
    });
  };

  createRoom = () => {
    const { currentUser } = this.state;
    currentUser
      .createRoom({
        name: currentUser.name,
        private: true,
        addUserIds: ['support'],
        customData: {
          customerId: currentUser.id
        }
      })
      .then(room => this.connectToRoom(room.id, 0))
      .catch(console.error);
  };

  launchChat = event => {
    event.preventDefault();

    this.setState({
      isDialogOpen: false,
      isLoading: true,
    });

    const { userId, username } = this.state;

    if (userId === null || userId.trim() === '') {
      alert('Invalid userId');
    } else {
      axios
        .post('http://localhost:5200/users', { userId, username })
        .then(() => {
          const tokenProvider = new Chatkit.TokenProvider({
            url: 'http://localhost:5200/authenticate',
          });

          const chatManager = new Chatkit.ChatManager({
            instanceLocator: '<your chatkit instance locator>',
            userId,
            tokenProvider,
          });

          return chatManager.connect().then(currentUser => {
            this.setState(
              {
                currentUser,
                isLoading: false,
              },
              () => this.createRoom()
            );
          });
        })
        .catch(console.error);
    }
  };

  render() {
    const {
      newMessage,
      messages,
      currentUser,
      isDialogOpen,
      userId,
      username,
      isLoading,
    } = this.state;

    return (
      <div className="customer-chat">
        <h1>Need Help? Contact Us!</h1>
        <p>
          Customers can interact with support using the chat widget in the
          bottom right corner
        </p>

        {currentUser ? (
          <ChatWidget
            newMessage={newMessage}
            sendMessage={this.sendMessage}
            handleInput={this.handleInput}
            currentUser={currentUser}
            messages={messages}
          />
        ) : (
          <button onClick={this.showDialog} className="contact-btn">
            Contact Support
          </button>
        )}

        {isLoading ? <Spinner name="three-bounce" color="#300d4f" /> : null}

        {isDialogOpen ? (
          <Dialog
            userId={userId}
            username={username}
            handleInput={this.handleInput}
            launchChat={this.launchChat}
          />
        ) : null}
      </div>
    );
  }
}

export default Customer;
