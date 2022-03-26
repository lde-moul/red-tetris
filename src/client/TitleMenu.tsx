'use strict';

import React, { useState } from 'react';
import "../../styles.css";

export default ({ setPageId, socket }) =>
{
  const [name, setName] = useState('Player name');
  const [joining, setJoining] = useState(false);

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = (event) => {
    event.preventDefault();
    socket.emit('CreatePlayer', name);
  };

  const handleNameChange: React.FormEventHandler<HTMLInputElement> = (event) => {
    setName(event.currentTarget.value);
  }

  return (
    <div>
      <h1>Red Tetris</h1>

      <form onSubmit={handleSubmit}>
        <label>Player name:</label>
        <input type="text" value={name} onChange={handleNameChange} />
        <button type="submit" onClick={() => setJoining(false)}>
          Create room
        </button>
        <button type="submit" onClick={() => setJoining(true)}>
          Join room
        </button>
      </form>
    </div>
  );
}
