'use strict';

import Block from './Block';
import handleGameKeyDown from '../handleGameKeyDown';
import { useTracked } from '../state';
import '../../../styles.css';

import React, { useEffect } from 'react';

export default () => {
  const [state, setState] = useTracked();

  const handleKeyDown = (event: KeyboardEvent) =>
    setState(prev => handleGameKeyDown(event, prev));

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
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
