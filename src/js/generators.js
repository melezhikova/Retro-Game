/**
 * Generates random characters
 *
 * @param allowedTypes iterable of classes
 * @param maxLevel max character level
 * @returns Character type children (ex. Magician, Bowman, etc)
 */

import GamePlay from './GamePlay';

export function getPosition(player, quantity) {
  const numbers = [];
  const cells = [];
  const boardsize = new GamePlay().boardSize;
  if (player === 'gamer') {
    for (let i = 0; i < boardsize; i += 1) {
      cells.push(i * boardsize);
      cells.push(i * boardsize + 1);
    }
  } else if (player === 'npc') {
    for (let i = 1; i <= boardsize; i += 1) {
      cells.push(i * boardsize - 1);
      cells.push(i * boardsize - 2);
    }
  }

  while (numbers.length < quantity) {
    const number = Math.floor(Math.random() * cells.length);
    const newNumber = cells[number];
    const index = numbers.findIndex((item) => item === newNumber);
    if (index === -1) {
      numbers.push(newNumber);
    }
  }

  return numbers;
}

export function* characterGenerator(allowedTypes, maxLevel) {
  // TODO: write logic here
  const typeNumber = Math.floor(Math.random() * allowedTypes.length);
  const level = Math.floor(Math.random() * maxLevel + 1);
  yield new allowedTypes[typeNumber](level);
}

export function generateTeam(allowedTypes, maxLevel, characterCount) {
  // TODO: write logic here
  const characters = [];
  const positions = getPosition(allowedTypes.player, characterCount);
  for (let i = 0; i < characterCount; i += 1) {
    const position = positions[i];
    const newCharacter = characterGenerator(allowedTypes.types, maxLevel).next().value;
    newCharacter.team = allowedTypes.player;
    characters.push({ newCharacter, position });
  }

  return characters;
}
