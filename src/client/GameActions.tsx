'use strict';

import { attachPieceToBoard, detachPieceFromBoard } from './Board';
import LocalPlayer from './LocalPlayer';
import { canPieceBeHere, movePiece, rotatePiece } from './Piece';

import { Socket } from 'socket.io-client';

export const movePieceDownAction = (player: LocalPlayer, tick: number, socket: Socket): LocalPlayer => ({
  ...movePiece(player, { x: 0, y: 1 }, socket),
  fallTick: tick
});

export const movePieceLeftAction = (player: LocalPlayer, socket: Socket): LocalPlayer =>
  movePiece(player, { x: -1, y: 0 }, socket);

export const movePieceRightAction = (player: LocalPlayer, socket: Socket): LocalPlayer =>
  movePiece(player, { x: 1, y: 0 }, socket);

export const rotatePieceAction = (player: LocalPlayer, socket: Socket): LocalPlayer => {
  socket.emit('RotatePiece');

  const freedBoard = detachPieceFromBoard(player.piece, player.board);
  const rotatedPiece = rotatePiece(player.piece);

  if (canPieceBeHere(rotatedPiece, freedBoard))
    return {
      ...player,
      board: attachPieceToBoard(rotatedPiece, freedBoard),
      piece: rotatedPiece
    };
  else
    return player;
};
