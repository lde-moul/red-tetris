'use strict';

import useSocket from '../socket';
import { useTracked } from '../state';
import Title from './Title';

import React from 'react';

export default () => {
  const [state, setState] = useTracked();
  const socket = useSocket();

  const names = state.room.players.map(player => player.name);

  const handleHostChange = (name: string) => {
    socket.emit('ChangeHost', name);
  };

  const handleStart = () => {
    socket.emit('StartGame');
  };

  const playerList = names.map(name => {
    const hostMark = (name == state.room.hostName) ? '(host)' : null;

    const changeHostButton = !(state.playerName == state.room.hostName && name != state.playerName) ? null : (
      <button type="button" onClick={() => handleHostChange(name)}>
        Change host
      </button>
    );

    return [
      <div key={name + ".name"}>{name}</div>,
      <div key={name + ".hostMark"}>{hostMark}</div>,
      <div key={name + ".changeHostButton"}>{changeHostButton}</div>
    ];
  });

  const startButton = (state.playerName !== state.room.hostName) ? null : (
    <button type="button" onClick={() => handleStart()} className="menu-sep">
      Start
    </button>
  );

  return (
    <div className="flex-v">
      <Title />

      <div className="menu flex-v">
        <div className="player-list">
          {playerList}
        </div>

        {startButton}
      </div>
    </div>
  );
};
