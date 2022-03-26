'use strict';

import Player from "./Player";
import Room from "./Room";
import Vector2D from "./Vector2D";

const express = require('express');
const http = require('http');
import { Server, Socket } from 'socket.io';

export default class RedTetrisServer {
  static NAME_PATTERN = /^[\w +*/%^()=<>:,;.!?'"~@#$&-]{1,20}$/;

  static wallKickOffsets: Vector2D[] = [
    new Vector2D( 0,  0),
    new Vector2D(-1,  0),
    new Vector2D( 1,  0),
    new Vector2D(-2,  0),
    new Vector2D( 2,  0),
    new Vector2D( 0, -1),
  ];

  players: Player[];
  rooms: Room[];
  closeCallback: Function;

  constructor() {
    this.players = [];
    this.rooms = [];
  }

  start(): Promise<void> {
    const app = express();
    const server = http.createServer(app);
    const io = new Server(server);

    const port = process.env.PORT;

    const sendFile = (res, path) => {
      res.sendFile(path, { root: __dirname + '/../..' });
    };

    app.get('/bundle.js', (req, res) => {
      sendFile(res, 'dist/bundle.js');
    });

    app.get('*', (req, res) => {
      sendFile(res, 'index.html');
    });

    io.on('connection', (socket: Socket) => this.handleConnection(socket));

    return new Promise<void>((resolve, reject) => {
      server.listen(port, () => {
        console.log(`Server running on port ${port}`);

        this.closeCallback = function() {
          io.close();
          server.close(() => server.unref());
        };

        resolve();
      });
    });
  }

  close() {
    this.closeCallback();
  }

  handleConnection(socket: Socket) {
    let player = new Player(socket);
    this.players.push(player);

    socket.on('disconnect', () => this.handleDisconnect(player));

    socket.on('CreatePlayer', (name) => this.handleCreatePlayer(player, name));

    socket.on('JoinRoom', (name) => this.handleJoinRoom(player, name));
    socket.on('LeaveRoom', () => this.handleLeaveRoom(player));
    socket.on('CreateRoom', (name) => this.handleCreateRoom(player, name));

    socket.on('ChangeHost', (name) => this.handleChangeHost(player, name));
    socket.on('StartGame', () => this.handleStartGame(player));
    socket.on('RestartGame', () => this.handleRestartGame(player));

    socket.on('MovePiece', offset => this.handleMovePiece(player, offset));
    socket.on('RotatePiece', () => this.handleRotatePiece(player));
    socket.on('DropPiece', () => this.handleDropPiece(player));

    player.socket.emit('RoomNames', this.rooms.map(room => room.name));
  }

  handleDisconnect(player: Player) {
    this.leaveRoom(player);
    this.players.splice(this.players.indexOf(player), 1);
  }

  handleCreatePlayer(player: Player, name: string) {
    if (typeof name != 'string')
      return;

    name = name.trim();

    if (!name.match(RedTetrisServer.NAME_PATTERN))
      return;

    const exists = this.players.find(player => player.name.toLowerCase() === name.toLowerCase());
    if (exists) {
      player.socket.emit('PlayerNameExists');
      return;
    }

    player.name = name;

    player.socket.emit('PlayerCreated', name);
  }

  handleJoinRoom(player: Player, name: string) {
    if (typeof name != 'string')
      return;

    let room = this.rooms.find(room => room.name == name);

    if (!room || player.room)
      return;

    room.emitState(player);
    room.addPlayer(player);
  }

  handleLeaveRoom(player: Player) {
    this.leaveRoom(player);
  }

  handleCreateRoom(player: Player, name: string) {
    if (typeof name != 'string' || player.room)
      return;

    name = name.trim();

    if (!name.match(RedTetrisServer.NAME_PATTERN))
      return;

    const exists = this.rooms.find(room => room.name.toLowerCase() === name.toLowerCase());
    if (exists) {
      player.socket.emit('RoomNameExists');
      return;
    }

    let room = new Room(name);
    this.rooms.push(room);

    room.emitState(player);
    room.addPlayer(player);
    room.setHost(player);

    for (const receiver of this.players)
      receiver.socket.emit('RoomNames', this.rooms.map(room => room.name));
  }

  handleChangeHost(player: Player, name: string) {
    if (typeof name != 'string' || !player.room)
      return;

    const host = player.room.players.find(player => player.name == name);
    if (host)
      player.room.setHost(host);
  }

  handleStartGame(player: Player) {
    let room = player.room;

    if (!(room && room.phase == 'preparation' && room.host == player))
      return;

    room.startGame();
  }

  handleRestartGame(player: Player) {
    let room = player.room;

    if (!(room && room.phase == 'results' && room.host == player))
      return;

    room.startPreparation();
  }

  handleMovePiece(player: Player, offset: Vector2D) {
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
  }

  handleRotatePiece(player: Player) {
    const piece = player.piece;

    if (!piece)
      return;

    piece.rotateCW();

    for (const offset of RedTetrisServer.wallKickOffsets) {
      piece.translate(offset);
      if (piece.canBeHere())
        return;
      piece.translate(offset.opposite());
    }

    piece.rotateCCW();
  }

  handleDropPiece(player: Player) {
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
  }

  leaveRoom(player: Player) {
    const room = player.room;
    if (room) {
      room.removePlayer(player);
      if (room.players.length === 0) {
        this.rooms.splice(this.rooms.indexOf(room), 1);

        for (const receiver of this.players)
          receiver.socket.emit('RoomNames', this.rooms.map(room => room.name));
      }
    }
  };
};
