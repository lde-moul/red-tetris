'use strict';

import emitWithAck from './emitWithAck';
import state from './state';

import React, { useState } from 'react';
import "../../styles.css";

export default () =>
{
  const [name, setName] = useState('Player name');

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = async (event) => {
    event.preventDefault();

    try {
      await emitWithAck(state.socket, 'CreatePlayer', name);
    } catch (err) {
      // ...
    }
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
