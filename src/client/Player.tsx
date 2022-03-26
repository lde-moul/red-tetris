import Piece from "./Piece";

export default interface Player {
  name: string;
  board?: boolean[][];
  piece?: Piece;
};

export const getEmptyBoard = () => {
  let board: boolean[][] = [];

  for (let y = 0; y < 20; y++) {
    board[y] = [];
    for (let x = 0; x < 10; x++) {
      board[y][x] = false;
    }
  }

  return board;
};
