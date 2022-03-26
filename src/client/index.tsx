'use strict';

import Game from './Game';
import GamePreparation from './GamePreparation';
import { getEmptyBoard } from './Player';
import Piece, { spawnNextPiece } from './Piece';
import PlayerCreation from './PlayerCreation';
import Room from './Room';
import RoomSelection from './RoomSelection';
import { State, StateSetter, useTracked, Provider } from './state';

import produce from 'immer';
import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import io, { Socket } from 'socket.io-client';

const initializeSocket = (state: State, setState: StateSetter) => {
  state.socket = io();

  state.socket.on('PlayerCreated', (name) => {
    setState(prev => produce(prev, draft => {
      draft.pageId = 'RoomSelection';
      draft.playerName = name;
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

  state.socket.on('RoomState', (room: Room) => {
    setState(prev => produce(prev, draft => {
      draft.room = room;
      draft.pageId = 'GamePreparation';
    }));
  });

  state.socket.on('StartGame', () => {
    setState(prev => produce(prev, draft => {
      draft.pageId = 'Game';

      const board = getEmptyBoard();

      draft.room.players.forEach(player => {
        player.board = board;
        player.pieceQueue = [];
      });
    }));
  });

  state.socket.on('NextPiece', (piece: Piece) => {
    setState(prev => produce(prev, draft => {
      let playerId = draft.room.players.findIndex(player => player.name == draft.playerName);
      let player = draft.room.players[playerId];

      player.pieceQueue.push(piece);

      if (!player.piece)
        draft.room.players[playerId] = spawnNextPiece(player);
    }));
  });
}

const App = () => {
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
  case 'Game':
    Page = Game;
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
