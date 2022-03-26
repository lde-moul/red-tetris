'use strict';

import { useTracked } from '../state';
import '../../../styles.css';

import React from 'react';

export default () => {
  const [state, setState] = useTracked();

  const handleRestart = () => {
    state.socket.emit('RestartGame');
  };

  const winner = state.room.players.find(player => !player.lost);

  const restartButton = (state.playerName !== state.room.hostName) ? null : (
    <button type="button" onClick={() => handleRestart()}>
      Restart
    </button>
  );

  return (
    <div>
      { winner ? (winner.name + ' won the round!') : 'Game over' }
      {restartButton}
    </div>
  );
};
