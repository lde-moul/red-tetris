'use strict';

import Board from "./Board";
import Piece from "./Piece";
import Player from "./Player";
import shapes from "./shapes";
import Vector2D from "./Vector2D";

export default class {
  name: string;
  phase: 'preparation' | 'game' | 'results';
  players: Player[];
  host?: Player;
  pieceQueue: Piece[];
  pickableShapes: Piece[];
  ticker?: NodeJS.Timeout;
  lastTick: number;

  constructor(name: string) {
    this.name = name;
    this.players = [];

    this.startPreparation();
  }

  destroy() {
    if (this.ticker)
      clearInterval(this.ticker);
  }

  addPlayer(player: Player) {
    this.players.push(player);
    player.room = this;

    for (const receiver of this.players)
      receiver.socket.emit('JoinRoom', player.name);

    player.lost = (this.phase !== 'preparation');

    if (this.phase === 'game') {
      player.board = new Board(new Vector2D(10, 20));

      player.piece = null;
      player.pieceId = null;
      player.pieceQueueId = null;
    }
  }

  removePlayer(player: Player) {
    this.players.splice(this.players.indexOf(player), 1);
    player.room = null;

    for (const receiver of this.players)
      receiver.socket.emit('LeaveRoom', player.name);

    if (player == this.host && this.players.length !== 0) {
        const id = Math.floor(Math.random() * this.players.length);
        this.setHost(this.players[id]);
    }

    const numSurvivors = this.players.filter(player => !player.lost).length;
    if (this.phase == 'game' && numSurvivors <= 1)
      this.endGame();
  }

  setHost(host: Player) {
    this.host = host;

    for (const receiver of this.players)
      receiver.socket.emit('SetHost', host.name);
  }

  startPreparation() {
    this.phase = 'preparation';
    this.pieceQueue = [];
    this.pickableShapes = [ ...shapes ];

    for (const receiver of this.players)
      receiver.socket.emit('RestartGame');
  }

  startGame() {
    this.phase = 'game';

    this.pieceQueue = [];

    for (const player of this.players) {
      player.lost = false;
      player.score = 0;
      player.numLinesCleared = 0;
      player.lateness = 0;
      player.desynchronised = false;
      player.resynchronising = false;

      player.board = new Board(new Vector2D(10, 20));

      player.piece = null;
      player.pieceId = null;
      player.pieceQueueId = null;

      player.socket.emit('StartGame');

      for (let i = 0; i < 3; i++)
        player.emitNextPiece();

      player.spawnNextPiece();
    }

    this.ticker = setInterval(() => this.handleTick(), 1000);
    this.lastTick = Date.now();
  }

  handleTick() {
    const timeStep = Date.now() - this.lastTick;

    for (const player of this.players) {
      if (player.lost)
        continue;

      player.lateness += timeStep;

      if (player.lateness >= 3000)
        player.catchUpLateTicks();

      if (player.desynchronised && !player.resynchronising)
        player.resynchronise();
    }

    this.lastTick = Date.now();
  }

  endGame() {
    this.phase = 'results';

    for (const receiver of this.players)
      receiver.socket.emit('EndGame');

    clearInterval(this.ticker);
  }

  chooseNextPiece() {
    const shapeId = Math.floor(Math.random() * this.pickableShapes.length);
    const piece = this.pickableShapes[shapeId].clone();
    this.pickableShapes.splice(shapeId, 1);
    if (this.pickableShapes.length === 0)
      this.pickableShapes = [ ...shapes ];

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
      phase: this.phase,
      tick: 0,
      player: !player.room ? null : {
        board: {
          blocks: player.board.blocks,
          size: player.board.size
        },
        piece: {
          blocks: player.piece.blocks,
          center: player.piece.center,
          type: player.piece.type
        },
        pieceQueue: [],
        fallTick: 0,
        score: player.score,
        numLinesCleared: player.numLinesCleared
      },
      players: this.players.map(player => {
        return {
          name: player.name,
          lost: player.lost,
          spectrum: player.board?.getSpectrum()
        };
      }),
      hostName: this.host?.name,
    });

    if (player.room && this.phase === 'game') {
      player.pieceQueueId = player.pieceId;
      for (let i = 0; i < 3; i++)
        player.emitNextPiece();
    }
  }
}
