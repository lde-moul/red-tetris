'use strict';

import Board from "./Board";
import Piece from "./Piece";
import Player from "./Player";
import shapes from "./shapes";
import Vector2D from "./Vector2D";

export default class {
  name: string;
  phase: 'preparation' | 'game';
  players: Player[];
  host?: Player;
  pieceQueue: Piece[];

  constructor(name: string) {
    this.name = name;
    this.phase = 'preparation';
    this.players = [];
    this.pieceQueue = [];
  }

  addPlayer(player: Player) {
    this.players.push(player);
    player.room = this;

    for (const receiver of this.players)
      receiver.socket.emit('JoinRoom', player.name);
  }

  removePlayer(player: Player) {
    this.players.splice(this.players.indexOf(player), 1);
    player.room = null;

    for (const receiver of this.players)
      receiver.socket.emit('LeaveRoom', player.name);
  }

  setHost(host: Player) {
    this.host = host;

    for (const receiver of this.players)
      receiver.socket.emit('SetHost', host.name);
  }

  startGame() {
    this.phase = 'game';

    this.pieceQueue = [];

    for (const player of this.players) {
      player.board = new Board(new Vector2D(10, 20));

      player.piece = null;
      player.pieceId = null;
      player.pieceQueueId = null;

      player.socket.emit('StartGame');

      for (let i = 0; i < 3; i++)
        player.emitNextPiece();

      player.spawnNextPiece();
    }
  }

  chooseNextPiece() {
    const shapeId = Math.floor(Math.random() * shapes.length);
    const piece = shapes[shapeId].clone();

    const bottom = Math.max(...piece.blocks.map(block => block.y));
    piece.translate(new Vector2D(10 / 2 - piece.center.x, -0.5 - bottom));

    this.pieceQueue.push(piece);
  }

  getPieceFromQueue(id: number): Piece {
    while (id >= this.pieceQueue.length)
      this.chooseNextPiece();
    return this.pieceQueue[id];
  }

  emitState(player: Player) {
    player.socket.emit('RoomState', {
      name: this.name,
      players: this.players.map(player => {
        return { name: player.name };
      }),
      host: this.host?.name,
    });
  }
}
