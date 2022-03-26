'use strict';

import Room from './Room';

import { useState } from 'react';
import { createContainer } from 'react-tracked';

export interface State {
  pageId: string;
  playerName: string;
  room?: Room;
  roomNames: string[];
  quickPlayerName?: string;
  quickRoomName?: string;
}

export type StateSetter = (setter: (prev: State) => State) => void;

export const initialState: State = {
  pageId: 'Initialization',
  playerName: 'Player',
  roomNames: [],
};

const useValue = () => useState<State>(initialState);

export const { Provider, useTracked } = createContainer(useValue);
