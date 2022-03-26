'use strict';

import Block from './Block';
import Board from '../Board';

import React from 'react';

interface BoardProps {
  board: Board;
  className: string;
};

export default ({ board, className }: BoardProps) => {
  let blocks = [];
  let key = 0;
  for (const line of board.blocks) {
    for (const blockType of line) {
      blocks.push(<Block key={key} type={blockType} />);
      key++;
    }
  }

  return (
    <div className={className}>
      {blocks}
    </div>
  );
};
