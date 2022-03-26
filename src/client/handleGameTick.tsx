'use strict';

import { movePieceDownAction, movePieceLeftAction, movePieceRightAction, rotatePieceAction } from './GameActions';
import LocalPlayer from './LocalPlayer';
import useSocket from './socket';
import { State } from './state';

import produce from 'immer';

const shouldKeyRepeat = (pressTick: number, tick: number): boolean => {
  if (pressTick === null)
    return false;

  const delay = tick - pressTick - 3;
  return delay >= 0 && delay % 1 === 0;
}

const updatePlayer = (player: LocalPlayer, tick: number): LocalPlayer => {
  const socket = useSocket();

  if (!player.piece)
    return player;
  if (shouldKeyRepeat(player.downPressTick, tick) || tick >= player.fallTick + 5)
    player = movePieceDownAction(player, tick, socket);

  if (!player.piece)
    return player;
  if (shouldKeyRepeat(player.leftPressTick, tick))
    player = movePieceLeftAction(player, socket);
  if (shouldKeyRepeat(player.rightPressTick, tick))
    player = movePieceRightAction(player, socket);
  if (shouldKeyRepeat(player.upPressTick, tick))
    player = rotatePieceAction(player, socket);

  return player;
};

export default (state: State): State =>
  produce(state, draft => {
    draft.room.player = updatePlayer(draft.room.player, draft.room.tick);
    draft.room.tick++;
  });
