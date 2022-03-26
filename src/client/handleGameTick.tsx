'use strict';

import { movePiece } from './Piece';
import { State } from './state';

import produce from 'immer';

export default (state: State): State =>
  produce(state, draft => {
    if (draft.room.player.piece)
      draft.room.player = movePiece(draft.room.player, { x: 0, y: 1 }, state.socket);
  });
