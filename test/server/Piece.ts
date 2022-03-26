'use strict';

import Board, { BlockType } from '../../src/server/Board';
import Piece from '../../src/server/Piece';
import Player from '../../src/server/Player';
import shapes from '../../src/server/shapes';
import Vector2D from '../../src/server/Vector2D';

import assert from 'assert';

describe('Server piece', function() {
  const makeTestPlayer = (): Player => {
    const player = new Player(null);
    player.board = new Board(new Vector2D(10, 20));

    const piece = shapes[3].clone();

    piece.player = player;
    player.piece = piece;

    return player;
  };

  it('should move the piece down by 3 blocks', () => {
    const piece = shapes[1].clone();

    const expected = new Piece(
      [
        new Vector2D(0.5, 3.5),
        new Vector2D(0.5, 4.5),
        new Vector2D(1.5, 4.5),
        new Vector2D(2.5, 4.5),
      ],
      new Vector2D(1.5, 4.5),
      BlockType.Filled2
    );

    piece.translate(new Vector2D(0, 3));
    assert.deepStrictEqual(piece, expected);
  });

  it('should rotate the piece clockwise', () => {
    const piece = shapes[5].clone();

    const expected = new Piece(
      [
        new Vector2D(2.5, 1.5),
        new Vector2D(1.5, 0.5),
        new Vector2D(1.5, 1.5),
        new Vector2D(1.5, 2.5),
      ],
      piece.center,
      BlockType.Filled6
    );

    piece.rotateCW();
    assert.deepStrictEqual(piece, expected);
  });

  it('should rotate the piece counterclockwise', () => {
    const piece = shapes[5].clone();

    const expected = new Piece(
      [
        new Vector2D(0.5, 1.5),
        new Vector2D(1.5, 2.5),
        new Vector2D(1.5, 1.5),
        new Vector2D(1.5, 0.5),
      ],
      piece.center,
      BlockType.Filled6
    );

    piece.rotateCCW();
    assert.deepStrictEqual(piece, expected);
  });

  it("should make the piece not collide when it's inside the board", () => {
    const player = makeTestPlayer();
    assert(player.piece.canBeHere());
  });

  it("should make the piece collide when it's outside the board", () => {
    const player = makeTestPlayer();
    player.piece.translate(new Vector2D(-1, 0));
    assert(!player.piece.canBeHere());
  });

  it("should make the piece collide if the board contains filled blocks at its position", () => {
    const player = makeTestPlayer();
    player.board.attachPiece(player.piece);
    assert(!player.piece.canBeHere());
  });
});
