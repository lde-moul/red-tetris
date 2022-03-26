'use strict';

import { movePieceDownAction, movePieceLeftAction, movePieceRightAction, rotatePieceAction } from './GameActions';
import useSocket from './socket';
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
    const socket = useSocket();

    let player = state.room.player;
    const tick = state.room.tick;

    if (!player.piece)
      return;

    if (shouldKeyRepeat(player.downPressTick, tick) || tick >= player.fallTick + 5)
      player = movePieceDownAction(player, tick, socket);
    if (shouldKeyRepeat(player.leftPressTick, tick))
      player = movePieceLeftAction(player, socket);
    if (shouldKeyRepeat(player.rightPressTick, tick))
      player = movePieceRightAction(player, socket);
    if (shouldKeyRepeat(player.upPressTick, tick))
      player = rotatePieceAction(player, socket);

    draft.room.player = player;
    draft.room.tick++;
  });
