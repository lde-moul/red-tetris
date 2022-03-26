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
    ...movePiece(player, offset, socket),
    fallTick: tick
  };
};

export const movePieceLeftAction = (player: LocalPlayer, socket: Socket): LocalPlayer => {
  const offset = { x: -1, y: 0 };
  socket.emit('MovePiece', offset);
  return movePiece(player, offset, socket);
};

export const movePieceRightAction = (player: LocalPlayer, socket: Socket): LocalPlayer => {
  const offset = { x: 1, y: 0 };
  socket.emit('MovePiece', offset);
  return movePiece(player, offset, socket);
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

  let droppedPiece = player.piece;

  while (true) {
    const movedPiece = translatePiece(droppedPiece, { x: 0, y: 1 });

    if (!canPieceBeHere(movedPiece, player.board))
      break;

    droppedPiece = movedPiece;
  }

  const droppedPlayer: LocalPlayer = {
    ...player,
    fallTick: tick
  };

  if (isPieceOverflowing(droppedPiece, droppedPlayer.board))
    return {
      ...droppedPlayer,
      piece: null,
      board: attachPieceToBoard(droppedPiece, droppedPlayer.board)
    };
  else
    return spawnNextPiece({
      ...droppedPlayer,
      board: clearFullLines(attachPieceToBoard(droppedPiece, droppedPlayer.board))
    });
};
