'use strict';

import RoomCreation from './RoomCreation';
import { useTracked } from '../state';
import "../../../styles.css";
import Title from './Title';

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

  const roomSelection = (rooms.length != 0) ?
    <ul className="flex-v">{rooms}</ul> :
    'No rooms available.';

  return (
    <div className="flex-v">
      <Title />

      <div className="menu flex-v">
        {roomSelection}
        <RoomCreation />
      </div>
    </div>
  );
}
