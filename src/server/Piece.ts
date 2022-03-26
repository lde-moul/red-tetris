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
    if (offset.y > 0)
      this.player.lateness = Math.max(this.player.lateness - 500, -1000);

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
    this.player.lateness = Math.max(this.player.lateness - 500, -1000);

    do {
      this.translate(new Vector2D(0, 1));
    } while (this.canBeHere());

    this.translate(new Vector2D(0, -1));
    this.land();

    if (!this.player.lost)
      this.player.spawnNextPiece();
  }

  land() {
    const player = this.player;
    const board = player.board;

    board.attachPiece(this);

    if (this.isOverflowing())
      player.lose();
    else {
      const numLinesCleared = board.clearFullLines();

      const numMalusLines = numLinesCleared - 1;
      if (numMalusLines > 0) {
        for (const opponent of player.room.players)
          if (opponent != player && opponent.board) {
            opponent.board.addMalusLines(numMalusLines);

            if (opponent.piece)
              opponent.piece.translate(new Vector2D(0, -numMalusLines));

            opponent.socket.emit('AddMalusLines', numMalusLines);
            opponent.emitSpectrum(player);
          }
      }

      player.numLinesCleared += numLinesCleared;
      player.score += [0, 40, 100, 300, 1200][numLinesCleared];
      player.socket.emit('Stats', player.score, player.numLinesCleared);
    }

    for (const receiver of player.room.players)
      player.emitSpectrum(receiver);
  }
};
