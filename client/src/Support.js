import React, { Component } from 'react';
import axios from 'axios';
import Chatkit from '@pusher/chatkit-client';
import {
  sendMessage,
  handleInput,
  connectToRoom,
} from './sharedMethods';

class Support extends Component {
  constructor() {
    super();

    document.title = "Support View";
    this.state = {
      currentUser: null,
      currentRoom: null,
      newMessage: '',
      messages: [],
      rooms: [],
      customerInfo: null,
    };

    this.sendMessage = sendMessage.bind(this);
    this.handleInput = handleInput.bind(this);
    this.connectToRoom = connectToRoom.bind(this);
  }

  componentDidMount() {
    const userId = 'support';
    const username = 'Support';

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

        return chatManager
          .connect({
            onAddedToRoom: room => {
              this.setState({
                rooms: [...this.state.rooms, room],
              });
            },
          })
          .then(currentUser => {
            this.setState(
              {
                currentUser,
                rooms: currentUser.rooms,
              },
              () => {
                if (this.state.rooms.length >= 1) {
                  this.connectToRoom(this.state.rooms[0].id);
                }
              }
            );
          });
      })
      .catch(console.error);
  }

  joinRoom = id => {
    this.setState(
      {
        messages: [],
        customerInfo: null,
      }
    );

    this.connectToRoom(id)
      .then(currentRoom => {
        return axios.get(`http://localhost:5200/users/${currentRoom.customData.customerId}`)
      })
      .then(res => {
        this.setState({
          customerInfo: res.data
        });
      })
      .catch(console.error);
  };

  render() {
    const {
      newMessage,
      rooms,
      currentRoom,
      messages,
      currentUser,
      customerInfo,
    } = this.state;

    const RoomList = rooms.map(room => {
      const isActive =
        currentRoom && currentRoom.id === room.id ? 'active' : '';
      return (
        <li
          key={room.id}
          onClick={() => this.joinRoom(room.id)}
          className={`${isActive} room`}
        >
          {room.name}
        </li>
      );
    });

    const ChatSession = messages.map((message, index) => {
      const user = message.senderId === currentUser.id ? 'support' : 'user';
      return (
        <span key={index} className={`${user} message`}>
          {message.text}
        </span>
      );
    });

    return (
      <div className="support-area">
        <aside className="support-sidebar">
          <h3>Rooms</h3>
          <ul>{RoomList}</ul>
        </aside>
        <section className="support-session">
          <header className="current-chat">
            <h3>{currentRoom ? currentRoom.name : 'Chat'}</h3>
          </header>
          <div className="chat-session">{ChatSession}</div>
          <form onSubmit={this.sendMessage} className="message-form">
            <input
              className="message-input"
              autoFocus
              placeholder="Compose your message and hit ENTER to send"
              onChange={this.handleInput}
              value={newMessage}
              name="newMessage"
            />
          </form>
        </section>
        <aside className="customer-info">
          <h3>Customer Info</h3>
          { customerInfo ? (
            <ul>
              <li><strong>Name</strong>: {customerInfo.name}</li>
              <li><strong>Email</strong>: {customerInfo.email}</li>
              <li><strong>Company</strong>: {customerInfo.company}</li>
              <li><strong>Location</strong>: {customerInfo.location}</li>
              <li><strong>Phone</strong>: {customerInfo.phone}</li>
            </ul>
          ) : null }
        </aside>
      </div>
    );
  }
}

export default Support;
