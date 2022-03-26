'use strict';

import { attachPieceToBoard, detachPieceFromBoard } from '../../src/client/Player';
import { getEmptyBoard } from '../../src/client/Player';
import shapes from '../../src/server/shapes';

import assert from 'assert';

describe('Board', function() {
  it('should return a 10x24 empty board', () => {
    const l = [false, false, false, false, false, false, false, false, false, false];
    const expected = [l, l, l, l, l, l, l, l, l, l, l, l, l, l, l, l, l, l, l, l, l, l, l, l];

    assert.deepStrictEqual(getEmptyBoard(), expected);
  });

  it('should fill and then unfill 4 blocks on the board when a T piece is attached to and then detached from it', () => {
    const expected = getEmptyBoard();
    expected[0][1] = true;
    expected[1][0] = true;
    expected[1][1] = true;
    expected[1][2] = true;

    let board = attachPieceToBoard(shapes[5], getEmptyBoard());
    assert.deepStrictEqual(board, expected);

    board = detachPieceFromBoard(shapes[5], board);
    assert.deepStrictEqual(board, getEmptyBoard());
  });
});
