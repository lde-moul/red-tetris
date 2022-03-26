'use strict';

import { attachPieceToBoard, detachPieceFromBoard, getEmptyBoard } from '../../src/client/LocalPlayer';
import shapes from '../../src/server/shapes';

import assert from 'assert';
import produce from 'immer';

describe('Board', function() {
  it('should return a 10x24 empty board', () => {
    const l = [false, false, false, false, false, false, false, false, false, false];
    const expected = [l, l, l, l, l, l, l, l, l, l, l, l, l, l, l, l, l, l, l, l, l, l, l, l];

    assert.deepStrictEqual(getEmptyBoard(), expected);
  });

  it('should fill and then unfill 4 blocks on the board when a T piece is attached to and then detached from it', () => {
    const expected = produce(getEmptyBoard(), prev => {
      prev[0][1] = true;
      prev[1][0] = true;
      prev[1][1] = true;
      prev[1][2] = true;
      prev = [...prev];
    });

    let board = attachPieceToBoard(shapes[5], getEmptyBoard());
    assert.deepStrictEqual(board, expected);

    board = detachPieceFromBoard(shapes[5], board);
    assert.deepStrictEqual(board, getEmptyBoard());
  });
});
