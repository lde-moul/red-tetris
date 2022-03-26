'use strict';

import Piece from "./Piece";
import Vector2D from "./Vector2D";

export enum BlockType {
  Empty,
  Malus,
  Filled
}

export default class {
  blocks: BlockType[][];
  size: Vector2D;

  constructor(size: Vector2D) {
    this.blocks = [];
    this.size = size;

    for (let y = 0; y < this.size.y; y++) {
      this.blocks[y] = [];
      for (let x = 0; x < this.size.x; x++) {
        this.blocks[y][x] = BlockType.Empty;
      }
    }
  }

  isPositionInside (pos: Vector2D): boolean {
    return pos.x >= 0 && pos.x < this.size.x && pos.y >= 0 && pos.y < this.size.y;
  }

  isBlockFilled (pos: Vector2D): boolean {
    pos = pos.floor();
    return pos.x < 0 || pos.x >= this.size.x || pos.y >= this.size.y || (this.isPositionInside(pos) && this.blocks[pos.y][pos.x] != BlockType.Empty);
  };

  isBlockEmpty(pos: Vector2D): boolean {
    return !this.isBlockFilled(pos);
  }

  setBlock(pos: Vector2D, blockType: BlockType) {
    pos = pos.floor();

    if (this.isPositionInside(pos))
      this.blocks[pos.y][pos.x] = blockType;
  }

  attachPiece(piece: Piece) {
    for (const block of piece.blocks)
      this.setBlock(block, BlockType.Filled);
  }

  isLineFull(y: number): boolean {
    return this.blocks[y].every(type => type == BlockType.Filled);
  }

  moveLine(oldY: number, newY: number, blockType: BlockType) {
    const blocks = this.blocks;

    for (let x = 0; x < blocks[oldY].length; x++) {
      blocks[newY][x] = blocks[oldY][x];
      blocks[oldY][x] = blockType;
    }
  }

  moveDownAllLinesAbove(limit: number) {
    for (let y = limit; y > 0; y--)
      this.moveLine(y - 1, y, BlockType.Empty);
  }

  clearFullLines(): number {
    let numLinesCleared = 0;

    for (let y = 0; y < this.blocks.length; y++)
      if (this.isLineFull(y)) {
        this.moveDownAllLinesAbove(y);
        numLinesCleared++;
      }

    return numLinesCleared;
  }

  addMalusLines(numLines: number) {
    for (let y = 0; y < this.size.y - numLines; y++)
      this.moveLine(y + numLines, y, BlockType.Malus);
  }

  getHighestBlockInColumn(x: number): number {
    let y: number;
    for (y = 0; y < this.blocks.length; y++)
      if (this.blocks[y][x] != BlockType.Empty)
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
