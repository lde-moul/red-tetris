'use strict';

import Board from "./Board";
import Piece from "./Piece";
import Player from "./Player";
import Room from "./Room";
import Vector2D from "./Vector2D";

import { Socket } from "socket.io";

export default class {
  socket: Socket;
  name: string;
  room?: Room;
  lost?: boolean;
  board?: Board;
  piece?: Piece;
  pieceId?: number;
  pieceQueueId?: number;
  lateness?: number;
  desynchronised?: boolean;
  resynchronising?: boolean;

  constructor(socket: Socket) {
    this.socket = socket;
    this.name = "Guest";
  }

  emitNextPiece() {
    if (this.pieceQueueId === null)
      this.pieceQueueId = 0;
    else
      this.pieceQueueId++;

    const piece = this.room.getPieceFromQueue(this.pieceQueueId);
    this.socket.emit('NextPiece', piece);
  }

  spawnNextPiece() {
    this.emitNextPiece();

    if (this.pieceId === null)
      this.pieceId = 0;
    else
      this.pieceId++;

    this.piece = this.room.getPieceFromQueue(this.pieceId).clone();
    this.piece.player = this;
  }

  emitSpectrum(receiver: Player) {
    receiver.socket.emit('Spectrum', this.name, this.board.getSpectrum());
  }

  lose() {
    this.lost = true;

    for (const receiver of this.room.players)
      receiver.socket.emit('PlayerLost', this.name);

    if (this.room.players.filter(player => !player.lost).length <= 1)
      this.room.endGame();
  }

  catchUpLateTicks() {
    this.desynchronised = true;

    while (this.lateness >= 500 && this.piece)
      this.piece.move(new Vector2D(0, 1));
  }

  resynchronise() {
    this.desynchronised = false;
    this.resynchronising = true;
    this.room.emitState(this);
  }
}
