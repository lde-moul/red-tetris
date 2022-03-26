'use strict';

import LocalPlayer from './LocalPlayer';
import Player from './Player';

export default interface Room {
  name: string;
  phase: 'preparation' | 'game' | 'results',
  tick: number;
  player: LocalPlayer;
  players: Player[];
  hostName?: string;
};
