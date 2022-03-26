'use strict';

import Board from './Board';
import handleGameKeyDown from '../handleGameKeyDown';
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

  const handleTick = () =>
    setState(prev => handleGameTick(prev));

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    const ticker = setInterval(handleTick, 500);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      clearInterval(ticker);
    };
  }, []);

  const opponents = state.room.players.filter(player => player.name !== state.playerName);

  return (
    <div className="game">
      <div className="game-padding"></div>
      <Board board={state.room.player.board} className="board" />
      <HUD pieceQueue={state.room.player.pieceQueue} players={opponents} />
    </div>
  );
};
