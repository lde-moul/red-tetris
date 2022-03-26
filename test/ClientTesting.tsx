'use strict';

import initializeSocket from '../src/client/initializeSocket';
import { initialState, State } from '../src/client/state';

import { Socket } from 'socket.io-client';

interface TestMessage {
  type: string;
  args: any[];
};

export interface TestClient {
  socket: Socket;
  state: State;
  receivedMessages: TestMessage[];
  expectedMessages: Record<string, Function>;
};

export const createClient = () => {
  let client: TestClient;

  const setState = (setter: (prev: State) => State) => {
    client.state = setter(client.state);
  };

  const socket = initializeSocket('http://0.0.0.0:' + process.env.PORT, setState);

  client = {
    socket,
    state: { ...initialState },
    receivedMessages: [],
    expectedMessages: {}
  };

  return client;
};

export const setExpectedMessages = (client: TestClient, ...types: string[]) => {
  types.forEach(type => {
    const callback = (...args: any[]) => {
      if (client.expectedMessages[type]) {
        client.expectedMessages[type](args);
        delete client.expectedMessages[type];
      } else {
        client.receivedMessages.push({ type, args });
      }

      client.socket.off(type, callback);
    };

    client.socket.on(type, callback);
  });
};

export const waitForMessage = (client: TestClient, type: string) => {
  return new Promise<any[]>((resolve, reject) => {
    const message = client.receivedMessages[0];

    if (message?.type === type) {
      client.receivedMessages.splice(0, 1);
      resolve(message.args);
    } else {
      const callback = (args: any[]) => resolve(args);
      client.expectedMessages[type] = callback;
    }
  });
};
