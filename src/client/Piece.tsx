'use strict';

import Player from "./Player";
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

export const spawnNextPiece = (player: Player) =>
  {
    const queue = [...player.pieceQueue];
    const piece = queue.shift();

    return { ...player, piece, queue };
  };
