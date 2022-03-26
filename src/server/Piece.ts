'use strict';

import Vector2D from "./Vector2D";

export default class Piece {
  blocks: Vector2D[];
  center: Vector2D;

  constructor(blocks: Vector2D[], center: Vector2D) {
    this.blocks = blocks;
    this.center = center;
  }

  clone() {
    return new Piece(
      this.blocks.map(block => block.clone()),
      this.center.clone()
    );
  }

  translate(offset: Vector2D) {
    this.blocks = this.blocks.map(block => block.add(offset));
    this.center = this.center.add(offset);
  }

  rotate() {
    const center = this.center;

    this.blocks = this.blocks.map(block => new Vector2D(
      center.x - (block.y - center.y),
      center.y + (block.x - center.x),
    ));
  }
};
