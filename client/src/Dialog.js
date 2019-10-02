import React from 'react';
import Proptypes from 'prop-types';

const Dialog = props => {
  const { username, userId, handleInput, launchChat } = props;

  return (
    <div className="dialog-container">
      <div className="dialog">
        <form className="dialog-form" onSubmit={launchChat}>
          <label className="username-label" htmlFor="email">
            Email address
          </label>
          <input
            id="username"
            className="username-input"
            autoFocus
            type="email"
            name="userId"
            value={userId}
            onChange={handleInput}
            required
          />
          <label className="username-label" htmlFor="email">
            Full name
          </label>
          <input
            id="username"
            className="username-input"
            autoFocus
            type="text"
            name="username"
            value={username}
            onChange={handleInput}
            required
          />
          <button type="submit" className="submit-btn">
            Submit
          </button>
        </form>
      </div>
    </div>
  );
};

Dialog.proptypes = {
  userId: Proptypes.string.isRequired,
  username: Proptypes.string.isRequired,
  handleInput: Proptypes.func.isRequired,
  launchChat: Proptypes.func.isRequired,
};

export default Dialog;
