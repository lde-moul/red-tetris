'use strict';

import PlayerList from "./PlayerList";
import { useTracked } from '../state';

import React from 'react';

export default () => {
  const [state, setState] = useTracked();

  const names = state.room.players.map(player => player.name);

  const handleStart = () => {
    state.socket.emit('StartGame');
  };

  const startButton = (state.playerName !== state.room.hostName) ? null : (
    <button type="button" onClick={() => handleStart()}>
      Start
    </button>
  );

  return (
    <div>
      <PlayerList names={names} hostName={state.room.hostName} />
      {startButton}
    </div>
  );
};
