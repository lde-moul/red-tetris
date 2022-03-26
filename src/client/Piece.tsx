'use strict';

import Player, { attachPieceToBoard, detachPieceFromBoard, isBoardBlockEmpty } from "./Player";
import Vector2D, { add2DVectors, rotatePoint } from "./Vector2D";

import { Socket } from "socket.io-client";

export default interface Piece {
  blocks: Vector2D[];
  center: Vector2D;
};

export const translatePiece = (piece: Piece, offset: Vector2D) => ({
  blocks: piece.blocks.map(block => add2DVectors(block, offset)),
  center: add2DVectors(piece.center, offset)
});

export const rotatePiece = (piece: Piece): Piece => ({
  blocks: piece.blocks.map(block => rotatePoint(block, piece.center)),
  center: piece.center
});

export const canPieceBeHere = (piece: Piece, board: boolean[][]): boolean =>
  piece.blocks.every(block => isBoardBlockEmpty(board, block));

export const spawnNextPiece = (player: Player): Player =>
  {
    const pieceQueue = [...player.pieceQueue];
    const piece = pieceQueue.shift() ?? null;

    return { ...player, piece, pieceQueue };
  };

export const movePiece = (player: Player, offset: Vector2D, socket: Socket): Player => {
  socket.emit('MovePiece', offset);

  const boardWithoutPiece = detachPieceFromBoard(player.piece, player.board);
  const movedPiece = translatePiece(player.piece, offset);

  if (canPieceBeHere(movedPiece, boardWithoutPiece))
    return {
      ...player,
      piece: movedPiece,
      board: attachPieceToBoard(movedPiece, boardWithoutPiece)
    };
  else if (offset.y > 0)
    return spawnNextPiece(player);
  else
    return player;
};
