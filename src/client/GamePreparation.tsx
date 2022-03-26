'use strict';

import Player from './Player';
import PlayerList from "./PlayerList";
import { useTracked } from './state';

import React from 'react';

export default () =>
{
  const [state, setState] = useTracked();

  const names = state.room.players.map((player: Player) => player.name);

  const handleStart = () => {
    state.socket.emit('StartGame');
  }

  return (
    <div>
      <PlayerList names={names} />
      <button type="button" onClick={() => handleStart()}>
        Start
      </button>
    </div>
  );
};
