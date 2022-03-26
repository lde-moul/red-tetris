'use strict';

import App from './components/App';
import { Provider } from './state';

import React from 'react';
import ReactDOM from 'react-dom';

ReactDOM.render(
  <Provider>
    <App />
  </Provider>,
  document.getElementById('app')
);
