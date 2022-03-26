'use strict';

import Piece from "./Piece";
import Room from "./Room";

import { Socket } from "socket.io";

export default class {
  socket: Socket;
  name: string;
  room?: Room;
  piece?: Piece;
  pieceId?: number;
  pieceQueueId?: number;

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
  }
}
