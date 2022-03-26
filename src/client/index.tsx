'use strict';

import PlayerCreation from './PlayerCreation';
import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import io, { Socket } from 'socket.io-client';

let socket: Socket = io();

function App()
{
  const [pageId, setPageId] = useState('PlayerCreation');

  let Page;
  switch (pageId)
  {
  case 'PlayerCreation':
    Page = PlayerCreation;
    break;
  }

  return <Page setPageId={setPageId} socket={socket} />;
}

ReactDOM.render(
  React.createElement(App),
  document.getElementById('app')
);
