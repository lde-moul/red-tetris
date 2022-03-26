'use strict';

import Block from './Block';
import { useTracked } from './state';
import '../../styles.css';

import React from 'react';

export default () =>
{
  const [state, setState] = useTracked();

  const player = state.room.players.find(player => player.name == state.playerName);

  let board: boolean[][] = [];
  for (let y = 0; y < 20; y++) {
    board[y] = [];
    for (let x = 0; x < 10; x++) {
      board[y][x] = false;
    }
  }

  for (const piece of player.pieces)
    for (const block of piece.blocks)
      if (block.y >= 0)
        board[block.y][block.x] = true;

  let grid = [];
  for (const line of board)
    for (const filled of line)
      grid.push(<Block filled={filled} />);

  return (
    <div className="board">
      {grid}
    </div>
  );
};
