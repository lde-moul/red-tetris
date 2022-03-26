'use strict';

import { createClient, setExpectedMessages, TestClient, waitForMessage } from './ClientTesting';
import { BlockType } from '../src/client/Board';
import Board from '../src/server/Board';
import RedTetrisServer from '../src/server/RedTetrisServer';
import shapes from '../src/server/shapes';
import Vector2D from '../src/server/Vector2D';

import assert from 'assert';

describe('Game communication', function() {
  let clients: TestClient[];
  let server: RedTetrisServer;

  const assertMessagesEmittedToEveryone = async (...types: string[]) => {
    for (const client of clients)
      setExpectedMessages(client, ...types);

    for (const type of types)
      for (const client of clients)
        await waitForMessage(client, type);
  };

  const fillBoard = (board: Board, type: BlockType) => {
    for (let y = 0; y < board.size.y; y++)
      for (let x = 0; x < board.size.x; x++)
        board.setBlock(new Vector2D(x, y), type);
  };

  const emptyColumn = (board: Board, x: number) => {
    for (let y = 0; y < board.size.y; y++)
      board.setBlock(new Vector2D(x, y), BlockType.Empty);
  };

  before(async function() {
    server = new RedTetrisServer();
    await server.start();

    clients = Array.from(Array(2), createClient);

    clients[0].socket.emit('CreatePlayer', 'Test User');
    clients[1].socket.emit('CreatePlayer', 'Test User 2');
    clients[0].socket.emit('CreateRoom', 'Test Room');
    clients[1].socket.emit('JoinRoom', 'Test Room');
    clients[0].socket.emit('StartGame');
  });

  after(function() {
    clients.forEach(client => client.socket.disconnect());
    server.close();
  });

  it('should emit the new spectrum to all players when a piece lands from moving', async function() {
    for (let i = 0; i < 21; i++)
      clients[0].socket.emit('MovePiece', { x: 0, y: 1 });

    await assertMessagesEmittedToEveryone('Spectrum');
  });

  it('should emit the new spectrum to all players when a piece lands from dropping', async function() {
    clients[0].socket.emit('DropPiece');
    await assertMessagesEmittedToEveryone('Spectrum');
  });

  it('should emit 3 malus lines to the opponent when a player completes 4 lines', async function() {
    const player = server.rooms[0].players[0];

    const board = player.board;
    fillBoard(board, BlockType.Filled1);
    emptyColumn(board, 2);

    const piece = shapes[0].clone();
    player.piece = piece;
    piece.player = player;

    clients[0].socket.emit('RotatePiece');
    clients[0].socket.emit('DropPiece');

    setExpectedMessages(clients[1], 'AddMalusLines');
    const [ numLines ] = await waitForMessage(clients[1], 'AddMalusLines');
    assert(numLines === 3);
  });

  it('should notify all players when the last player loses', async function() {
    fillBoard(server.rooms[0].players[0].board, BlockType.Malus);
    clients[0].socket.emit('MovePiece', { x: 0, y: 1 });
    await assertMessagesEmittedToEveryone('PlayerLost', 'EndGame');
  });
})
