'use strict';

import React from 'react';

interface PlayerListProps {
  names: string[];
};

export default ({ names }: PlayerListProps) =>
{
  const elements = names.map(name =>
    <li>{name}</li>
  );

  return <ul>{elements}</ul>;
}
