import calcTileType from '../utils';
import Character from '../Character';
import Bowman from '../bowman';

test('checking calcTileType1', () => {
  expect(calcTileType(0, 8)).toBe('top-left');
});

test('checking calcTileType2', () => {
  expect(calcTileType(7, 8)).toBe('top-right');
});
test('checking calcTileType3', () => {
  expect(calcTileType(4, 8)).toBe('top');
});

test('checking calcTileType4', () => {
  expect(calcTileType(13, 8)).toBe('center');
});

test('checking calcTileType5', () => {
  expect(calcTileType(24, 8)).toBe('left');
});

test('checking calcTileType6', () => {
  expect(calcTileType(39, 8)).toBe('right');
});

test('checking calcTileType7', () => {
  expect(calcTileType(63, 8)).toBe('bottom-right');
});

test('checking calcTileType8', () => {
  expect(calcTileType(56, 8)).toBe('bottom-left');
});

test('should throw an Error when try to create Character', () => {
  function create() {
    return new Character(1);
  }
  expect(create).toThrowError('Создание объектов класса Character запрещено');
});

test('should create Bowman without Error', () => {
  const received = new Bowman(1);
  const expected = {
    level: 1,
    health: 50,
    type: 'bowman',
    attack: 25,
    defence: 25,
  };
  expect(received).toEqual(expected);
});
