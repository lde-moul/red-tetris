'use strict';

import { useTracked } from '../state';
import "../../../styles.css";

import React, { useEffect, useRef, useState } from 'react';

export default () => {
  const [state, setState] = useTracked();
  const [name, setName] = useState('Player name');
  const nameInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = (event) => {
    event.preventDefault();
    state.socket.emit('CreatePlayer', name);
  };

  const handleNameChange: React.FormEventHandler<HTMLInputElement> = (event) => {
    const nameInput = nameInputRef.current;
    nameInput.setCustomValidity('');
    nameInput.reportValidity();

    setName(event.currentTarget.value);
  }

  const handleInvalidName: React.FormEventHandler<HTMLInputElement> = (event) => {
    const nameInput = nameInputRef.current;
    if (nameInput.validity.patternMismatch)
      nameInput.setCustomValidity('Some characters are not allowed.');
  }

  useEffect(() => {
    state.socket.on('PlayerNameExists', () => {
      const nameInput = nameInputRef.current;
      nameInput.setCustomValidity('This name is already taken.');
      nameInput.reportValidity();
    });

    return () => {
      state.socket.off('PlayerNameExists');
    };
  }, []);

  const namePattern = "[\\w +*/%^()=<>:,;.!?'&quot;~@#$&-]+";

  return (
    <div>
      <h1>Red Tetris</h1>

      <form onSubmit={handleSubmit}>
        <label>Player name:</label>
        <input ref={nameInputRef} type="text" required pattern={namePattern} minLength={1} maxLength={20} value={name} onChange={handleNameChange} onInvalid={handleInvalidName} />
        <button type="submit">
          Play
        </button>
      </form>
    </div>
  );
}
