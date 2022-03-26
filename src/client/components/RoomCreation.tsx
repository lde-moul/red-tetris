'use strict';

import { useTracked } from '../state';

import React, { useEffect, useRef, useState } from 'react';

export default () => {
  const [state, setState] = useTracked();
  const [name, setName] = useState('Room name');
  const nameInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = (event) => {
    event.preventDefault();
    state.socket.emit('CreateRoom', name);
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
    state.socket.on('RoomNameExists', () => {
      const nameInput = nameInputRef.current;
      nameInput.setCustomValidity('This name is already taken.');
      nameInput.reportValidity();
    });

    return () => {
      state.socket.off('RoomNameExists');
    };
  }, []);

  const namePattern = "[\\w +*/%^()=<>:,;.!?'&quot;~@#$&-]+";

  return (
    <form onSubmit={handleSubmit}>
      <label>Create room:</label>
      <input type="text" ref={nameInputRef} required pattern={namePattern} minLength={1} maxLength={20} value={name} onChange={handleNameChange} onInvalid={handleInvalidName} />
      <button type="submit">
        Create
      </button>
    </form>
  );
}
