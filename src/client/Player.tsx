import Piece from "./Piece";

export default interface Player {
  name: string;
  pieces?: Piece[];
};
