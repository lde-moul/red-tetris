'use strict';

import useSocket from '../socket';

import React, { useEffect, useRef, useState } from 'react';

export default () => {
  const [name, setName] = useState('Room name');
  const nameInputRef = useRef<HTMLInputElement>(null);
  const socket = useSocket();

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = (event) => {
    event.preventDefault();
    socket.emit('CreateRoom', name);
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
    socket.on('RoomNameExists', () => {
      const nameInput = nameInputRef.current;
      nameInput.setCustomValidity('This name is already taken.');
      nameInput.reportValidity();
    });

    return () => {
      socket.off('RoomNameExists');
    };
  }, []);

  const namePattern = "[\\w +*/%^()=<>:,;.!?'&quot;~@#$&-]+";

  return (
    <form onSubmit={handleSubmit} className="menu-sep flex-v">
      <label className="text-center-h">Create room:</label>
      <input type="text" ref={nameInputRef} required pattern={namePattern} minLength={1} maxLength={20} value={name} onChange={handleNameChange} onInvalid={handleInvalidName} />
      <button type="submit">
        Create
      </button>
    </form>
  );
}
