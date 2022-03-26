'use strict';

import { assertMessageEmitted, renderApp, setTestSocket } from '../ClientTesting';

import jsdom from 'jsdom-global';
jsdom();

import assert from 'assert';
import { fireEvent } from '@testing-library/react';

describe('Menu components', function() {
  before(() => {
    setTestSocket();
  });

  it('should render the player creation component', () => {
    renderApp({
      pageId: 'PlayerCreation',
      playerName: 'Player',
      roomNames: []
    });

    const form = document.querySelector('form');
    const label = form.querySelector('label');
    const input = form.querySelector('input');
    const button = form.querySelector('button');

    assert.strictEqual(label.textContent, 'Player name');
    assert.strictEqual(button.textContent, 'Play');

    fireEvent.change(input, {
      target: {
        value: 'Test User'
      }
    });

    assertMessageEmitted('CreatePlayer', () => fireEvent.submit(form));
  });

  it('should render the room creation component', () => {
    renderApp({
      pageId: 'RoomSelection',
      playerName: 'Test User',
      roomNames: []
    });

    const menu = document.querySelector('.menu');
    const form = menu.querySelector('form');
    const label = form.querySelector('label');
    const input = form.querySelector('input');
    const button = form.querySelector('button');

    assert(menu.textContent.includes('No rooms available.'));
    assert.strictEqual(label.textContent, 'Create room:');
    assert.strictEqual(button.textContent, 'Create');

    fireEvent.change(input, {
      target: {
        value: 'Test Room'
      }
    });

    assertMessageEmitted('CreateRoom', () => fireEvent.submit(form));
  });

  it('should render the room selection component', () => {
    renderApp({
      pageId: 'RoomSelection',
      playerName: 'Test User',
      roomNames: ['Test Room 1', 'Test Room 2']
    });

    const rooms = document.querySelectorAll('.menu ul > li button');
    assert.strictEqual(rooms[0].textContent, 'Test Room 1');
    assert.strictEqual(rooms[1].textContent, 'Test Room 2');

    assertMessageEmitted('JoinRoom', () => fireEvent.click(rooms[0]));
  });

  it('should render the game preparation component', () => {
    renderApp({
      pageId: 'GamePreparation',
      playerName: 'Test User 1',
      roomNames: ['Test Room'],
      room: {
        name: 'Test Room',
        phase: 'preparation',
        tick: 0,
        hostName: 'Test User 1',
        player: {},
        players: [
          {
            name: 'Test User 1',
            lost: false
          },
          {
            name: 'Test User 2',
            lost: false
          },
        ]
      }
    });

    const menu = document.querySelector('.menu');
    const startButton = document.querySelector('.menu > button');
    const playerList = menu.querySelector('.player-list').children;
    const changeHostButton = playerList[5].querySelector('button');

    assert.strictEqual(playerList[0].textContent, 'Test User 1');
    assert.strictEqual(playerList[3].textContent, 'Test User 2');

    assert.strictEqual(playerList[1].textContent, '(host)');
    assert.strictEqual(changeHostButton.textContent, 'Change host');

    assertMessageEmitted('ChangeHost', () => fireEvent.click(changeHostButton));
    assertMessageEmitted('StartGame', () => fireEvent.click(startButton));
  });

  it('should render the game results with a winner', () => {
    renderApp({
      pageId: 'GameResults',
      playerName: 'Test User 1',
      roomNames: ['Test Room'],
      room: {
        name: 'Test Room',
        phase: 'results',
        tick: 100,
        hostName: 'Test User 1',
        player: {},
        players: [
          {
            name: 'Test User 1',
            lost: false
          },
          {
            name: 'Test User 2',
            lost: true
          },
        ]
      }
    });

    const menu = document.querySelector('.menu');
    const button = menu.querySelector('button');

    assert(menu.textContent.includes, 'Test User 1 won the round!');
    assert.strictEqual(button.textContent, 'Restart');

    assertMessageEmitted('RestartGame', () => fireEvent.click(button));
  });

  it('should render the game results with no winner', () => {
    renderApp({
      pageId: 'GameResults',
      playerName: 'Test User 1',
      roomNames: ['Test Room'],
      room: {
        name: 'Test Room',
        phase: 'results',
        tick: 100,
        hostName: 'Test User 1',
        player: {},
        players: [
          {
            name: 'Test User 1',
            lost: true
          },
        ]
      }
    });

    const menu = document.querySelector('.menu');
    const button = menu.querySelector('button');

    assert(menu.textContent.includes, 'Game over');
    assert.strictEqual(button.textContent, 'Restart');

    assertMessageEmitted('RestartGame', () => fireEvent.click(button));
  });
});
