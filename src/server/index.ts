'use strict';

import Player from './Player';
import Room from './Room';

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

    socket.emit('PlayerCreated');
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
  });
});

server.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
