'use strict';

import { attachPieceToBoard, getEmptyBoard } from '../Board';
import Piece, { translatePiece } from '../Piece';
import '../../../styles.css';

import React from 'react';
import Board from './Board';

interface PieceQueueProps {
  pieceQueue: Piece[];
};

export default ({ pieceQueue }: PieceQueueProps) => {
  const queue = pieceQueue.slice(0, 2).map(piece =>
    translatePiece(piece, {
      x: 0.5 - Math.min(...piece.blocks.map(block => block.x)),
      y: 0.5 - Math.min(...piece.blocks.map(block => block.y))
    })
  ).map(piece => {
    let board = getEmptyBoard({ x: 4, y: 2 });
    board = attachPieceToBoard(piece, board);
    return <Board board={board} className="piece-queue-board" />;
  });

  return (
    <div className="piece-queue">
      {queue}
    </div>
  );
};
