'use strict';

import Board from './Board';
import { attachPieceToBoard, getEmptyBoard } from '../Board';
import Piece, { translatePiece } from '../Piece';
import '../../../css/board.css';
import '../../../css/game.css';

import React from 'react';

interface PieceQueueProps {
  pieceQueue: Piece[];
};

export default ({ pieceQueue }: PieceQueueProps) => {
  const queue = pieceQueue.slice(0, 2).map(piece =>
    translatePiece(piece, {
      x: 0.5 - Math.min(...piece.blocks.map(block => block.x)),
      y: 0.5 - Math.min(...piece.blocks.map(block => block.y))
    })
  ).map((piece, key) => {
    let board = getEmptyBoard({ x: 4, y: 2 });
    board = attachPieceToBoard(piece, board);
    return <Board key={key} board={board} className="piece-queue-board" />;
  });

  return (
    <div className="piece-queue">
      {queue}
    </div>
  );
};
