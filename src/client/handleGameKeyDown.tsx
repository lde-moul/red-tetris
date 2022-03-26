'use strict';

import { canPieceBeHere, rotatePiece, translatePiece } from './Piece';
import { attachPieceToBoard, detachPieceFromBoard } from './Player';
import { State } from './state';

import produce from 'immer';

export default (event: KeyboardEvent, state: State): State => {
  switch (event.key)
  {
  case 'ArrowDown':
    return produce(state, draft => {
      const player = draft.room.players.find(player => player.name == draft.playerName);

      player.board = detachPieceFromBoard(player.piece, player.board);

      const movedPiece = translatePiece(player.piece, { x: 0, y: 1 });
      if (canPieceBeHere(movedPiece, player.board))
        player.piece = movedPiece;

      player.board = attachPieceToBoard(player.piece, player.board);
    });
  case 'ArrowLeft':
    return produce(state, draft => {
      const player = draft.room.players.find(player => player.name == draft.playerName);

      player.board = detachPieceFromBoard(player.piece, player.board);

      const movedPiece = translatePiece(player.piece, { x: -1, y: 0 });
      if (canPieceBeHere(movedPiece, player.board))
        player.piece = movedPiece;

      player.board = attachPieceToBoard(player.piece, player.board);
    });
  case 'ArrowRight':
    return produce(state, draft => {
      const player = draft.room.players.find(player => player.name == draft.playerName);

      player.board = detachPieceFromBoard(player.piece, player.board);

      const movedPiece = translatePiece(player.piece, { x: 1, y: 0 });
      if (canPieceBeHere(movedPiece, player.board))
        player.piece = movedPiece;

      player.board = attachPieceToBoard(player.piece, player.board);
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
