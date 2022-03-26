'use strict';

import Room from "./Room";

import { Socket } from "socket.io";

export default class {
  socket: Socket;
  name: string;
  room?: Room;

  constructor(socket: Socket) {
    this.socket = socket;
    this.name = "Guest";
  }
}
