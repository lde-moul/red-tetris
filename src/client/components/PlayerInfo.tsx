'use strict';

import Player from '../Player';
import '../../../styles.css';

import React from 'react';

interface PlayerInfoProps {
  player: Player;
};

export default ({ player }: PlayerInfoProps) => {
  const columns = player.spectrum.map(height => {
    const style = { height: (height / 20 * 100) + '%' };
    return <div className="spectrum-column" style={style}></div>;
  });

  return (
    <div className="game-player-info">
      <div className="game-player-name">
        {player.name}
      </div>
      <div className="spectrum">
        {columns}
      </div>
    </div>
  );
};
