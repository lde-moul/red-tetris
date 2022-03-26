'use strict';

import Player from '../Player';
import PlayerInfo from './PlayerInfo';
import '../../../styles.css';

import React from 'react';

interface HUDProps {
  players: Player[];
};

export default ({ players }: HUDProps) => {
  const playerInfos = players.map(player =>
    <PlayerInfo player={player} numPlayers={players.length} />
  );

  return (
    <div className="hud">
      <div className="game-player-infos">
        {playerInfos}
      </div>
    </div>
  );
};
