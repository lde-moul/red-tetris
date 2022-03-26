'use strict';

import Player from '../Player';
import '../../../css/player-info.css';

import React from 'react';

interface PlayerInfoProps {
  player: Player;
  numPlayers: number;
};

const getSizeClass = (numPlayers: number) =>
  'game-player-info-' + (
    [ 1, 2, 3, 6, 8, 15, 28, 54, 108 ]
      .find(n => numPlayers <= n) ?? 108
  );

export default ({ player, numPlayers }: PlayerInfoProps) => {
  const columns = player.spectrum.map(height => {
    const style = { height: (height / 20 * 100) + '%' };
    return <div className="spectrum-column" style={style}></div>;
  });

  return (
    <div className={"game-player-info " + getSizeClass(numPlayers)}>
      <div className="game-player-name">
        {player.name}
      </div>
      <div className="spectrum">
        {columns}
      </div>
    </div>
  );
};
