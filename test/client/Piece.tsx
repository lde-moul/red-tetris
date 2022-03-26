'use strict';

import { rotatePiece } from '../../src/client/Piece';
import shapes from '../../src/server/shapes';

import assert from 'assert';

describe('Piece', function() {
  it('should rotate the piece', () => {
    const piece = { ...shapes[5] };

    const expected = {
      ...piece,
      blocks: [
        { x: 2.5, y: 1.5 },
        { x: 1.5, y: 0.5 },
        { x: 1.5, y: 1.5 },
        { x: 1.5, y: 2.5 },
      ],
    };

    assert.deepStrictEqual(rotatePiece(piece), expected);
  });
});
