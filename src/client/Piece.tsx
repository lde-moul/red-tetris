 'use strict';

import Player from "./Player";
import Vector2D from "./Vector2D";

export default interface Piece {
  blocks: Vector2D[];
  center: Vector2D;
};

export const spawnNextPiece = (player: Player) =>
  {
    const queue = [...player.pieceQueue];
    const piece = queue.shift();

    return { piece, queue, ...player };
  };
