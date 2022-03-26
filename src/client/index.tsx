'use strict';

import PlayerCreation from './PlayerCreation';
import { State, StateSetter, useTracked, Provider } from './state';

import produce from 'immer';
import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import io, { Socket } from 'socket.io-client';

function initializeSocket(state: State, setState: StateSetter)
{
  state.socket = io();

  state.socket.on('PlayerCreated', () => {
    setState(prev => produce(prev, draft => {
      draft.pageId = 'RoomSelection';
    }));
  });

function App()
{
  const [state, setState] = useTracked();

  if (!state.socket)
    initializeSocket(state, setState);

  let Page;
  switch (state.pageId)
  {
  case 'PlayerCreation':
    Page = PlayerCreation;
    break;
  }

  return <Page />;
}

ReactDOM.render(
  <Provider>
    <App />
  </Provider>,
  document.getElementById('app')
);
