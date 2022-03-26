'use strict';

import { addMalusLines, getEmptyBoard } from './Board';
import Piece, { spawnNextPiece, translatePiece } from './Piece';
import Room from './Room';
import { State, StateSetter } from './state';

import produce from 'immer';
import io from 'socket.io-client';

export default (state: State, setState: StateSetter) => {
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
      if (!draft.room)
        return;

      draft.room.players.push({ name, lost: false });

      if (name === draft.playerName)
        draft.room.player = { name: draft.playerName };
    }));
  });

  state.socket.on('LeaveRoom', (name: string) => {
    setState(prev => produce(prev, draft => {
      if (!draft.room)
        return;

      const playerIndex = prev.room.players.findIndex(player => player.name === name);
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

      draft.room.player.board = getEmptyBoard({ x: 10, y: 20 });
      draft.room.player.piece = null;
      draft.room.player.pieceQueue = [];
      draft.room.player.fallTick = null;

      draft.room.player. leftPressTick = null;
      draft.room.player.rightPressTick = null;
      draft.room.player.   upPressTick = null;
      draft.room.player. downPressTick = null;

      draft.room.players.forEach(player => {
        player.lost = false;
        player.spectrum = new Array(10).fill(0);
      });
    }));
  });

  state.socket.on('EndGame', () => {
    setState(prev => produce(prev, draft => {
      draft.pageId = 'GameResults';
    }));
  });

  state.socket.on('RestartGame', () => {
    setState(prev => produce(prev, draft => {
      draft.pageId = 'GamePreparation';
    }));
  });

  state.socket.on('NextPiece', (piece: Piece) => {
    setState(prev => produce(prev, draft => {
      draft.room.player.pieceQueue.push(piece);

      if (!draft.room.player.piece)
        draft.room.player = spawnNextPiece(draft.room.player);
    }));
  });

  state.socket.on('AddMalusLines', (numLines: number) => {
    setState(prev => produce(prev, draft => {
      draft.room.player.board = addMalusLines(draft.room.player.board, numLines);

      if (draft.room.player.piece)
        draft.room.player.piece = translatePiece(draft.room.player.piece, { x: 0, y: -numLines });
    }));
  });

  state.socket.on('Spectrum', (name: string, spectrum: number[]) => {
    setState(prev => produce(prev, draft => {
      if (!draft.room)
        return;

        const player = draft.room.players.find(player => player.name === name);
        player.spectrum = spectrum;
    }));
  });

  state.socket.on('PlayerLost', (name: string) => {
    setState(prev => produce(prev, draft => {
      if (!draft.room)
        return;

      const player = draft.room.players.find(player => player.name === name);
      player.lost = true;
    }));
  });
};
