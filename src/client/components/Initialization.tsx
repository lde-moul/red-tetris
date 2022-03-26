'use strict';

import { useTracked } from '../state';
import Title from './Title';

import React, { useEffect } from 'react';

export default () => {
  const [state, setState] = useTracked();

  const getRoomAndPlayerFromURIFragment = (): [string?, string?] => {
    const fragment = decodeURIComponent(window.location.hash);
    const captures = fragment.match('#(.+)\\[(.+)\\]');
    return captures ? [captures[1], captures[2]] : [null, null];
  };

  useEffect(() => {
    const [roomName, playerName] = getRoomAndPlayerFromURIFragment();

    setState(prev => ({
      ...prev,
      pageId: 'PlayerCreation',
      quickPlayerName: playerName,
      quickRoomName: roomName
    }));
  }, []);

  return (
    <div className="flex-v">
      <Title />

      <div className="menu">
        Loading...
      </div>
    </div>
  );
};
