'use strict';

import { canPieceBeHere, movePiece, rotatePiece } from './Piece';
import { attachPieceToBoard, detachPieceFromBoard } from './Player';
import { State } from './state';

import produce from 'immer';

export default (event: KeyboardEvent, state: State): State => {
  const playerId = state.room.players.findIndex(player => player.name == state.playerName);
  const player = state.room.players[playerId];

  if (!player.piece)
    return state;

  switch (event.key)
  {
  case 'ArrowDown':
    return produce(state, draft => {
      draft.room.players[playerId] = movePiece(player, { x: 0, y: 1 });
    });
  case 'ArrowLeft':
    return produce(state, draft => {
      draft.room.players[playerId] = movePiece(player, { x: -1, y: 0 });
    });
  case 'ArrowRight':
    return produce(state, draft => {
      draft.room.players[playerId] = movePiece(player, { x: 1, y: 0 });
    });
  case 'ArrowUp':
    return produce(state, draft => {
      const player = draft.room.players.find(player => player.name == draft.playerName);

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
