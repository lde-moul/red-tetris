'use strict';

import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import CreatePlayer from './CreatePlayer';

function App()
{
  const [pageId, setPageId] = useState('CreatePlayer');
  
  return <CreatePlayer />;
}

ReactDOM.render(
  React.createElement(App),
  document.getElementById('app')
);
