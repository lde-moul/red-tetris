'use strict';

import state from './state';
import React, { useState } from 'react';
import "../../styles.css";

export default () =>
{
  const [name, setName] = useState('Player name');

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
        <button type="submit">
          Play
        </button>
      </form>
    </div>
  );
}
