'use strict';

import Piece from './Piece';
import Vector2D, { floor2DVector } from './Vector2D';

export enum BlockType {
  Empty,
  Malus,
  Filled1,
  Filled2,
  Filled3,
  Filled4,
  Filled5,
  Filled6,
  Filled7
}

export default interface Board {
  blocks: BlockType[][];
  size: Vector2D;
};

export const isPositionInsideBoard = (pos: Vector2D, board: Board): boolean =>
  pos.x >= 0 && pos.x < board.size.x && pos.y >= 0 && pos.y < board.size.y;

const getEmptyLine = (length: number): boolean[] =>
  new Array(length).fill(BlockType.Empty);

const getMalusLine = (length: number): boolean[] =>
  new Array(length).fill(BlockType.Malus);

export const getEmptyBoard = (size: Vector2D): Board => ({
  blocks: new Array(size.y).fill(getEmptyLine(size.x)),
  size
});

export const isBoardBlockFilled = (board: Board, pos: Vector2D): boolean => {
  pos = floor2DVector(pos);
  return pos.x < 0 || pos.x >= board.size.x || pos.y >= board.size.y || (isPositionInsideBoard(pos, board) && board.blocks[pos.y][pos.x] != BlockType.Empty);
};

export const isBoardBlockEmpty = (board: Board, pos: Vector2D): boolean =>
  !isBoardBlockFilled(board, pos);

export const setBoardBlock = (board: Board, pos: Vector2D, type: BlockType): Board => {
  pos = floor2DVector(pos);

  if (isPositionInsideBoard(pos, board)) {
    const blocks = [...board.blocks];

    blocks[pos.y] = [...blocks[pos.y]];
    blocks[pos.y][pos.x] = type;

    board = {
      ...board,
      blocks: [...blocks]
    };
  }

  return board;
};

export const attachPieceToBoard = (piece: Piece, board: Board): Board =>
  piece.blocks.reduce(
    (board, block) => setBoardBlock(board, block, piece.type),
    board
  );

const isLineFull = (line: BlockType[]): boolean =>
  line.every(block => block >= BlockType.Filled1);

export const clearFullLines = (board: Board): Board => {
  let remainingLines = board.blocks.filter(line => !isLineFull(line));
  const numClearedLines = board.blocks.length - remainingLines.length;
  const newLines = new Array(numClearedLines).fill(getEmptyLine(board.size.x));

  return {
    ...board,
    blocks: newLines.concat(remainingLines)
  };
};

export const addMalusLines = (board: Board, numLines: number): Board => {
  const remainingLines = [ ...board.blocks ];
  remainingLines.splice(0, numLines);

  const newLines = new Array(numLines).fill(getMalusLine(board.size.x));

  return {
    ...board,
    blocks: remainingLines.concat(newLines)
  };
};
