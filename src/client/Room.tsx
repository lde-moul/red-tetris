'use strict';

import LocalPlayer from './LocalPlayer';
import Player from './Player';

export default interface Room {
  name: string;
  player: LocalPlayer;
  players: Player[];
};
