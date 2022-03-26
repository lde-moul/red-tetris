'use strict';

import Piece from "./Piece";
import Vector2D, { floor2DVector } from "./Vector2D";

export default interface Board {
  blocks: boolean[][];
};

export const isPositionInsideBoard = (pos: Vector2D): boolean =>
  pos.x >= 0 && pos.x < 10 && pos.y >= 0 && pos.y < 20;

const getEmptyLine = (): boolean[] =>
  new Array(10).fill(false);

export const getEmptyBoard = (): Board => ({
  blocks: new Array(20).fill(getEmptyLine())
});

export const isBoardBlockFilled = (board: Board, pos: Vector2D): boolean => {
  pos = floor2DVector(pos);
  return pos.x < 0 || pos.x >= 10 || pos.y >= 20 || (isPositionInsideBoard(pos) && board.blocks[pos.y][pos.x]);
};

export const isBoardBlockEmpty = (board: Board, pos: Vector2D): boolean =>
  !isBoardBlockFilled(board, pos);

export const setBoardBlock = (board: Board, pos: Vector2D, filled: boolean): Board => {
  pos = floor2DVector(pos);

  if (isPositionInsideBoard(pos)) {
    const blocks = [...board.blocks];

    blocks[pos.y] = [...blocks[pos.y]];
    blocks[pos.y][pos.x] = filled;

    board = {
      ...board,
      blocks: [...blocks]
    };
  }

  return board;
};

const attachOrDetach = (piece: Piece, board: Board, attaching: boolean): Board =>
  piece.blocks.reduce(
    (board, block) => setBoardBlock(board, block, attaching),
    board
  );

export const attachPieceToBoard = (piece: Piece, board: Board): Board =>
  attachOrDetach(piece, board, true);

export const detachPieceFromBoard = (piece: Piece, board: Board): Board =>
  attachOrDetach(piece, board, false);

const isLineFull = (line: boolean[]): boolean =>
  line.every(block => block);

export const clearFullLines = (board: Board): Board => {
  let remainingLines = board.blocks.filter(line => !isLineFull(line));
  const numClearedLines = board.blocks.length - remainingLines.length;
  const newLines = new Array(numClearedLines).fill(getEmptyLine());

  return {
    ...board,
    blocks: newLines.concat(remainingLines)
  };
};
