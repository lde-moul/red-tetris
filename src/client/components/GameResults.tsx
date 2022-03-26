'use strict';

import useSocket from '../socket';
import { useTracked } from '../state';
import '../../../styles.css';

import React from 'react';

export default () => {
  const [state, setState] = useTracked();
  const socket = useSocket();

  const handleRestart = () => {
    socket.emit('RestartGame');
  };

  const winner = state.room.players.find(player => !player.lost);

  const restartButton = (state.playerName !== state.room.hostName) ? null : (
    <button type="button" onClick={() => handleRestart()} className="menu-sep">
      Restart
    </button>
  );

  return (
    <div className="flex-v">
      <h1 className="title">GAME OVER</h1>

      <div className="menu flex-v">
        <div>
          <span className="winner-name">{ winner?.name }</span>
          { winner ? ' won the round!' : 'Game over' }
        </div>

        {restartButton}
      </div>
    </div>
  );
};
