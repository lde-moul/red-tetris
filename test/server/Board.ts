'use strict';

import Board from '../../src/server/Board';
import Vector2D from '../../src/server/Vector2D';

import assert from 'assert';

const getTestBoard = (blocks: number[][]): Board => {
  const board = new Board();
  for (const pos of blocks)
    board.setBlock(new Vector2D(pos[0], 20 + 4 - 1 - pos[1]), true);
  return board;
}

describe('Board', function() {
  it('should clear 2 lines and make all blocks above fall', () => {
    const board = getTestBoard([
             [1,3], [2,3],               [5,3],        [7,3],
                    [2,2], [3,2],        [5,2],        [7,2],
      [0,1], [1,1], [2,1], [3,1], [4,1], [5,1], [6,1], [7,1], [8,1], [9,1],
      [0,0], [1,0], [2,0], [3,0], [4,0], [5,0], [6,0], [7,0], [8,0], [9,0],
    ]);

    board.clearFullLines();

    const expected = getTestBoard([
             [1,1], [2,1],               [5,1],        [7,1],
                    [2,0], [3,0],        [5,0],        [7,0],
    ]);

    assert.deepStrictEqual(board, expected);
  });
});
