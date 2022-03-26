'use strict';

import Block from './Block';
import { useTracked } from './state';
import '../../styles.css';

import React from 'react';

export default () =>
{
  const [state, setState] = useTracked();

  const player = state.room.players.find(player => player.name == state.playerName);

  let board = [];
  for (const line of player.board)
    for (const filled of line)
      board.push(<Block filled={filled} />);

  return (
    <div className="board">
      {board}
    </div>
  );
};
