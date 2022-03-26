'use strict';

import Block from './Block';
import handleGameKeyDown from '../handleGameKeyDown';
import { movePiece } from '../Piece';
import { useTracked } from '../state';
import '../../../styles.css';

import produce from 'immer';
import React, { useEffect } from 'react';

export default () => {
  const [state, setState] = useTracked();

  const handleKeyDown = (event: KeyboardEvent) =>
    setState(prev => handleGameKeyDown(event, prev));

  const handleTick = () => {
    setState(prev => produce(prev, draft => {
      const playerId = draft.room.players.findIndex(player => player.name == draft.playerName);
      const player = draft.room.players[playerId];

      if (player.piece)
        draft.room.players[playerId] = movePiece(player, { x: 0, y: 1 }, prev.socket);
    }));
  };

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    const ticker = setInterval(handleTick, 500);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      clearInterval(ticker);
    };
  }, []);

  const player = state.room.players.find(player => player.name == state.playerName);

  let board = [];
  for (const line of player.board.slice(4))
    for (const filled of line)
      board.push(<Block filled={filled} />);

  return (
    <div className="board">
      {board}
    </div>
  );
};
