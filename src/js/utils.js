export default function calcTileType(index, boardSize) {
  // TODO: write logic here
  if (index === 0) {
    return 'top-left';
  } if (index > 0 && index < boardSize - 1) {
    return 'top';
  } if (index === boardSize - 1) {
    return 'top-right';
  } if (index === boardSize ** 2 - 1) {
    return 'bottom-right';
  } if (index === (boardSize ** 2 - boardSize)) {
    return 'bottom-left';
  } if (index > (boardSize ** 2 - boardSize) && index < boardSize ** 2 - 1) {
    return 'bottom';
  } if ((index + 1) % boardSize === 0) {
    return 'right';
  } if (index % boardSize === 0) {
    return 'left';
  }
  return 'center';
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
