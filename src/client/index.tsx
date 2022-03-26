'use strict';

import GamePreparation from './GamePreparation';
import PlayerCreation from './PlayerCreation';
import RoomSelection from './RoomSelection';
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

  state.socket.on('RoomNames', (names) => {
    setState(prev => produce(prev, draft => {
      draft.roomNames = names;
    }));
  });

  state.socket.on('JoinRoom', (name: string) => {
    setState(prev => produce(prev, draft => {
      if (!prev.room)
        return;

      draft.room.players.push({ name });
    }));
  });

  state.socket.on('LeaveRoom', (name: string) => {
    setState(prev => produce(prev, draft => {
      if (!prev.room)
        return;

      const playerIndex = prev.room.players.findIndex(player => player.name == name);
      draft.room.players.splice(playerIndex, 1);
    }));
  });

  state.socket.on('RoomState', (room) => {
    setState(prev => produce(prev, draft => {
      draft.room = room;
      draft.pageId = 'GamePreparation';
    }));
  });
}

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
  case 'RoomSelection':
    Page = RoomSelection;
    break;
  case 'GamePreparation':
    Page = GamePreparation;
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
