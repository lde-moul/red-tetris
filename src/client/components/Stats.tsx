'use strict';

import '../../../styles.css';

import React from 'react';

interface StatsProps {
  score: number;
  numLinesCleared: number;
};

export default ({ score, numLinesCleared }: StatsProps) => {
  return (
    <div className="stats">
      <div>
        <span>Score</span>
        <span>{ score }</span>
      </div>
      <div>
        <span>Lines</span>
        <span>{ numLinesCleared }</span>
      </div>
    </div>
  );
};
