'use strict';

import { BlockType } from '../Board';
import '../../../styles.css';

import React from 'react';

interface BlockProps {
  type: BlockType;
};

const blockClasses = [
  'empty-block',
  'malus-block',
  'full-block1',
  'full-block2',
  'full-block3',
  'full-block4',
  'full-block5',
  'full-block6',
  'full-block7',
];

export default ({ type }: BlockProps) =>
  <div className={'block ' + blockClasses[type]}></div>;
