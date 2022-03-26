'use strict';

import Board, { BlockType } from '../../src/server/Board';
import Vector2D from '../../src/server/Vector2D';

import assert from 'assert';

const getTestBoard = (blocks: number[][], numMalusLines: number = 0): Board => {
  const board = new Board(new Vector2D(10, 20));
  for (const arrayPos of blocks) {
    const pos = new Vector2D(arrayPos[0], 20 - 1 - arrayPos[1]);
    const type = pos.y < 20 - numMalusLines ? BlockType.Filled1 : BlockType.Malus;
    board.setBlock(pos, type);
  }
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

  it('should add 2 malus lines and make all blocks above rise', () => {
    const board = getTestBoard([
             [1,1], [2,1],               [5,1],        [7,1],
                    [2,0], [3,0],        [5,0],        [7,0],
    ]);

    board.addMalusLines(2);

    const expected = getTestBoard([
             [1,3], [2,3],               [5,3],        [7,3],
                    [2,2], [3,2],        [5,2],        [7,2],
      [0,1], [1,1], [2,1], [3,1], [4,1], [5,1], [6,1], [7,1], [8,1], [9,1],
      [0,0], [1,0], [2,0], [3,0], [4,0], [5,0], [6,0], [7,0], [8,0], [9,0],
    ], 2);

    assert.deepStrictEqual(board, expected);
  });
});
