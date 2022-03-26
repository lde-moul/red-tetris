'use strict';

import Board from "./Board";
import Piece from "./Piece";

export default interface LocalPlayer {
  name: string;
  board?: Board;
  piece?: Piece;
  pieceQueue?: Piece[];
  fallTick?: number;

  leftPressTick? : number;
  rightPressTick?: number;
  upPressTick?   : number;
  downPressTick? : number;
};
