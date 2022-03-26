'use strict';

import Game from './Game';
import GamePreparation from './GamePreparation';
import GameResults from './GameResults';
import initializeSocket from '../initializeSocket';
import PlayerCreation from './PlayerCreation';
import RoomSelection from './RoomSelection';
import { useTracked } from '../state';

import React from 'react';

const pages = {
  PlayerCreation,
  RoomSelection,
  GamePreparation,
  Game,
  GameResults,
};

export default () => {
  const [state, setState] = useTracked();

  if (!state.socket)
    initializeSocket(state, setState);

  const Page = pages[state.pageId];
  return <Page />;
};
