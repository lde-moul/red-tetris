'use strict';

import TitleMenu from './TitleMenu';
import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import io, { Socket } from 'socket.io-client';

let socket: Socket = io();

function App()
{
  const [pageId, setPageId] = useState('TitleMenu');

  let Page;
  switch (pageId)
  {
  case 'TitleMenu':
    Page = TitleMenu;
    break;
  }

  return <Page setPageId={setPageId} socket={socket} />;
}

ReactDOM.render(
  React.createElement(App),
  document.getElementById('app')
);
