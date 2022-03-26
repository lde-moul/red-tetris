'use strict';

import TitleMenu from './TitleMenu';
import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import io from 'socket.io-client';

let socket = io();

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
