'use strict';

import Room from './Room';

import { useState } from "react";
import { createContainer } from "react-tracked";
import { Socket } from 'socket.io-client';

export interface State {
  socket?: Socket;
  pageId: string;
  playerName: string;
  room?: Room;
  roomNames: string[];
}

export type StateSetter = (setter: (prev: State) => State) => void;

export const initialState: State = {
  pageId: 'PlayerCreation',
  playerName: 'Player',
  roomNames: [],
};

const useValue = () => useState<State>(initialState);

export const { Provider, useTracked } = createContainer(useValue);
