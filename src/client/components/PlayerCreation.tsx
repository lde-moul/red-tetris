'use strict';

import useSocket from '../socket';
import { useTracked } from '../state';
import "../../../styles.css";
import Title from './Title';

import React, { useEffect, useRef, useState } from 'react';

export default () => {
  const [state, setState] = useTracked();
  const [name, setName] = useState(state.quickPlayerName ?? 'Player name');
  const nameInputRef = useRef<HTMLInputElement>(null);
  const socket = useSocket();

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = (event) => {
    event.preventDefault();
    socket.emit('CreatePlayer', name);
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
    if (state.quickPlayerName && nameInputRef.current.reportValidity())
      socket.emit('CreatePlayer', name);

    socket.on('PlayerNameExists', () => {
      const nameInput = nameInputRef.current;
      nameInput.setCustomValidity('This name is already taken.');
      nameInput.reportValidity();
    });

    return () => {
      socket.off('PlayerNameExists');
    };
  }, []);

  const namePattern = "[\\w +*/%^()=<>:,;.!?'&quot;~@#$&-]+";

  return (
    <div className="flex-v">
      <Title />

      <form onSubmit={handleSubmit} className="menu flex-v">
        <label className="text-center-h">Player name</label>
        <input ref={nameInputRef} type="text" required pattern={namePattern} minLength={1} maxLength={20} value={name} onChange={handleNameChange} onInvalid={handleInvalidName} className="text-center-h" />
        <button type="submit">
          Play
        </button>
      </form>
    </div>
  );
}
