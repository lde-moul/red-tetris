'use strict';

import Player from './Player';

export default interface Room {
  name: string;
  players: Player[];
};
