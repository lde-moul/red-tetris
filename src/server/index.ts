'use strict';

import Player from './Player';

const express = require('express');
const http = require('http');
import { Server, Socket } from 'socket.io';

const app = express();
const server = http.createServer(app);
const io = new Server(server);

const port = process.env.PORT;

let players: Player[] = [];

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
  let player = new Player();
  players.push(player);

  socket.on('disconnect', () => {
    players.splice(players.indexOf(player), 1);
  })

  socket.on('CreatePlayer', (name: string, ack: Function) => {
    player.name = name;

    if (typeof ack === 'function')
      ack(true);
  });

  });
});

server.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
