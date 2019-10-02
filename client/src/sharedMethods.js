function sendMessage(event) {
  event.preventDefault();
  const { newMessage, currentUser, currentRoom } = this.state;

  if (newMessage.trim() === '') return;

  currentUser.sendMessage({
    text: newMessage,
    roomId: `${currentRoom.id}`,
  });

  this.setState({
    newMessage: '',
  });
}

function handleInput(event) {
  const { value, name } = event.target;

  this.setState({
    [name]: value,
  });
}

function connectToRoom(id, messageLimit = 100) {
  const { currentUser } = this.state;

  return currentUser
    .subscribeToRoom({
      roomId: `${id}`,
      messageLimit: messageLimit,
      hooks: {
        onMessage: message => {
          this.setState({
            messages: [...this.state.messages, message],
          });
        },
      },
    })
    .then(currentRoom => {
      this.setState({
        currentRoom,
      });

      return currentRoom;
    });
}

export { sendMessage, handleInput, connectToRoom };
