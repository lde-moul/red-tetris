'use strict';

import { attachPieceToBoard, detachPieceFromBoard, getEmptyBoard } from '../../src/client/Board';
import shapes from '../../src/server/shapes';

import assert from 'assert';
import produce from 'immer';

describe('Board', function() {
  it('should return a 10x20 empty board', () => {
    const l = [false, false, false, false, false, false, false, false, false, false];
    const expected = {
      blocks: [l, l, l, l, l, l, l, l, l, l, l, l, l, l, l, l, l, l, l, l]
    };

    assert.deepStrictEqual(getEmptyBoard(), expected);
  });

  it('should fill and then unfill 4 blocks on the board when a T piece is attached to and then detached from it', () => {
    const expected = produce(getEmptyBoard(), prev => {
      prev.blocks[0][1] = true;
      prev.blocks[1][0] = true;
      prev.blocks[1][1] = true;
      prev.blocks[1][2] = true;
    });

    let board = attachPieceToBoard(shapes[5], getEmptyBoard());
    assert.deepStrictEqual(board, expected);

    board = detachPieceFromBoard(shapes[5], board);
    assert.deepStrictEqual(board, getEmptyBoard());
  });
});
