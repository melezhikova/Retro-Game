export default function calcTileType(index, boardSize) {
  // TODO: write logic here
  if (index === 0) {
    return 'top-left';
  } else if (index > 0 && index < boardSize - 1) {
    return 'top';
  } else if (index === boardSize - 1) {
    return 'top-right';
  } else if (index === boardSize ** 2 - 1) {
    return 'bottom-right';
  } else if (index === (boardSize ** 2 - boardSize)) {
    return 'bottom-left';
  } else if (index > (boardSize ** 2 - boardSize) && index < boardSize ** 2 - 1) {
    return 'bottom';
  } else if ((index + 1) % boardSize === 0) {
    return 'right';
  } else if (index % boardSize === 0) {
    return 'left';
  } else {
    return 'center';
  }
}

export function calcHealthLevel(health) {
  if (health < 15) {
    return 'critical';
  }

  if (health < 50) {
    return 'normal';
  }

  return 'high';
}
