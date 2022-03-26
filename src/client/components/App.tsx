'use strict';

import Game from './Game';
import GamePreparation from './GamePreparation';
import GameResults from './GameResults';
import initializeSocket from '../initializeSocket';
import PlayerCreation from './PlayerCreation';
import RoomSelection from './RoomSelection';
import { useTracked } from '../state';

import React from 'react';

export default () => {
  const [state, setState] = useTracked();

  if (!state.socket)
    initializeSocket(state, setState);

  let Page;
  switch (state.pageId) {
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
    case 'GameResults':
      Page = GameResults;
      break;
  }

  return <Page />;
};
