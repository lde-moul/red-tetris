'use strict';

import Board from './Board';
import handleGameKeyDown from '../handleGameKeyDown';
import HUD from './HUD';
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
      if (draft.room.player.piece)
        draft.room.player = movePiece(draft.room.player, { x: 0, y: 1 }, prev.socket);
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

  return (
    <div className="game">
      <div className="game-padding"></div>
      <Board board={state.room.player.board} />
      <HUD players={state.room.players} />
    </div>
  );
};
