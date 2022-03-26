 'use strict';

import Vector2D from "./Vector2D";

import produce from "immer";

export default interface Piece {
  blocks: Vector2D[];
  center: Vector2D;
};

export const spawnNextPiece = (player: Player) => {
  return produce(player, draft => {
    draft.piece = draft.pieceQueue.shift();
  });
};
