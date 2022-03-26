'use strict';

import { canPieceBeHere, rotatePiece, translatePiece } from '../../src/client/Piece';
import { attachPieceToBoard, getEmptyBoard } from '../../src/client/Player';
import shapes from '../../src/server/shapes';

import assert from 'assert';

describe('Piece', function() {
  it('should move the piece down by 3 blocks', () => {
    const piece = { ...shapes[1] };

    const expected = {
      blocks: [
        { x: 0.5, y: 3.5 },
        { x: 0.5, y: 4.5 },
        { x: 1.5, y: 4.5 },
        { x: 2.5, y: 4.5 },
      ],
      center: { x: 1.5, y: 4.5 }
    };

    const movedPiece = translatePiece(piece, { x: 0, y: 3 });
    assert.deepStrictEqual(movedPiece, expected);
  });

  it('should rotate the piece', () => {
    const piece = { ...shapes[5] };

    const expected = {
      ...piece,
      blocks: [
        { x: 2.5, y: 1.5 },
        { x: 1.5, y: 0.5 },
        { x: 1.5, y: 1.5 },
        { x: 1.5, y: 2.5 },
      ],
    };

    assert.deepStrictEqual(rotatePiece(piece), expected);
  });

  it("should make the piece collide when it's inside the board", () => {
    assert(canPieceBeHere(shapes[3], getEmptyBoard()));
  });

  it("should make the piece collide when it's is outside the board", () => {
    const piece = translatePiece(shapes[3], { x: -1, y: 0 });
    assert(!canPieceBeHere(piece, getEmptyBoard()));
  });

  it("should make the piece collide if the board contains filled blocks at its position", () => {
    const piece = shapes[3];
    const board = attachPieceToBoard(piece, getEmptyBoard());
    assert(!canPieceBeHere(piece, board));
  });
});
