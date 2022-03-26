'use strict';

import Player from './Player';
import Room from './Room';
import Vector2D from './Vector2D';

const express = require('express');
const http = require('http');
import { Server, Socket } from 'socket.io';

const app = express();
const server = http.createServer(app);
const io = new Server(server);

const port = process.env.PORT;

let players: Player[] = [];
let rooms: Room[] = [];

const sendFile = (res, path) => {
  res.sendFile(path, { root: __dirname + '/../..' });
};

const leaveRoom = (player: Player) => {
  const room = player.room;
  if (room) {
    room.removePlayer(player);
    if (room.players.length === 0) {
      rooms.splice(rooms.indexOf(room), 1);

      for (const receiver of players)
        receiver.socket.emit('RoomNames', rooms.map(room => room.name));
    }
  }
};

app.get('/bundle.js', (req, res) => {
  sendFile(res, 'dist/bundle.js');
});

app.get('*', (req, res) => {
  sendFile(res, 'index.html');
});

io.on('connection', (socket: Socket) => {
  let player = new Player(socket);
  players.push(player);

  socket.on('disconnect', () => {
    leaveRoom(player);
    players.splice(players.indexOf(player), 1);
  });

  socket.on('CreatePlayer', (name: string) => {
    player.name = name;

    socket.emit('PlayerCreated', name);
    socket.emit('RoomNames', rooms.map(room => room.name));
  });

  socket.on('JoinRoom', (name: string) => {
    let room = rooms.find(room => room.name == name);

    if (!room || player.room)
      return;

    room.emitState(player);
    room.addPlayer(player);
  });

  socket.on('LeaveRoom', () => {
    leaveRoom(player);
  });

  socket.on('CreateRoom', (name: string) => {
    let room = new Room(name);
    rooms.push(room);

    room.emitState(player);
    room.addPlayer(player);
    room.setHost(player);

    for (const receiver of players)
      receiver.socket.emit('RoomNames', rooms.map(room => room.name));
  });

  socket.on('ChangeHost', (name: string) => {
    if (!player.room)
      return;

    const host = player.room.players.find(player => player.name == name);
    if (host)
      player.room.setHost(host);
  });

  socket.on('StartGame', () => {
    let room = player.room;

    if (!(room && room.phase == 'preparation' && room.host == player))
      return;

    room.startGame();
  });

  socket.on('RestartGame', () => {
    let room = player.room;

    if (!(room && room.phase == 'results' && room.host == player))
      return;

    room.startPreparation();
  });

  socket.on('MovePiece', (offset: Vector2D) => {
    let piece = player.piece;
    if (!piece)
      return;

    offset = new Vector2D(offset.x, offset.y);

    const validOffsets = [-1, 0, 1];
    if (!(validOffsets.includes(offset.x) && validOffsets.includes(offset.y)))
      return;

    piece.translate(offset);

    if (!piece.canBeHere())
    {
      piece.translate(offset.opposite());

      if (offset.y > 0)
      {
        piece.land();

        if (!player.lost)
          player.spawnNextPiece();
      }
    }
  });

  socket.on('RotatePiece', () => {
    if (!player.piece)
      return;

    player.piece.rotateCW();

    if (!player.piece.canBeHere())
      player.piece.rotateCCW();
  });

  socket.on('DropPiece', () => {
    let piece = player.piece;
    if (!piece)
      return;

    do {
      piece.translate(new Vector2D(0, 1));
    } while (piece.canBeHere());

    piece.translate(new Vector2D(0, -1));
    piece.land();

    if (!player.lost)
      player.spawnNextPiece();
  });
});

server.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
