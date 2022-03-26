'use strict';

import Player, { isBoardBlockEmpty } from "./Player";
import Vector2D, { add2DVectors, rotatePoint } from "./Vector2D";

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
    const piece = pieceQueue.shift();

    return { ...player, piece, pieceQueue };
  };
