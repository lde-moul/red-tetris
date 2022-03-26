'use strict';

import Piece from '../Piece';
import Player from '../Player';
import PlayerInfo from './PlayerInfo';
import '../../../styles.css';

import React from 'react';
import PieceQueue from './PieceQueue';

interface HUDProps {
  pieceQueue: Piece[];
  players: Player[];
};

export default ({ pieceQueue, players }: HUDProps) => {
  const playerInfos = players.map(player =>
    <PlayerInfo player={player} numPlayers={players.length} />
  );

  return (
    <div className="hud">
      <div className="game-local-player-info">
        <PieceQueue pieceQueue={pieceQueue} />
      </div>
      <div className="game-player-infos">
        {playerInfos}
      </div>
    </div>
  );
};
