'use strict';

import { createClient, setExpectedMessages, TestClient, waitForMessage } from './ClientTesting';
import RedTetrisServer from '../src/server/RedTetrisServer';

import assert from 'assert';

describe('Connection', function() {
  let clients: TestClient[];
  let server: RedTetrisServer;

  before(async function() {
    server = new RedTetrisServer();
    await server.start();

    clients = Array.from(Array(2), createClient);
  });

  after(async function() {
    clients.forEach(client => client.socket.disconnect());
    server.close();
  });

  it('should confirm the creation of the new player with the correct name', async function() {
    clients[0].socket.emit('CreatePlayer', 'Test User');

    setExpectedMessages(clients[0], 'PlayerCreated');
    const [ name ] = await waitForMessage(clients[0], 'PlayerCreated');
    assert.deepStrictEqual(name, 'Test User');
  });

  it('should refuse the creation of a new player if the name is already taken', async function() {
    clients[1].socket.emit('CreatePlayer', 'Test User');

    setExpectedMessages(clients[1], 'PlayerNameExists');
    await waitForMessage(clients[1], 'PlayerNameExists');

    clients[1].socket.emit('CreatePlayer', 'Test User 2');
  });

  it('should send an empty room state after creating a room', async function() {
    clients[0].socket.emit('CreateRoom', 'Test Room');

    setExpectedMessages(clients[0], 'RoomState');
    const [ room ] = await waitForMessage(clients[0], 'RoomState');

    assert.deepStrictEqual(room, {
      name: 'Test Room',
      phase: 'preparation',
      players: []
    });
  });

  it('should refuse the creation of a new room if the name is already taken', async function() {
    clients[1].socket.emit('CreateRoom', 'Test Room');

    setExpectedMessages(clients[1], 'RoomNameExists');
    await waitForMessage(clients[1], 'RoomNameExists');
  });

  it('should emit the room state and add the player if the player joins a room', async function() {
    clients[1].socket.emit('JoinRoom', 'Test Room');
    setExpectedMessages(clients[1], 'RoomState', 'JoinRoom');
    await waitForMessage(clients[1], 'RoomState');
    await waitForMessage(clients[1], 'JoinRoom');
  });

  it('should notify the remaining player and pick a new host when the host leaves the room', async function() {
    clients[0].socket.emit('LeaveRoom');
    setExpectedMessages(clients[1], 'LeaveRoom', 'SetHost');
    await waitForMessage(clients[1], 'LeaveRoom');
    await waitForMessage(clients[1], 'SetHost');

    clients[0].socket.emit('JoinRoom', 'Test Room');
  });

  it('should change the host if the host picks a new one', async function() {
    clients[1].socket.emit('ChangeHost', 'Test User');

    setExpectedMessages(clients[0], 'SetHost');
    setExpectedMessages(clients[1], 'SetHost');

    await waitForMessage(clients[0], 'SetHost');
    await waitForMessage(clients[1], 'SetHost');
  });

  it('should start a new game when the host decides to', async function() {
    clients[0].socket.emit('StartGame');

    setExpectedMessages(clients[0], 'StartGame');
    setExpectedMessages(clients[1], 'StartGame');

    await waitForMessage(clients[0], 'StartGame');
    await waitForMessage(clients[1], 'StartGame');
  });
})
