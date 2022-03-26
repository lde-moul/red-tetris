'use strict';

import { assertMessageEmitted, setTestSocket } from '../ClientTesting';
import { BlockType, getEmptyBoard } from '../../src/client/Board';
import { dropPieceAction, movePieceDownAction, movePieceLeftAction, movePieceRightAction, rotatePieceAction } from '../../src/client/GameActions';
import LocalPlayer from '../../src/client/LocalPlayer';
import Piece, { translatePiece } from '../../src/client/Piece';
import useSocket from '../../src/client/socket';
import shapes from '../../src/server/shapes';

import assert from 'assert';
import produce from 'immer';

describe('Game actions', function() {
  const getShape = (id: number): Piece => ({
    blocks: shapes[id].blocks,
    center: {
      x: shapes[id].center.x,
      y: shapes[id].center.y
    },
    type: shapes[id].type
  });

  before(() => {
    setTestSocket();
  });

  it('should move the piece left by 1 block and notify the server', () => {
    const player: LocalPlayer = {
      board: getEmptyBoard({ x: 10, y: 20 }),
      piece: translatePiece(getShape(1), { x: 1, y: 0 }),
      pieceQueue: [],
      fallTick: 0,
      score: 0,
      numLinesCleared: 0
    };

    let movedPlayer: LocalPlayer;
    assertMessageEmitted('MovePiece', () => {
      movedPlayer = movePieceLeftAction(player, useSocket());
    });

    const expected = {
      board: getEmptyBoard({ x: 10, y: 20 }),
      piece: {
        blocks: [
          { x: 0.5, y: 0.5 },
          { x: 0.5, y: 1.5 },
          { x: 1.5, y: 1.5 },
          { x: 2.5, y: 1.5 },
        ],
        center: { x: 1.5, y: 1.5 },
        type: BlockType.Filled2
      },
      pieceQueue: [],
      fallTick: 0,
      score: 0,
      numLinesCleared: 0
    };

    assert.deepStrictEqual(movedPlayer, expected);
  });

  it('should move the piece right by 1 block and notify the server', () => {
    const player: LocalPlayer = {
      board: getEmptyBoard({ x: 10, y: 20 }),
      piece: getShape(1),
      pieceQueue: [],
      fallTick: 0,
      score: 0,
      numLinesCleared: 0
    };

    let movedPlayer: LocalPlayer;
    assertMessageEmitted('MovePiece', () => {
      movedPlayer = movePieceRightAction(player, useSocket());
    });

    const expected = {
      board: getEmptyBoard({ x: 10, y: 20 }),
      piece: {
        blocks: [
          { x: 1.5, y: 0.5 },
          { x: 1.5, y: 1.5 },
          { x: 2.5, y: 1.5 },
          { x: 3.5, y: 1.5 },
        ],
        center: { x: 2.5, y: 1.5 },
        type: BlockType.Filled2
      },
      pieceQueue: [],
      fallTick: 0,
      score: 0,
      numLinesCleared: 0
    };

    assert.deepStrictEqual(movedPlayer, expected);
  });

  it('should move the piece down by 1 block and notify the server', () => {
    const player: LocalPlayer = {
      board: getEmptyBoard({ x: 10, y: 20 }),
      piece: getShape(1),
      pieceQueue: [],
      fallTick: 0,
      score: 0,
      numLinesCleared: 0
    };

    let movedPlayer: LocalPlayer;
    assertMessageEmitted('MovePiece', () => {
      movedPlayer = movePieceDownAction(player, 10, useSocket());
    });

    const expected = {
      board: getEmptyBoard({ x: 10, y: 20 }),
      piece: {
        blocks: [
          { x: 0.5, y: 1.5 },
          { x: 0.5, y: 2.5 },
          { x: 1.5, y: 2.5 },
          { x: 2.5, y: 2.5 },
        ],
        center: { x: 1.5, y: 2.5 },
        type: BlockType.Filled2
      },
      pieceQueue: [],
      fallTick: 10,
      score: 0,
      numLinesCleared: 0
    };

    assert.deepStrictEqual(movedPlayer, expected);
  });

  it('should rotate the piece and notify the server', () => {
    const player: LocalPlayer = {
      board: getEmptyBoard({ x: 10, y: 20 }),
      piece: getShape(5),
      pieceQueue: [],
      fallTick: 0,
      score: 0,
      numLinesCleared: 0
    };

    let rotatedPlayer: LocalPlayer;
    assertMessageEmitted('RotatePiece', () => {
      rotatedPlayer = rotatePieceAction(player, useSocket());
    });

    const expected = {
      board: getEmptyBoard({ x: 10, y: 20 }),
      piece: {
        ...player.piece,
        blocks: [
          { x: 2.5, y: 1.5 },
          { x: 1.5, y: 0.5 },
          { x: 1.5, y: 1.5 },
          { x: 1.5, y: 2.5 },
        ],
      },
      pieceQueue: [],
      fallTick: 0,
      score: 0,
      numLinesCleared: 0
    };

    assert.deepStrictEqual(rotatedPlayer, expected);
  });

  it('should land the piece, notify the server and spawn the next piece', () => {
    const player: LocalPlayer = {
      board: getEmptyBoard({ x: 10, y: 20 }),
      piece: getShape(0),
      pieceQueue: [getShape(1)],
      fallTick: 0,
      score: 0,
      numLinesCleared: 0
    };

    let droppedPlayer: LocalPlayer;
    assertMessageEmitted('DropPiece', () => {
      droppedPlayer = dropPieceAction(player, 10, useSocket());
    });

    const expected = {
      board: produce(getEmptyBoard({ x: 10, y: 20 }), prev => {
        prev.blocks[19][0] = BlockType.Filled1;
        prev.blocks[19][1] = BlockType.Filled1;
        prev.blocks[19][2] = BlockType.Filled1;
        prev.blocks[19][3] = BlockType.Filled1;
      }),
      piece: getShape(1),
      pieceQueue: [],
      fallTick: 10,
      score: 0,
      numLinesCleared: 0
    };

    assert.deepStrictEqual(droppedPlayer, expected);
  });
});
