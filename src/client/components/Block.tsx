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
  'full-block',
];

export default ({ type }: BlockProps) =>
  <div className={blockClasses[type]}></div>;
