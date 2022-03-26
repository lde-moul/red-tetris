'use strict';

import App from '../src/client/components/App';
import useSocket, { setSocket } from "../src/client/socket";
import { Provider, State } from '../src/client/state';

import assert from "assert";
import React from 'react';
import { render } from '@testing-library/react';

export const renderApp = (initialState: State) =>
  render(
    <Provider>
      <App initialState={initialState} />
    </Provider>
  );

export const assertMessageEmitted = (expectedType: string, callback: Function) => {
  const fakeSocket: any = useSocket();

  let emitted = false;

  fakeSocket.emit = (type: string) => {
    if (type === expectedType)
      emitted = true;
  };

  callback();

  fakeSocket.emit = () => {};

  assert(emitted, 'Message not emitted');
};

export const setTestSocket = () => {
  setSocket({
    emit: () => {},
    on: () => {},
    off: () => {},
  } as any);
};
