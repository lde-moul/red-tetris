'use strict';

import { dropPieceAction, movePieceDownAction, movePieceLeftAction, movePieceRightAction, rotatePieceAction } from './GameActions';
import { State } from './state';

import produce from 'immer';

export default (event: KeyboardEvent, state: State): State => {
  return produce(state, draft => {
    const room = draft.room;

    if (!room.player.piece)
      return;

    switch (event.key) {
      case 'ArrowDown':
      case 'Down':
        room.player.downPressTick = room.tick;
        room.player = movePieceDownAction(room.player, room.tick, state.socket);
        break;
      case 'ArrowLeft':
      case 'Left':
        room.player.leftPressTick = room.tick;
        room.player = movePieceLeftAction(room.player, state.socket);
        break;
      case 'ArrowRight':
      case 'Right':
        room.player.rightPressTick = room.tick;
        room.player = movePieceRightAction(room.player, state.socket);
        break;
      case 'ArrowUp':
      case 'Up':
        room.player.upPressTick = room.tick;
        room.player = rotatePieceAction(room.player, state.socket);
        break;
      case ' ':
      case 'Spacebar':
        room.player = dropPieceAction(room.player, room.tick, state.socket);
        break;
      }
  });
};
