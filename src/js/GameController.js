import themes from './themes';
import { generateTeam } from './generators';
import PositionedCharacter from './PositionedCharacter';
import Team from './Team';
import Bowman from './bowman';
import Daemon from './daemon';
import Magician from './magician';
import Swordsman from './swordsman';
import Undead from './undead';
import Vampire from './vampire';
import GamePlay from './GamePlay';


export default class GameController {
  constructor(gamePlay, stateService) {
    this.gamePlay = gamePlay;
    this.stateService = stateService;
  }

  chosenCharacter;

  getPositionedCharacters (player, level) {
    let positionedCharacters = [];
    let arrChar = [];
    if (player === 'gamerBeginer') {
      arrChar = generateTeam(new Team().gamerBeginer, level, 2);
      arrChar.forEach((item) => item.newCharacter.team = 'gamer');
    } else if (player === 'gamer') {
      arrChar = generateTeam(new Team().gamer, level, 2);
      arrChar.forEach((item) => item.newCharacter.team = 'gamer');
    } else {
      arrChar = generateTeam(new Team().pc, level, 2);
      arrChar.forEach((item) => item.newCharacter.team = 'pc');
    }

    for (let i = 0; i < arrChar.length; i += 1) {
      let character = arrChar[i].newCharacter;
      let position = arrChar[i].position;
      let positionedCharacter = new PositionedCharacter(character, position);
      positionedCharacters.push(positionedCharacter);
    }
    console.log(positionedCharacters);

    return positionedCharacters;
  }

  init() {
    // TODO: add event listeners to gamePlay events
    // TODO: load saved stated from stateService
    this.gamePlay.drawUi(themes.prairie);
    
    const gamerTeam = this.getPositionedCharacters('gamerBeginer', 1);
    const pcTeam = this.getPositionedCharacters('pc', 1);
    const jointTeam = [...gamerTeam, ...pcTeam];
    this.gamePlay.redrawPositions(jointTeam);
    
    this.showCharInfo ();

    console.log(this.gamePlay);
    console.log(this.stateService);
  }

  showCharInfo () {
    this.gamePlay.cells.forEach(() => {
      this.gamePlay.addCellEnterListener(this.onCellEnter.bind(this));
      this.gamePlay.addCellEnterListener(this.onCellLeave.bind(this));
    });

    this.gamePlay.cells.forEach((item) => 
      item.onclick = this.gamePlay.addCellEnterListener(this.onCellClick.bind(this))
    )
  }

  onCellClick(index) {
    // TODO: react to click
    if (this.gamePlay.cells[index].children.length > 0) {
      const characterClass = this.gamePlay.cells[index].querySelector('.character').className;
      if (characterClass.includes('gamer')) {
        this.gamePlay.selectCell(index);
        this.chosenCharacter = index;
      } else {
        GamePlay.showError('Это персонаж противника!');
      }
    }
  
  }

  onCellEnter(index) {
    // TODO: react to mouse enter
    if (this.gamePlay.cells[index].children.length > 0) {
      const message = this.getMessage(index);
      this.gamePlay.showCellTooltip(message, index);
   
      console.log(this.gamePlay.cells[index]);
    }
  }

  onCellLeave(index) {
    // TODO: react to mouse leave
    //this.gamePlay.hideCellTooltip(index);
  }

  getDamageZone() {
    const character = this.gamePlay.cells[this.chosenCharacter].querySelector('.character').className;
    if (character.includes('swordsman') || character.includes('undead')) {
      
    }
  }

  getMessage (index) {
    const cell = this.gamePlay.cells[index];
    const characterClass = cell.querySelector('.character').className;
    const levelClass = cell.querySelector('.health-level').className;
    const level = levelClass.substring(levelClass.indexOf(' ') + 1, levelClass.length) * 1;
    const healthClass = cell.querySelector('.health-level-indicator').className;
    const health = healthClass.substring(0, healthClass.indexOf(' ')) * 1;
    
    let attack, defence;
    if (characterClass.includes('bowman')) {
      attack = new Bowman().attack;
      defence = new Bowman().defence;
    } else if (characterClass.includes('daemon')) {
      attack = new Daemon().attack;
      defence = new Daemon().defence;
    } else if (characterClass.includes('magician')) {
      attack = new Magician().attack;
      defence = new Magician().defence;
    } else if (characterClass.includes('swordsman')) {
      attack = new Swordsman().attack;
      defence = new Swordsman().defence;
    } else if (characterClass.includes('undead')) {
      attack = new Undead().attack;
      defence = new Undead().defence;
    } else if (characterClass.includes('vampire')) {
      attack = new Vampire().attack;
      defence = new Vampire().defence;
    }
    
    return `\ud83c\udf96${level} \u2694${attack} \ud83d\udee1${defence} \u2764${health}`;
  }
}
