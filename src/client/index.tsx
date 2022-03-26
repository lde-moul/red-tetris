'use strict';

import PlayerCreation from './PlayerCreation';
import state from './state';

import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import io, { Socket } from 'socket.io-client';

state.socket = io();

function App()
{
  [state.pageId, state.setPageId] = useState('PlayerCreation');

  let Page;
  switch (state.pageId)
  {
  case 'PlayerCreation':
    Page = PlayerCreation;
    break;
  }

  return <Page />;
}

ReactDOM.render(
  React.createElement(App),
  document.getElementById('app')
);
