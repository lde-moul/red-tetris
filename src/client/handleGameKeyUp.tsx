'use strict';

import { State } from './state';

import produce from 'immer';

export default (event: KeyboardEvent, state: State): State =>
  produce(state, draft => {
    if (!state.room.player.piece)
      return;

    const player = draft.room.player;

    switch (event.key) {
      case 'ArrowDown':
      case 'Down':
        player.downPressTick = null;
        break;
      case 'ArrowLeft':
      case 'Left':
        player.leftPressTick = null;
        break;
      case 'ArrowRight':
      case 'Right':
        player.rightPressTick = null;
        break;
      case 'ArrowUp':
      case 'Up':
        player.upPressTick = null;
        break;
    }
  });
