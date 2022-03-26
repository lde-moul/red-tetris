'use strict';

import Player from "./Player";
import Vector2D from "./Vector2D";

export default class Piece {
  blocks: Vector2D[];
  center: Vector2D;
  player: Player;

  constructor(blocks: Vector2D[], center: Vector2D, player: Player = null) {
    this.blocks = blocks;
    this.center = center;
    this.player = player;
  }

  clone(): Piece {
    return new Piece(
      this.blocks.map(block => block.clone()),
      this.center.clone(),
      this.player
    );
  }

  translate(offset: Vector2D) {
    this.blocks = this.blocks.map(block => block.add(offset));
    this.center = this.center.add(offset);
  }

  rotateCW() {
    this.blocks = this.blocks.map(block => block.rotateAroundPointCW(this.center));
  }

  rotateCCW() {
    this.blocks = this.blocks.map(block => block.rotateAroundPointCCW(this.center));
  }

  canBeHere(): boolean {
    return this.blocks.every(block => this.player.board.isBlockEmpty(block));
  }
};
