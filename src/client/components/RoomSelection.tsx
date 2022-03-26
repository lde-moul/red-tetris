'use strict';

import RoomCreation from './RoomCreation';
import { useTracked } from '../state';

import React from 'react';

export default () => {
  const [state, setState] = useTracked();

  const handleJoin = (name: string) => {
    state.socket.emit('JoinRoom', name);
  }

  const rooms = state.roomNames.map(name =>
    <li>
      <button type="button" onClick={() => handleJoin(name)}>
        {name}
      </button>
    </li>
  );

  return (
    <div>
      <ul>{rooms}</ul>
      <RoomCreation />
    </div>
  );
}
