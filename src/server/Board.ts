'use strict';

import Piece from "./Piece";
import Vector2D from "./Vector2D";

export default class {
  blocks: boolean[][];

  constructor() {
    this.blocks = [];

    for (let y = 0; y < 20 + 4; y++) {
      this.blocks[y] = [];
      for (let x = 0; x < 10; x++) {
        this.blocks[y][x] = false;
      }
    }
  }

  isPositionInside (pos: Vector2D) {
    return pos.x >= 0 && pos.x < 10 && pos.y >= 0 && pos.y < 20 + 4;
  }

  isBlockFilled (pos: Vector2D): boolean {
    pos = pos.floor();
    return !this.isPositionInside(pos) || this.blocks[pos.y][pos.x];
  };

  isBlockEmpty(pos: Vector2D): boolean {
    return !this.isBlockFilled(pos);
  }

  setBlock(pos: Vector2D, filled: boolean) {
    pos = pos.floor();

    if (this.isPositionInside(pos))
      this.blocks[pos.y][pos.x] = filled;
  }

  attachPiece(piece: Piece) {
    for (const block of piece.blocks)
      this.setBlock(block, true);
  }
}
