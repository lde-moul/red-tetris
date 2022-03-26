'use strict';

import { Socket } from 'socket.io-client';

let socket: Socket;

export default (): Socket => {
  return socket;
};

export const setSocket = (newSocket: Socket) => {
  socket = newSocket;
};
