'use strict';

import Board, { attachPieceToBoard, BlockType, clearFullLines, isBoardBlockEmpty, isPositionInsideBoard } from "./Board";
import Player from "./LocalPlayer";
import Vector2D, { add2DVectors, rotatePoint } from "./Vector2D";

import { Socket } from "socket.io-client";

export default interface Piece {
  blocks: Vector2D[];
  center: Vector2D;
  type: BlockType;
};

export const translatePiece = (piece: Piece, offset: Vector2D): Piece => ({
  ...piece,
  blocks: piece.blocks.map(block => add2DVectors(block, offset)),
  center: add2DVectors(piece.center, offset)
});

export const rotatePiece = (piece: Piece): Piece => ({
  ...piece,
  blocks: piece.blocks.map(block => rotatePoint(block, piece.center)),
  center: piece.center
});

export const canPieceBeHere = (piece: Piece, board: Board): boolean =>
  piece.blocks.every(block => isBoardBlockEmpty(board, block));

export const isPieceOverflowing = (piece: Piece, board: Board): boolean =>
  !piece.blocks.every(block => isPositionInsideBoard(block, board));

export const spawnNextPiece = (player: Player): Player => {
  const pieceQueue = [...player.pieceQueue];
  const piece = pieceQueue.shift() ?? null;

  return { ...player, piece, pieceQueue };
};

export const movePiece = (player: Player, offset: Vector2D): Player => {
  const movedPiece = translatePiece(player.piece, offset);

  if (canPieceBeHere(movedPiece, player.board))
    return {
      ...player,
      piece: movedPiece
    };
  else if (offset.y > 0) {
    const attachedBoard = attachPieceToBoard(player.piece, player.board);

    if (isPieceOverflowing(player.piece, player.board))
      return {
        ...player,
        piece: null,
        board: attachedBoard
      };
    else
      return spawnNextPiece({
        ...player,
        board: clearFullLines(attachedBoard)
      });
  }
  else
    return player;
};
