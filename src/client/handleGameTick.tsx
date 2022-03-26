'use strict';

import { movePieceDownAction, movePieceLeftAction, movePieceRightAction, rotatePieceAction } from './GameActions';
import { State } from './state';

import produce from 'immer';

const shouldKeyRepeat = (pressTick: number, tick: number): boolean => {
  if (pressTick === null)
    return false;

  const delay = tick - pressTick - 3;
  return delay >= 0 && delay % 1 === 0;
}

export default (state: State): State =>
  produce(state, draft => {
    let player = state.room.player;
    const tick = state.room.tick;

    if (shouldKeyRepeat(player.downPressTick, tick) || tick >= player.fallTick + 5)
      player = movePieceDownAction(player, tick, state.socket);
    if (shouldKeyRepeat(player.leftPressTick, tick))
      player = movePieceLeftAction(player, state.socket);
    if (shouldKeyRepeat(player.rightPressTick, tick))
      player = movePieceRightAction(player, state.socket);
    if (shouldKeyRepeat(player.upPressTick, tick))
      player = rotatePieceAction(player, state.socket);

    draft.room.player = player;
    draft.room.tick++;
  });
