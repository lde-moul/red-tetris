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
}

app.get('/bundle.js', (req, res) => {
  sendFile(res, 'dist/bundle.js');
})

app.get('*', (req, res) => {
  sendFile(res, 'index.html');
})

io.on('connection', (socket: Socket) => {
  let player = new Player(socket);
  players.push(player);

  socket.on('disconnect', () => {
    if (player.room)
      player.room.removePlayer(player);

    players.splice(players.indexOf(player), 1);
  })

  socket.on('CreatePlayer', (name: string) => {
    player.name = name;

    socket.emit('PlayerCreated', name);
    socket.emit('RoomNames', rooms.map(room => room.name));
  });

  socket.on('JoinRoom', (name: string) => {
    let room = rooms.find(room => room.name == name);

    if (!room)
      return;

    room.emitState(player);
    room.addPlayer(player);
  });

  socket.on('LeaveRoom', () => {
    if (!player.room)
      return;

    player.room.removePlayer(player);
  });

  socket.on('CreateRoom', (name: string) => {
    let room = new Room(name);
    rooms.push(room);

    room.emitState(player);
    room.addPlayer(player);
    room.setHost(player);
  });

  socket.on('StartGame', () => {
    let room = player.room;

    if (!(room && room.phase == 'preparation' && room.host == player))
      return;

    room.startGame();
  });

  socket.on('MovePiece', (offset: Vector2D) => {
    if (!player.piece)
      return;

    let piece = player.piece;

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
    player.spawnNextPiece();
  });
});

server.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
