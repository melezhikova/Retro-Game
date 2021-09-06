import themes from './themes';
import { generateTeam } from './generators';
import Bowman from './bowman';
import Daemon from './daemon';
import Magician from './magician';
import Swordsman from './swordsman';
import Undead from './undead';
import Vampire from './vampire';
import PositionedCharacter from './PositionedCharacter';

const allowedTypes = [Bowman, Swordsman, Daemon, Magician, Undead, Vampire];
const allowedTypesBeginer = [Bowman, Swordsman];


export default class GameController {
  constructor(gamePlay, stateService) {
    this.gamePlay = gamePlay;
    this.stateService = stateService;
  }

  getPosition (player, quantity) {
    let numbers = [];
    let cells = [];
    if (player === 'gamer') {
      for (let i = 0; i < this.gamePlay.boardSize; i += 1) {
        cells.push(i * this.gamePlay.boardSize);
        cells.push(i * this.gamePlay.boardSize + 1);
      }
    } else if (player === 'pc') {
        for (let i = 0; i < this.gamePlay.boardSize; i += 1) {
          cells.push(i * this.gamePlay.boardSize + 6);
          cells.push(i * this.gamePlay.boardSize + 7);
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

    console.log(numbers);
    return numbers;
  }

  createCharacters (level) {
    let characters = [];
    if (level === 1) {
      characters = generateTeam(allowedTypes, 1, 2);
      console.log(characters);
    }
    return characters;
  }

  getPositionedCharacters (player, quantity) {
    let positionedCharacters = [];
    const arrChar = this.createCharacters(1);
    const arrPosition = this.getPosition(player, quantity);

    for (let i = 0; i < arrChar.length; i += 1) {
      let character = arrChar[i];
      let position = arrPosition[i];

      let positionedCharacter = new PositionedCharacter(character, position);
      positionedCharacters.push(positionedCharacter);

      const cell = this.gamePlay.cells[position];
      const type = cell.childNodes;
      console.log(type);
    }
    console.log(positionedCharacters);

    return positionedCharacters;
  }

  init() {
    // TODO: add event listeners to gamePlay events
    // TODO: load saved stated from stateService
    this.gamePlay.drawUi(themes.prairie);

    console.log(this.gamePlay);
    
    const gamerTeam = this.getPositionedCharacters('gamer', 2);
    const pcTeam = this.getPositionedCharacters('pc', 2);
    const jointTeam = [];
    gamerTeam.forEach((item) => {
      jointTeam.push(item);
    })
    pcTeam.forEach((item) => {
      jointTeam.push(item);
    })

    this.gamePlay.redrawPositions(jointTeam);
    
    console.log(this.gamePlay);

    
  }

  showCharInfo () {
    this.gamePlay.cells.forEach((item) => {
      item.onmouseover = this.gameplay.addCellEnterListener(this.onCellEnter);
    })
  }

  onCellClick(index) {
    // TODO: react to click
  }

  onCellEnter(index) {
    // TODO: react to mouse enter
   if (this.gameplay.cells[index].children.length > 0) {
     const message = this.getMessage(index);
     this.gamePlay.showCellTooltip(message, index);

     console.log(this.gamePlay.cells[index]);
   }
  }

  onCellLeave(index) {
    // TODO: react to mouse leave
  }

  getMessage (index) {
    const cell = this.gamePlay.cells[index];
    const type = cell.firstElementChild.className;
    console.log(type);
  }
}
