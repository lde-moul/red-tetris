'use strict';

import Block from './Block';
import { rotatePiece, translatePiece } from './Piece';
import { attachPieceToBoard, detachPieceFromBoard } from './Player';
import { useTracked } from './state';
import '../../styles.css';

import produce from 'immer';
import React, { useEffect } from 'react';

export default () => {
  const [state, setState] = useTracked();

  const handleKeyDown = (event: KeyboardEvent) => {
    if (event.key == 'ArrowDown') {
      setState(prev => produce(prev, draft => {
        const player = draft.room.players.find(player => player.name == draft.playerName);

        player.board = detachPieceFromBoard(player.piece, player.board);
        player.piece = translatePiece(player.piece, { x: 0, y: 1 });
        player.board = attachPieceToBoard(player.piece, player.board);
      }));
    }
    else if (event.key == 'ArrowLeft') {
      setState(prev => produce(prev, draft => {
        const player = draft.room.players.find(player => player.name == draft.playerName);

        player.board = detachPieceFromBoard(player.piece, player.board);
        player.piece = translatePiece(player.piece, { x: -1, y: 0 });
        player.board = attachPieceToBoard(player.piece, player.board);
      }));
    } else if (event.key == 'ArrowRight') {
      setState(prev => produce(prev, draft => {
        const player = draft.room.players.find(player => player.name == draft.playerName);

        player.board = detachPieceFromBoard(player.piece, player.board);
        player.piece = translatePiece(player.piece, { x: 1, y: 0 });
        player.board = attachPieceToBoard(player.piece, player.board);
      }));
    }
    else if (event.key == 'ArrowUp') {
      setState(prev => produce(prev, draft => {
        const player = draft.room.players.find(player => player.name == draft.playerName);

        player.board = detachPieceFromBoard(player.piece, player.board);
        player.piece = rotatePiece(player.piece);
        player.board = attachPieceToBoard(player.piece, player.board);
      }));
    }
  };

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

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
