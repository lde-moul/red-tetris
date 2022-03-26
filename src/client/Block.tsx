'use strict';

import '../../styles.css';

import React from 'react';

interface BlockProps {
  filled: boolean;
};

export default ({ filled }: BlockProps) => {
  return filled ?
    <div className="full-block"></div> :
    <div className="empty-block"></div>;
};
