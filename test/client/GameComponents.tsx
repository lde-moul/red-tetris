'use strict';

import { renderApp, setTestSocket } from '../ComponentTesting';
import { BlockType } from '../../src/client/Board';
import Board from '../../src/client/components/Board';
import PieceQueue from '../../src/client/components/PieceQueue';
import PlayerInfo from '../../src/client/components/PlayerInfo';
import HUD from '../../src/client/components/HUD';

import jsdom from 'jsdom-global';
jsdom();

import assert from 'assert';
import React from 'react';
import { render } from '@testing-library/react';

describe('Game components', function() {
  before(() => {
    setTestSocket();
  });

  const getTestBoardTemplate = (e: any, a: any, b: any, m: any): any[][] => [
    [e, e, e, e, e, e, e, e, e, e],
    [e, e, e, e, e, e, e, e, e, e],
    [e, e, e, e, e, e, e, e, e, e],
    [e, e, e, e, e, e, e, e, e, e],
    [e, e, e, e, e, e, e, e, e, e],
    [e, e, e, e, e, e, e, e, e, e],
    [e, e, e, e, e, e, e, e, e, e],
    [e, e, e, e, e, e, e, e, e, e],
    [e, e, e, e, e, e, e, e, e, e],
    [e, e, e, e, e, e, e, e, e, e],
    [e, e, e, e, e, e, b, e, e, e],
    [e, e, e, e, e, e, b, e, e, e],
    [e, e, e, e, e, e, b, e, e, e],
    [e, e, e, e, e, e, b, e, e, e],
    [e, e, e, e, e, e, e, e, e, e],
    [e, e, e, e, e, e, e, e, e, e],
    [e, e, a, e, e, e, e, e, e, e],
    [e, a, a, a, e, e, e, e, e, e],
    [m, m, m, m, m, m, m, m, m, m],
    [m, m, m, m, m, m, m, m, m, m],
  ];

  const flattenBoard = (board: any[][]) => {
    let flattenedBoard = [];

    board.forEach(line =>
      line.forEach(element =>
        flattenedBoard.push(element)
      )
    );

    return flattenedBoard;
  };

  const assertBoardClasses = (board: Element, expectedClasses: string[][]) => {
    const children = board.children;
    const flatClasses = flattenBoard(expectedClasses);

    for (let i = 0; i < children.length; i++)
      assert(children[i].classList.contains(flatClasses[i]));
  };

  const testBoard = {
    blocks: getTestBoardTemplate(BlockType.Empty, BlockType.Filled1, BlockType.Filled2, BlockType.Malus),
    size: { x: 10, y: 20 }
  };

  const testPiece = {
    blocks: [
      { x: 0.5, y: 0.5 },
      { x: 0.5, y: 1.5 },
      { x: 1.5, y: 1.5 },
      { x: 2.5, y: 1.5 },
    ],
    center: { x: 1.5, y: 1.5 },
    type: BlockType.Filled2
  };

  const testState = {
    pageId: 'Game',
    playerName: 'Test User 1',
    roomNames: ['Test Room'],
    room: {
      name: 'Test Room',
      tick: 10,
      hostName: 'Test User 1',
      player: {
        board: testBoard,
        piece: testPiece,
        pieceQueue: [ testPiece ]
      },
      players: [
        {
          name: 'Test User 1',
          lost: false,
          spectrum: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
        },
        {
          name: 'Test User 2',
          lost: false,
          spectrum: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
        },
      ]
    }
  };

  it('should render the game board', () => {
    render(
      <Board board={testBoard} className="board" />
    );

    const board = document.querySelector('.board').children;

    const expectedClasses = flattenBoard(getTestBoardTemplate('empty-block', 'full-block1', 'full-block2', 'malus-block'));
    for (let i = 0; i < board.length; i++)
      assert(board[i].classList.contains(expectedClasses[i]));
  });

  it('should render the game HUD', () => {
    render(
      <HUD pieceQueue={testState.room.player.pieceQueue} players={[ testState.room.players[1] ]} />
    );

    const hud = document.querySelector('.hud');
    const localInfo = hud.querySelector('.game-local-player-info');
    const opponentInfo = hud.querySelectorAll('.game-player-infos .game-player-info');

    assert(localInfo.querySelector('.piece-queue'));
    assert.strictEqual(opponentInfo.length, 1);
  });

  it('should render the piece queue', () => {
    render(
      <PieceQueue pieceQueue={testState.room.player.pieceQueue} />
    );

    const queue = document.querySelector('.piece-queue').children;

    const e = 'empty-block';
    const f = 'full-block2';
    assertBoardClasses(
      queue[0],
      [
        [f, e, e, e],
        [f, f, f, e],
      ]
    );
  });

  it('should render the opponent information', () => {
    render(
      <PlayerInfo player={testState.room.players[1]} numPlayers={1} />
    );

    const info = document.querySelector('.game-player-info');
    const name = info.querySelector('.game-player-name');
    const spectrum = info.querySelector('.spectrum').children;

    assert.strictEqual(name.textContent, 'Test User 2');
    assert.strictEqual(spectrum.length, 10);
  });

  it('should render the game component', () => {
    renderApp(testState);

    const game = document.querySelector('.game');
    const board = game.querySelector('.board').children;
    const hud = game.querySelector('.hud');

    assert.strictEqual(board.length, 200);
    assert(hud);
  });
});
