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
        player.downPressTick = null;
        break;
      case 'ArrowLeft':
        player.leftPressTick = null;
        break;
      case 'ArrowRight':
        player.rightPressTick = null;
        break;
      case 'ArrowUp':
        player.upPressTick = null;
        break;
    }
  });
