'use strict';

import Game from './Game';
import GameJoining from './GameJoining';
import GamePreparation from './GamePreparation';
import GameResults from './GameResults';
import Initialization from './Initialization';
import initializeSocket from '../initializeSocket';
import PlayerCreation from './PlayerCreation';
import RoomSelection from './RoomSelection';
import useSocket, { setSocket } from '../socket';
import { State, useTracked } from '../state';

import React, { useEffect } from 'react';

interface AppProps {
  initialState?: State;
};

const pages = {
  Initialization,
  PlayerCreation,
  RoomSelection,
  GamePreparation,
  GameJoining,
  Game,
  GameResults,
};

export default ({ initialState }: AppProps) => {
  const [state, setState] = useTracked();

  useEffect(() => {
    if (initialState)
      setState(prev => ({ ...initialState }));
  }, []);

  if (!useSocket())
    setSocket(initializeSocket(null, setState));

  const Page = pages[state.pageId];
  return <Page />;
};
