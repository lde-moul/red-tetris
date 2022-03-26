'use strict';

import '../../styles.css';

import React from 'react';

interface BlockProps {
  filled: boolean;
};

export default ({ filled }: BlockProps) =>
{
  return filled ?
    <div className="block"></div> :
    <div></div>;
};
