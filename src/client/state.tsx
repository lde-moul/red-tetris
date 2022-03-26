'use strict';

import { useState } from "react";
import { createContainer } from "react-tracked";
import { Socket } from 'socket.io-client';

export interface State {
  socket?: Socket;

  pageId: string;
}

export type StateSetter = (setter: (prev: State) => State) => void;

const useValue = () => useState<State>({
  pageId: 'PlayerCreation',
});

export const { Provider, useTracked } = createContainer(useValue);
