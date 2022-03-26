'use strict';

import React from 'react';

interface PlayerListProps {
  names: string[];
  hostName?: string;
};

export default ({ names, hostName }: PlayerListProps) => {
  const elements = names.map(name => {
    if (name == hostName)
      name += ' (host)';
    return <li>{name}</li>
  });

  return <ul>{elements}</ul>;
}
