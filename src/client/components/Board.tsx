'use strict';

import Block from './Block';
import Board from '../Board';
import '../../../styles.css';

import React from 'react';

interface BoardProps {
  board: Board;
  className: string;
};

export default ({ board, className }: BoardProps) => {
  let blocks = [];
  for (const line of board.blocks)
    for (const filled of line)
      blocks.push(<Block filled={filled} />);

  return (
    <div className={className}>
      {blocks}
    </div>
  );
};
