/**
 * Generates random characters
 *
 * @param allowedTypes iterable of classes
 * @param maxLevel max character level
 * @returns Character type children (ex. Magician, Bowman, etc)
 */

import GamePlay from "./GamePlay";

export function* characterGenerator(allowedTypes, maxLevel) {
  // TODO: write logic here
  function getRandom(max) {
    return Math.floor(Math.random() * (max - 1) + 1);
  }
  const typeNumber = getRandom(allowedTypes.length);
  const level = getRandom(maxLevel);
  yield new allowedTypes[typeNumber](level);
}

export function generateTeam(allowedTypes, maxLevel, characterCount) {
  // TODO: write logic here
  let characters = [];
  let positions = getPosition (allowedTypes.player, characterCount);
  for (let i = 0; i < characterCount; i += 1) {
    const position = positions[i];
    const newCharacter = characterGenerator(allowedTypes.types, maxLevel).next().value;
    characters.push({newCharacter, position});
  }

  return characters;
}

export function getPosition (player, quantity) {
  let numbers = [];
  let cells = [];
  const boardsize = new GamePlay().boardSize;
  if (player === 'gamer') {
    for (let i = 0; i < boardsize; i += 1) {
      cells.push(i * boardsize);
      cells.push(i * boardsize + 1);
    }
  } else if (player === 'pc') {
      for (let i = 1; i <= boardsize; i += 1) {
        cells.push(i * boardsize - 1);
        cells.push(i * boardsize - 2);
      }
  }

  function getRandom () {
    return Math.floor(Math.random() * cells.length);
  }
  
  while (numbers.length < quantity) {
    let number = getRandom ();
    let newNumber = cells[number];
    let index = numbers.findIndex((item) => item === newNumber);
    if (index === -1) {
      numbers.push(newNumber);
    }
  }

  return numbers;
}

