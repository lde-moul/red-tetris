'use strict';

import { BlockType } from "./Board";
import Player from "./Player";
import Vector2D from "./Vector2D";

export default class Piece {
  static wallKickOffsets: Vector2D[] = [
    new Vector2D( 0,  0),
    new Vector2D(-1,  0),
    new Vector2D( 1,  0),
    new Vector2D(-2,  0),
    new Vector2D( 2,  0),
    new Vector2D( 0, -1),
  ];

  blocks: Vector2D[];
  center: Vector2D;
  type: BlockType;
  player: Player;

  constructor(blocks: Vector2D[], center: Vector2D, type: BlockType, player: Player = null) {
    this.blocks = blocks;
    this.center = center;
    this.type = type;
    this.player = player;
  }

  clone(): Piece {
    return new Piece(
      this.blocks.map(block => block.clone()),
      this.center.clone(),
      this.type,
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

  isOverflowing(): boolean {
    return !this.blocks.every(block => this.player.board.isPositionInside(block));
  }

  move(offset: Vector2D) {
    this.translate(offset);

    if (!this.canBeHere())
    {
      this.translate(offset.opposite());

      if (offset.y > 0)
      {
        this.land();

        if (!this.player.lost)
          this.player.spawnNextPiece();
      }
    }
  }

  turn() {
    this.rotateCW();

    for (const offset of Piece.wallKickOffsets) {
      this.translate(offset);
      if (this.canBeHere())
        return;
      this.translate(offset.opposite());
    }

    this.rotateCCW();
  }

  drop() {
    do {
      this.translate(new Vector2D(0, 1));
    } while (this.canBeHere());

    this.translate(new Vector2D(0, -1));
    this.land();

    if (!this.player.lost)
      this.player.spawnNextPiece();
  }

  land() {
    const board = this.player.board;

    board.attachPiece(this);

    if (this.isOverflowing())
      this.player.lose();
    else {
      const numMalusLines = board.clearFullLines() - 1;

      if (numMalusLines > 0) {
        for (const opponent of this.player.room.players)
          if (opponent != this.player && opponent.board) {
            opponent.board.addMalusLines(numMalusLines);

            if (opponent.piece)
              opponent.piece.translate(new Vector2D(0, -numMalusLines));

            opponent.socket.emit('AddMalusLines', numMalusLines);
            opponent.emitSpectrum(this.player);
          }
      }
    }

    for (const receiver of this.player.room.players)
      this.player.emitSpectrum(receiver);
  }
};
