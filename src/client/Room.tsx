'use strict';

import LocalPlayer from './LocalPlayer';
import Player from './Player';

export default interface Room {
  name: string;
  tick: number;
  player: LocalPlayer;
  players: Player[];
};
