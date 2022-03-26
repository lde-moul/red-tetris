'use strict';

import Board from './Board';
import { attachPieceToBoard } from '../Board';
import handleGameKeyDown from '../handleGameKeyDown';
import handleGameKeyUp from '../handleGameKeyUp';
import handleGameTick from '../handleGameTick';
import HUD from './HUD';
import { useTracked } from '../state';
import '../../../styles.css';

import produce from 'immer';
import React, { useEffect } from 'react';

export default () => {
  const [state, setState] = useTracked();

  const handleKeyDown = (event: KeyboardEvent) => {
    if (!event.repeat)
      setState(prev => handleGameKeyDown(event, prev));
  };

  const handleKeyUp = (event: KeyboardEvent) => {
    if (!event.repeat)
      setState(prev => handleGameKeyUp(event, prev));
  };

  const handleTick = () =>
    setState(prev => handleGameTick(prev));

  useEffect(() => {
    setState(prev => produce(prev, draft => {
      draft.room.tick = 0;
    }));

    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('keyup', handleKeyUp);
    const ticker = setInterval(handleTick, 100);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('keyup', handleKeyUp);
      clearInterval(ticker);
    };
  }, []);

  const player = state.room.player;

  let board = player.board;
  if (player.piece)
    board = attachPieceToBoard(player.piece, board);

  const opponents = state.room.players.filter(player => player.name !== state.playerName);

  return (
    <div className="game">
      <div className="game-padding"></div>
      <Board board={board} className="board" />
      <HUD player={player} players={opponents} />
    </div>
  );
};
