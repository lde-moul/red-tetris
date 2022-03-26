'use strict';

import Piece from "./Piece";
import Vector2D from "./Vector2D";

export default [
  {
    blocks: [
      [0, 0], [1, 0], [2, 0], [3, 0]
    ],
    center: [2, 1]
  },
  {
    blocks: [
      [0, 0],
      [0, 1], [1, 1], [2, 1]
    ],
    center: [1.5, 1.5]
  },
  {
    blocks: [
                      [2, 0],
      [0, 1], [1, 1], [2, 1]
    ],
    center: [1.5, 1.5]
  },
  {
    blocks: [
      [0, 0], [1, 0],
      [0, 1], [1, 1]
    ],
    center: [1, 1]
  },
  {
    blocks: [
              [1, 0], [2, 0],
      [0, 1], [1, 1]
    ],
    center: [1.5, 1.5]
  },
  {
    blocks: [
              [1, 0],
      [0, 1], [1, 1], [2, 1]
    ],
    center: [1.5, 1.5]
  },
  {
    blocks: [
      [0, 0], [1, 0],
              [1, 1], [2, 1]
    ],
    center: [1.5, 1.5]
  },
].map(shape => new Piece(
  shape.blocks.map(block => new Vector2D(block[0] + 0.5, block[1] + 0.5)),
  new Vector2D(shape.center[0], shape.center[1])
));
