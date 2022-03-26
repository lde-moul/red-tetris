'use strict';

import { attachPieceToBoard, clearFullLines } from './Board';
import LocalPlayer from './LocalPlayer';
import { canPieceBeHere, isPieceOverflowing, movePiece, rotatePiece, spawnNextPiece, translatePiece } from './Piece';
import Vector2D from './Vector2D';

import { Socket } from 'socket.io-client';

const wallKickOffsets: Vector2D[] = [
  { x:  0, y:  0 },
  { x: -1, y:  0 },
  { x:  1, y:  0 },
  { x: -2, y:  0 },
  { x:  2, y:  0 },
  { x:  0, y: -1 },
];

export const movePieceDownAction = (player: LocalPlayer, tick: number, socket: Socket): LocalPlayer => {
  const offset = { x: 0, y: 1 };

  socket.emit('MovePiece', offset);

  return {
    ...movePiece(player, offset),
    fallTick: tick
  };
};

export const movePieceLeftAction = (player: LocalPlayer, socket: Socket): LocalPlayer => {
  const offset = { x: -1, y: 0 };
  socket.emit('MovePiece', offset);
  return movePiece(player, offset);
};

export const movePieceRightAction = (player: LocalPlayer, socket: Socket): LocalPlayer => {
  const offset = { x: 1, y: 0 };
  socket.emit('MovePiece', offset);
  return movePiece(player, offset);
};

export const rotatePieceAction = (player: LocalPlayer, socket: Socket): LocalPlayer => {
  socket.emit('RotatePiece');

  const rotatedPiece = rotatePiece(player.piece);

  const kickedPiece = wallKickOffsets
    .map(offset => translatePiece(rotatedPiece, offset))
    .find(piece => canPieceBeHere(piece, player.board));

  if (kickedPiece)
    return {
      ...player,
      piece: kickedPiece
    };
  else
    return player;
};

export const dropPieceAction = (player: LocalPlayer, tick: number, socket: Socket): LocalPlayer => {
  socket.emit('DropPiece');

  const offset = { x: 0, y: 1 };

  while (canPieceBeHere(translatePiece(player.piece, offset), player.board))
    player = movePiece(player, offset);

  return movePiece({ ...player, fallTick: tick }, offset);
};
