'use strict';

import Player from "./Player";

export default class {
  name: string;
  phase: 'preparation' | 'game';
  players: Player[];
  host?: Player;

  constructor(name: string) {
    this.name = name;
    this.phase = 'preparation';
    this.players = [];
  }

  addPlayer(player: Player)
  {
    this.players.push(player);
    player.room = this;

    for (const receiver of this.players)
      receiver.socket.emit('JoinRoom', player.name);
  }

  removePlayer(player: Player) {
    this.players.splice(this.players.indexOf(player), 1);
    player.room = null;

    for (const receiver of this.players)
      receiver.socket.emit('LeaveRoom', player.name);
  }

  setHost(host: Player)
  {
    this.host = host;

    for (const receiver of this.players)
      receiver.socket.emit('SetHost', host.name);
  }

  startGame() {
    this.phase = 'game';

    for (const receiver of this.players)
      receiver.socket.emit('StartGame');
  }

  emitState(player: Player) {
    player.socket.emit('RoomState', {
      name: this.name,
      players: this.players.map(player => {
        return { name: player.name };
      }),
      host: this.host?.name,
    });
  }
}
