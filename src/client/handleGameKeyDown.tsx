'use strict';

import { canPieceBeHere, movePiece, rotatePiece } from './Piece';
import { attachPieceToBoard, detachPieceFromBoard } from './Player';
import { State } from './state';

import produce from 'immer';

export default (event: KeyboardEvent, state: State): State => {
  if (!state.room.player.piece)
    return state;

  switch (event.key) {
    case 'ArrowDown':
      return produce(state, draft => {
        draft.room.player = movePiece(state.room.player, { x: 0, y: 1 }, state.socket);
      });
    case 'ArrowLeft':
      return produce(state, draft => {
        draft.room.player = movePiece(state.room.player, { x: -1, y: 0 }, state.socket);
      });
    case 'ArrowRight':
      return produce(state, draft => {
        draft.room.player = movePiece(state.room.player, { x: 1, y: 0 }, state.socket);
      });
    case 'ArrowUp':
      return produce(state, draft => {
        const player = draft.room.player;

        state.socket.emit('RotatePiece');

        player.board = detachPieceFromBoard(player.piece, player.board);

        const rotatedPiece = rotatePiece(player.piece);
        if (canPieceBeHere(rotatedPiece, player.board))
          player.piece = rotatedPiece;

        player.board = attachPieceToBoard(player.piece, player.board);
      });
    default:
      return state;
  }
};
