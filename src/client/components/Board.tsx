'use strict';

import Block from './Block';
import '../../../styles.css';

import React from 'react';

interface BoardProps {
  board: boolean[][];
};

export default ({ board }: BoardProps) => {
  let blocks = [];
  for (const line of board.slice(4))
    for (const filled of line)
      blocks.push(<Block filled={filled} />);

  return (
    <div className="board">
      {blocks}
    </div>
  );
};
