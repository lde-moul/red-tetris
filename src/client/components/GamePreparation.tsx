'use strict';

import { useTracked } from '../state';

import React from 'react';

export default () => {
  const [state, setState] = useTracked();

  const names = state.room.players.map(player => player.name);

  const handleHostChange = (name: string) => {
    state.socket.emit('ChangeHost', name);
  };

  const handleStart = () => {
    state.socket.emit('StartGame');
  };

  const playerList = names.map(name => {
    const hostMark = (name == state.room.hostName) ? ' (host)' : null;

    const changeHostButton = !(state.playerName == state.room.hostName && name != state.playerName) ? null : (
      <button type="button" onClick={() => handleHostChange(name)}>
        Change host
      </button>
    );

    return <li>{name}{hostMark}{changeHostButton}</li>;
  });

  const startButton = (state.playerName !== state.room.hostName) ? null : (
    <button type="button" onClick={() => handleStart()}>
      Start
    </button>
  );

  return (
    <div>
      <ul>{playerList}</ul>
      {startButton}
    </div>
  );
};
