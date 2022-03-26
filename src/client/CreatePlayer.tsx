'use strict';

import React from 'react';
import "../../styles.css";

export default () =>
{
  function submit()
  {
  }

  return (
    <div>
      <h1>Red Tetris</h1>

      <form onSubmit={submit}>
        <label>Player:</label>
        <input type="text" />
        <button type="submit">
          Play
        </button>
      </form>
    </div>
  );
}
