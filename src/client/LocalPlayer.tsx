'use strict';

import Board, { getEmptyBoard } from "./Board";
import Piece from "./Piece";

export default interface LocalPlayer {
  board?: Board;
  piece?: Piece;
  pieceQueue?: Piece[];
  fallTick?: number;

  leftPressTick? : number;
  rightPressTick?: number;
  upPressTick?   : number;
  downPressTick? : number;
};

export const initialiseLocalPlayerGameVariables = (player: LocalPlayer): LocalPlayer => ({
  ...player,

  board: getEmptyBoard({ x: 10, y: 20 }),
  piece: null,
  pieceQueue: [],
  fallTick: null,

  leftPressTick: null,
  rightPressTick: null,
  upPressTick: null,
  downPressTick: null
});
