'use strict';

import Piece from "./Piece";
import Vector2D from "./Vector2D";

export default class {
  blocks: boolean[][];
  size: Vector2D;

  constructor(size: Vector2D) {
    this.blocks = [];
    this.size = size;

    for (let y = 0; y < this.size.y; y++) {
      this.blocks[y] = [];
      for (let x = 0; x < this.size.x; x++) {
        this.blocks[y][x] = false;
      }
    }
  }

  isPositionInside (pos: Vector2D): boolean {
    return pos.x >= 0 && pos.x < this.size.x && pos.y >= 0 && pos.y < this.size.y;
  }

  isBlockFilled (pos: Vector2D): boolean {
    pos = pos.floor();
    return pos.x < 0 || pos.x >= this.size.x || pos.y >= this.size.y || (this.isPositionInside(pos) && this.blocks[pos.y][pos.x]);
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

  isLineFull(y: number): boolean {
    return this.blocks[y].every(filled => filled);
  }

  moveDownAllLinesAbove(limit: number) {
    for (let y = limit; y > 0; y--)
      for (let x = 0; x < this.blocks[y].length; x++)
        this.blocks[y][x] = this.blocks[y - 1][x];

    for (let x = 0; x < this.blocks[0].length; x++)
      this.blocks[0][x] = false;
  }

  clearFullLines() {
    for (let y = 0; y < this.blocks.length; y++)
      if (this.isLineFull(y))
        this.moveDownAllLinesAbove(y);
  }

  getHighestBlockInColumn(x: number): number {
    let y: number;
    for (y = 0; y < this.blocks.length; y++)
      if (this.blocks[y][x])
        return y;
    return y;
  }

  getSpectrum(): number[] {
    let spectrum = [];
    for (let x = 0; x < this.size.x; x++)
      spectrum[x] = this.size.y - this.getHighestBlockInColumn(x);
    return spectrum;
  }
}
