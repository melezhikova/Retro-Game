/**
 * Generates random characters
 *
 * @param allowedTypes iterable of classes
 * @param maxLevel max character level
 * @returns Character type children (ex. Magician, Bowman, etc)
 */

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
  for (let i = 0; i < characterCount; i += 1) {
    const newCharacter = characterGenerator(allowedTypes, maxLevel).next().value;
    characters.push(newCharacter);
  }
  return characters;
}
