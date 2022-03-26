'use strict';

import LocalPlayer from '../LocalPlayer';
import PieceQueue from './PieceQueue';
import Player from '../Player';
import PlayerInfo from './PlayerInfo';
import Stats from './Stats';
import '../../../css/game.css';
import '../../../css/player-info.css';

import React from 'react';

interface HUDProps {
  player: LocalPlayer;
  players: Player[];
};

export default ({ player, players }: HUDProps) => {
  const playerInfos = players.map(player =>
    <PlayerInfo key={player.name} player={player} numPlayers={players.length} />
  );

  return (
    <div className="hud">
      <div className="game-local-player-info">
        <PieceQueue pieceQueue={player.pieceQueue} />
        <Stats score={player.score} numLinesCleared={player.numLinesCleared} />
      </div>
      <div className="game-player-infos">
        {playerInfos}
      </div>
    </div>
  );
};
