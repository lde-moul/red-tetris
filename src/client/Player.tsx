'use strict';

import Piece from "./Piece";
import Vector2D, { floor2DVector } from "./Vector2D";

export default interface Player {
  name: string;
  board?: boolean[][];
  piece?: Piece;
  pieceQueue?: Piece[];
};

export const isPositionInsideBoard = (pos: Vector2D): boolean =>
  pos.x >= 0 && pos.x < 10 && pos.y >= 0 && pos.y < 20 + 4;

export const getEmptyBoard = (): boolean[][] => {
  let board: boolean[][] = [];

  for (let y = 0; y < 20 + 4; y++) {
    board[y] = [];
    for (let x = 0; x < 10; x++) {
      board[y][x] = false;
    }
  }

  return board;
};

export const isBoardBlockFilled = (board: boolean[][], pos: Vector2D): boolean => {
  pos = floor2DVector(pos);
  return !isPositionInsideBoard(pos) || board[pos.y][pos.x];
};

export const isBoardBlockEmpty = (board: boolean[][], pos: Vector2D): boolean =>
  !isBoardBlockFilled(board, pos);

export const setBoardBlock = (board: boolean[][], pos: Vector2D, filled: boolean): boolean[][] => {
  pos = floor2DVector(pos);

  if (isPositionInsideBoard(pos)) {
    board = [...board];
    board[pos.y] = [...board[pos.y]];
    board[pos.y][pos.x] = filled;
  }

  return board;
};

const attachOrDetach = (piece: Piece, board: boolean[][], attaching: boolean): boolean[][] =>
  piece.blocks.reduce(
    (board, block) => setBoardBlock(board, block, attaching),
    board
  );

export const attachPieceToBoard = (piece: Piece, board: boolean[][]): boolean[][] =>
  attachOrDetach(piece, board, true);

export const detachPieceFromBoard = (piece: Piece, board: boolean[][]): boolean[][] =>
  attachOrDetach(piece, board, false);
