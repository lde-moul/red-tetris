'use strict';

import { Socket } from "socket.io";

export default class {
  socket: Socket;
  name: string;

  constructor(socket: Socket) {
    this.socket = socket;
    this.name = "Guest";
  }
}
