'use strict';

import { useTracked } from '../state';

import React, { useState } from 'react';

export default () => {
  const [state, setState] = useTracked();
  const [name, setName] = useState('Room name');

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = (event) => {
    event.preventDefault();
    state.socket.emit('CreateRoom', name);
  };

  const handleNameChange: React.FormEventHandler<HTMLInputElement> = (event) => {
    setName(event.currentTarget.value);
  }

  return (
    <form onSubmit={handleSubmit}>
      <label>Create room:</label>
      <input type="text" value={name} onChange={handleNameChange} />
      <button type="submit">
        Create
      </button>
    </form>
  );
}
