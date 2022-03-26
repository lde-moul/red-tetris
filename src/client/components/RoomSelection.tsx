'use strict';

import RoomCreation from './RoomCreation';
import useSocket from '../socket';
import { useTracked } from '../state';
import "../../../css/main.css";
import Title from './Title';

import React, { useEffect } from 'react';

export default () => {
  const [state, setState] = useTracked();
  const socket = useSocket();

  const handleJoin = (name: string) => {
    socket.emit('JoinRoom', name);
  }

  useEffect(() => {
    if (state.quickRoomName && state.roomNames.includes(state.quickRoomName))
      socket.emit('JoinRoom', state.quickRoomName);
  }, []);

  const rooms = state.roomNames.map(name =>
    <li key={name}>
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
