'use strict';

import Board, { addMalusLines, attachPieceToBoard, BlockType, clearFullLines, detachPieceFromBoard, getEmptyBoard, setBoardBlock } from '../../src/client/Board';
import shapes from '../../src/server/shapes';

import assert from 'assert';
import produce from 'immer';

const getTestBoard = (blocks: number[][], numMalusLines: number = 0): Board => {
  let board = getEmptyBoard({ x: 10, y: 20 });
  blocks.forEach(arrayPos => {
    const pos = { x: arrayPos[0], y: 20 - 1 - arrayPos[1] };
    const type = pos.y < 20 - numMalusLines ? BlockType.Filled1 : BlockType.Malus;
    board = setBoardBlock(board, pos, type);
  });
  return board;
}

describe('Board', function() {
  it('should return a 10x20 empty board', () => {
    const e = BlockType.Empty;
    const l = [e, e, e, e, e, e, e, e, e, e];
    const expected = {
      blocks: [l, l, l, l, l, l, l, l, l, l, l, l, l, l, l, l, l, l, l, l],
      size: { x: 10, y: 20 }
    };

    assert.deepStrictEqual(getEmptyBoard({ x: 10, y: 20 }), expected);
  });

  it('should fill and then unfill 4 blocks on the board when a T piece is attached to and then detached from it', () => {
    const expected = produce(getEmptyBoard({ x: 10, y: 20 }), prev => {
      prev.blocks[0][1] = BlockType.Filled1;
      prev.blocks[1][0] = BlockType.Filled1;
      prev.blocks[1][1] = BlockType.Filled1;
      prev.blocks[1][2] = BlockType.Filled1;
    });

    let board = attachPieceToBoard(shapes[5], getEmptyBoard({ x: 10, y: 20 }));
    assert.deepStrictEqual(board, expected);

    board = detachPieceFromBoard(shapes[5], board);
    assert.deepStrictEqual(board, getEmptyBoard({ x: 10, y: 20 }));
  });

  it('should clear 2 lines and make all blocks above fall', () => {
    let board = getTestBoard([
             [1,3], [2,3],               [5,3],        [7,3],
                    [2,2], [3,2],        [5,2],        [7,2],
      [0,1], [1,1], [2,1], [3,1], [4,1], [5,1], [6,1], [7,1], [8,1], [9,1],
      [0,0], [1,0], [2,0], [3,0], [4,0], [5,0], [6,0], [7,0], [8,0], [9,0],
    ]);

    board = clearFullLines(board);

    const expected = getTestBoard([
             [1,1], [2,1],               [5,1],        [7,1],
                    [2,0], [3,0],        [5,0],        [7,0],
    ]);

    assert.deepStrictEqual(board, expected);
  });

  it('should add 2 malus lines and make all blocks above rise', () => {
    let board = getTestBoard([
             [1,1], [2,1],               [5,1],        [7,1],
                    [2,0], [3,0],        [5,0],        [7,0],
    ]);

    board = addMalusLines(board, 2);

    const expected = getTestBoard([
             [1,3], [2,3],               [5,3],        [7,3],
                    [2,2], [3,2],        [5,2],        [7,2],
      [0,1], [1,1], [2,1], [3,1], [4,1], [5,1], [6,1], [7,1], [8,1], [9,1],
      [0,0], [1,0], [2,0], [3,0], [4,0], [5,0], [6,0], [7,0], [8,0], [9,0],
    ], 2);

    assert.deepStrictEqual(board, expected);
  });
});
