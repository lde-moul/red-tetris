'use strict';

import Player from './Player';
import Room from './Room';
import Vector2D from './Vector2D';

const express = require('express');
const http = require('http');
import { Server, Socket } from 'socket.io';

const NAME_PATTERN = /^[\w +*/%^()=<>:,;.!?'"~@#$&-]{1,20}$/;

const wallKickOffsets: Vector2D[] = [
  new Vector2D( 0,  0),
  new Vector2D(-1,  0),
  new Vector2D( 1,  0),
  new Vector2D(-2,  0),
  new Vector2D( 2,  0),
  new Vector2D( 0, -1),
];

export default (): Promise<Function> => {
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
      if (typeof name != 'string')
        return;

      name = name.trim();

      if (!name.match(NAME_PATTERN))
        return;

      const exists = players.find(player => player.name.toLowerCase() === name.toLowerCase());
      if (exists) {
        socket.emit('PlayerNameExists');
        return;
      }

      player.name = name;

      socket.emit('PlayerCreated', name);
      socket.emit('RoomNames', rooms.map(room => room.name));
    });

    socket.on('JoinRoom', (name: string) => {
      if (typeof name != 'string')
        return;

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
      if (typeof name != 'string' || player.room)
        return;

      name = name.trim();

      if (!name.match(NAME_PATTERN))
        return;

      const exists = rooms.find(room => room.name.toLowerCase() === name.toLowerCase());
      if (exists) {
        socket.emit('RoomNameExists');
        return;
      }

      let room = new Room(name);
      rooms.push(room);

      room.emitState(player);
      room.addPlayer(player);
      room.setHost(player);

      for (const receiver of players)
        receiver.socket.emit('RoomNames', rooms.map(room => room.name));
    });

    socket.on('ChangeHost', (name: string) => {
      if (typeof name != 'string' || !player.room)
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

      if (!(typeof offset == 'object' && typeof offset.x == 'number' && typeof offset.y == 'number'))
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
      const piece = player.piece;

      if (!piece)
        return;

      piece.rotateCW();

      for (const offset of wallKickOffsets) {
        piece.translate(offset);
        if (piece.canBeHere())
          return;
        piece.translate(offset.opposite());
      }

      piece.rotateCCW();
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

  return new Promise<Function>((resolve, reject) => {
    server.listen(port, () => {
      console.log(`Server running on port ${port}`);

      let closeServer = function() {
        io.close();
        server.close(() => server.unref());
      };

      resolve(closeServer);
    });
  });
};
