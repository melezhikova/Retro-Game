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
import GameState from './GameState';
import cursors from './cursors';


export default class GameController {
  constructor(gamePlay, stateService) {
    this.gamePlay = gamePlay;
    this.stateService = stateService;
    this.jointTeam = [];
    this.scores = 0;
    this.level = 1;
    this.chosenCharacterCell = -1;
    if (localStorage.getItem('state')) {
      this.gameState = new GameState.from(this.stateService.load());
    } else {
      this.gameState = new GameState();
    }
  }

  getPositionedCharacters(player, quantity) {
    let level;
    if (this.gameState && this.gameState.level) {
      level = this.gameState.level;
    } else {
      level = this.level;
    }
    const positionedCharacters = [];
    let arrChar = [];
    if (player === 'gamerBeginer') {
      arrChar = generateTeam(new Team().gamerBeginer, level, quantity);
    } else if (player === 'gamer') {
      arrChar = generateTeam(new Team().gamer, level - 1, quantity);
    } else {
      arrChar = generateTeam(new Team().pc, level, quantity);
    }

    for (let i = 0; i < arrChar.length; i += 1) {
      const character = arrChar[i].newCharacter;
      const { position } = arrChar[i];
      const positionedCharacter = new PositionedCharacter(character, position);
      positionedCharacters.push(positionedCharacter);
    }

    return positionedCharacters;
  }

  drawTheme(level) {
    switch (level) {
      case 1:
        this.gamePlay.drawUi(themes.prairie);
        break;
      case 2:
        this.gamePlay.drawUi(themes.desert);
        break;
      case 3:
        this.gamePlay.drawUi(themes.arctic);
        break;
      case 4:
        this.gamePlay.drawUi(themes.mountain);
        break;
      default:
        break;
    }
  }

  updateScores() {
    const scoresBox = document.querySelector('.scores');
    if (this.gameState && this.gameState.scores) {
      scoresBox.innerText = `Scores: ${this.gameState.scores}`;
    } else {
      scoresBox.innerText = `Scores: ${this.scores}`;
    }
  }

  updateLevel() {
    const levelBox = document.querySelector('.level');
    if (this.gameState && this.gameState.level) {
      levelBox.innerText = `Level: ${this.gameState.level}`;
    } else {
      levelBox.innerText = `Level: ${this.level}`;
    }
  }

  init() {
    // TODO: add event listeners to gamePlay events
    // TODO: load saved stated from stateService
    if (this.gameState && this.gameState.level) {
      this.drawTheme(this.gameState.level);
    } else {
      this.gamePlay.drawUi(themes.prairie);
    }

    this.updateLevel();
    this.updateScores();

    if (this.gameState && this.gameState.chars) {
      this.jointTeam = [...this.gameState.chars];
    } else {
      const gamerTeam = this.getPositionedCharacters('gamerBeginer', 2);
      const pcTeam = this.getPositionedCharacters('npc', 2);
      this.jointTeam = [...gamerTeam, ...pcTeam];
    }
    this.gamePlay.redrawPositions(this.jointTeam);

    this.showCharInfo();

    if (!localStorage.getItem('state')) {
      this.stateService.save({
        chars: this.jointTeam,
        activePlayer: 'gamer',
        level: this.level,
        scores: this.scores,
      });
      this.gameState = new GameState.from(this.stateService.load());
    }

    this.gamePlay.addNewGameListener(this.onNewGameClick.bind(this));
    this.gamePlay.addSaveGameListener(this.onSaveGameClick.bind(this));
    this.gamePlay.addLoadGameListener(this.onLoadGameClick.bind(this));

    if (this.gameState && this.gameState.activePlayer === 'npc') {
      this.npcActions();
    }
    console.log(this.gamePlay);
    console.log(this.stateService);
    console.log(this.gameState);
  }

  showCharInfo() {
    this.gamePlay.addCellEnterListener(this.onCellEnter.bind(this));
    this.gamePlay.addCellLeaveListener(this.onCellLeave.bind(this));
    this.gamePlay.addCellClickListener(this.onCellClick.bind(this));
  }

  onNewGameClick() {
    this.scores = this.gameState.scores;
    localStorage.removeItem('state');
    this.gameState = new GameState();
    this.chosenCharacterCell = -1;
    this.init();
  }

  onSaveGameClick() {
    this.stateService.userSave(this.gameState);
    GamePlay.showMessage('Игра сохранена');
  }

  onLoadGameClick() {
    if (this.stateService.storage.getItem('UserState')) {
      this.gameState = new GameState.from(this.stateService.userLoad());
      this.chosenCharacterCell = -1;
      this.init();
    } else {
      GamePlay.showMessage('Нет сохраненных игр');
    }
  }

  checkLevelUp() {
    if (this.gameState.activePlayer === 'gamer') {
      if (this.countChars('npc') > 0) {
        this.gameState.activePlayer = 'npc';
        this.npcActions();
      } else {
        let scoreLevel = 0;
        this.gameState.chars.forEach((item) => {
          if (item.character.health > 0) {
            scoreLevel += item.character.health;
          }
        });
        this.gameState.scores += scoreLevel;

        if (this.gameState.level < 4) {
          this.gameState.level += 1;
          this.levelUp();
        } else {
          GamePlay.showMessage('Поздравляю! Вы выиграли!');
          this.endGame();
        }
      }
    } else if (this.countChars('gamer') > 0) {
      this.gameState.activePlayer = 'gamer';
    } else {
      GamePlay.showMessage('Вы проиграли :(');
      this.endGame();
    }
    this.updateScores();
    this.updateLevel();
    this.stateService.save(this.gameState);
  }

  endGame() {
    this.gamePlay.cellClickListeners = [];
    this.gamePlay.cellEnterListeners = [];
    this.gamePlay.cellLeaveListeners = [];
  }

  levelUp() {
    GamePlay.showMessage('Поздравляю! Вы прошли уровень!');
    const gamerTeam = this.gameState.chars.filter((item) => item.character.team === 'gamer' && item.character.health > 0);

    gamerTeam.forEach((item) => {
      item.character.level += 1;
      item.character.attack = Math.max(
        item.character.attack,
        item.character.attack * ((1.8 - item.character.health) / 100),
      );
      item.character.health += 80;
      if (item.character.health > 100) {
        item.character.health = 100;
      }
    });

    let gamerNewMember = [];
    if (this.gameState.level === 2) {
      gamerNewMember = this.getPositionedCharacters('gamer', 1);
    } else {
      gamerNewMember = this.getPositionedCharacters('gamer', 2);
    }
    gamerNewMember.forEach((item) => gamerTeam.push(item));

    const npcTeam = this.getPositionedCharacters('npc', gamerTeam.length);
    this.jointTeam = [...gamerTeam, ...npcTeam];
    this.drawTheme(this.gameState.level);
    this.gamePlay.redrawPositions(this.jointTeam);
  }

  npcActions() {
    const chars = [];
    const charsHealth = [];
    for (let i = 0; i < this.gameState.chars.length; i += 1) {
      const item = this.gameState.chars[i];
      if (item.character.team === 'npc' && item.character.health > 0) {
        chars.push(this.gameState.chars[i]);
        charsHealth.push(item.character.health);
      }
    }
    const char = chars[charsHealth.indexOf(Math.min(...charsHealth))];
    const enemy = this.findNpcEnemy(char.position, char.character.type);
    if (enemy === false) {
      this.npcMove(char.position, char.character.type);
    } else {
      this.attackGamer(enemy, char.character.type);
    }
  }

  npcMove(index, character) {
    let cellsQuantity = 0;
    if (character === 'undead') {
      cellsQuantity = 4;
    } else if (character === 'vampire') {
      cellsQuantity = 2;
    } else if (character === 'daemon') {
      cellsQuantity = 1;
    }

    let goZone = this.getZone(index, cellsQuantity);
    const positions = [];
    this.gameState.chars.forEach((item) => positions.push(item.position));
    goZone = goZone.filter((item) => item >= 0 && item < 64 && !positions.includes(item));

    const cell = Math.floor(Math.random() * goZone.length);
    const char = this.jointTeam.findIndex((item) => item.position === index);
    this.jointTeam[char].position = goZone[cell];
    this.gamePlay.redrawPositions(this.jointTeam);

    this.gameState.chars = this.jointTeam;
    this.gameState.activePlayer = 'gamer';
    this.stateService.save(this.gameState);
  }

  findNpcEnemy(index, character) {
    const enemies = [];
    for (let i = 0; i < this.gameState.chars.length; i += 1) {
      const item = this.gameState.chars[i];
      if (item.character.team === 'gamer' && item.character.health > 0) {
        enemies.push(this.gameState.chars[i]);
      }
    }

    let cellsQuantity = 0;
    if (character === 'daemon') {
      cellsQuantity = 4;
    } else if (character === 'vampire') {
      cellsQuantity = 2;
    } else if (character === 'undead') {
      cellsQuantity = 1;
    }

    let damageZone = this.getZone(index, cellsQuantity);
    damageZone = damageZone.filter((item) => item >= 0 && item < 64);

    const enemiesInZone = enemies.filter((item) => damageZone.includes(item.position));
    if (enemiesInZone.length === 0) {
      return false;
    }
    if (enemiesInZone.length > 1) {
      const healths = [];
      enemiesInZone.forEach((item) => healths.push(item.character.health));
      return enemiesInZone[healths.indexOf(Math.min(...healths))];
    }
    return enemiesInZone[0];
  }

  attackGamer(enemy, character) {
    let attack;
    let defence;
    if (character === 'daemon') {
      attack = new Daemon().attack;
    } else if (character === 'vampire') {
      attack = new Vampire().attack;
    } else if (character === 'undead') {
      attack = new Undead().attack;
    }
    if (enemy.character.type === 'swordsman') {
      defence = new Swordsman().defence;
    } else if (enemy.character.type === 'magician') {
      defence = new Magician().defence;
    } else if (enemy.character.type === 'bowman') {
      defence = new Bowman().defence;
    }
    const damage = Math.round(Math.max(attack - defence, attack * 0.1));
    this.gamePlay.showDamage(enemy.position, damage).then(() => {
      enemy.character.health -= damage;
      if (enemy.character.health <= 0) {
        if (enemy.position === this.chosenCharacterCell) {
          this.gamePlay.deselectCell(enemy.position);
          this.chosenCharacterCell = -1;
        }
      }
      this.jointTeam = this.jointTeam.filter((item) => item.character.health >= 0);

      this.gameState.chars = this.jointTeam;
      this.stateService.save(this.gameState);

      this.gamePlay.redrawPositions(this.jointTeam);
      this.checkLevelUp();
    });
  }

  onCellClick(index) {
    // TODO: react to click
    if (this.gamePlay.cells[index].children.length > 0) {
      const characterClass = this.gamePlay.cells[index].querySelector('.character').className;
      if (characterClass.includes('gamer')) {
        const selectedCell = this.gamePlay.cells.indexOf(document.querySelector('.selected-yellow'));
        if (selectedCell >= 0) {
          this.gamePlay.deselectCell(selectedCell);
        }
        this.gamePlay.selectCell(index);
        this.chosenCharacterCell = index;
      } else if (this.chosenCharacterCell !== -1) {
        const mayDamage = this.checkToDamage(index);
        if (mayDamage === true) {
          this.attackOpponent(index);
        } else {
          GamePlay.showError('Персонаж противника находится слишком далеко для атаки');
        }
      } else {
        GamePlay.showError('Это персонаж противника!');
      }
    } else {
      const mayGo = this.checkToGo(index);
      if (mayGo === true) {
        this.moveCharacter(index);
      }
    }
  }

  onCellEnter(index) {
    // TODO: react to mouse enter
    if (this.gamePlay.cells[index].children.length > 0) {
      const character = this.gamePlay.cells[index].querySelector('.character').className;
      if (character.includes('gamer')) {
        this.gamePlay.setCursor(cursors.pointer);
      } else if (this.chosenCharacterCell !== -1) {
        const mayDamage = this.checkToDamage(index);
        if (mayDamage === true) {
          this.gamePlay.setCursor(cursors.crosshair);
          this.gamePlay.selectCell(index, 'red');
        } else {
          this.gamePlay.setCursor(cursors.notallowed);
        }
      }
      const message = this.getMessage(index);
      this.gamePlay.showCellTooltip(message, index);
    } else if (this.chosenCharacterCell !== -1) {
      const mayGo = this.checkToGo(index);
      if (mayGo === true) {
        this.gamePlay.setCursor(cursors.pointer);
        this.gamePlay.selectCell(index, 'green');
      } else {
        this.gamePlay.setCursor(cursors.notallowed);
      }
    }
  }

  onCellLeave(index) {
    // TODO: react to mouse leave
    this.gamePlay.hideCellTooltip(index);
    this.gamePlay.setCursor(cursors.auto);
    const cellClass = this.gamePlay.cells[index].className;
    if (cellClass.includes('selected-green')) {
      this.gamePlay.deselectCell(index);
    }
    if (cellClass.includes('selected-red')) {
      this.gamePlay.deselectCell(index);
    }
  }

  moveCharacter(index) {
    const char = this.jointTeam.findIndex((item) => item.position === this.chosenCharacterCell);
    this.jointTeam[char].position = index;
    this.gamePlay.redrawPositions(this.jointTeam);

    this.gameState.chars = this.jointTeam;
    this.gameState.activePlayer = 'npc';
    this.stateService.save(this.gameState);

    this.chosenCharacterCell = index;
    const selectedCell = this.gamePlay.cells.indexOf(document.querySelector('.selected-yellow'));
    this.gamePlay.deselectCell(selectedCell);
    this.gamePlay.selectCell(index);

    this.npcActions();
  }

  attackOpponent(index) {
    const characterClass = this.gamePlay.cells[this.chosenCharacterCell].querySelector('.character').className;
    const opponentClass = this.gamePlay.cells[index].querySelector('.character').className;
    let attack;
    let defence;
    if (characterClass.includes('bowman')) {
      attack = new Bowman().attack;
    } else if (characterClass.includes('magician')) {
      attack = new Magician().attack;
    } else if (characterClass.includes('swordsman')) {
      attack = new Swordsman().attack;
    }
    if (opponentClass.includes('daemon')) {
      defence = new Daemon().defence;
    } else if (opponentClass.includes('undead')) {
      defence = new Undead().defence;
    } else if (opponentClass.includes('vampire')) {
      defence = new Vampire().defence;
    }
    const damage = Math.round(Math.max(
      attack - defence,
      attack * 0.1,
    ));
    this.gamePlay.showDamage(index, damage).then(() => {
      const opponent = this.jointTeam.findIndex((item) => item.position === index);
      this.jointTeam[opponent].character.health -= damage;
      this.jointTeam = this.jointTeam.filter((item) => item.character.health > 0);

      this.gameState.chars = this.jointTeam;
      this.stateService.save(this.gameState);

      this.gamePlay.redrawPositions(this.jointTeam);
      this.checkLevelUp();
    });
  }

  checkToGo(index) {
    const character = this.gamePlay.cells[this.chosenCharacterCell].querySelector('.character').className;

    let cellsQuantity = 0;
    if (character.includes('swordsman')) {
      cellsQuantity = 4;
    } else if (character.includes('bowman')) {
      cellsQuantity = 2;
    } else if (character.includes('magician')) {
      cellsQuantity = 1;
    }
    const zone = this.getZone(this.chosenCharacterCell, cellsQuantity);
    if (zone.includes(index)) {
      return true;
    }
    return false;
  }

  checkToDamage(index) {
    const character = this.gamePlay.cells[this.chosenCharacterCell].querySelector('.character').className;
    let cellsQuantity = 0;
    if (character.includes('magician')) {
      cellsQuantity = 4;
    } else if (character.includes('bowman')) {
      cellsQuantity = 2;
    } else if (character.includes('swordsman')) {
      cellsQuantity = 1;
    }
    const zone = this.getZone(this.chosenCharacterCell, cellsQuantity);
    if (zone.includes(index)) {
      return true;
    }
    return false;
  }

  getMessage(index) {
    const cell = this.gamePlay.cells[index];
    const characterClass = cell.querySelector('.character').className;
    const levelClass = cell.querySelector('.health-level').className;
    const level = levelClass.substring(levelClass.indexOf(' ') + 1, levelClass.length) * 1;
    const healthClass = cell.querySelector('.health-level-indicator').className;
    const health = healthClass.substring(0, healthClass.indexOf(' ')) * 1;

    let attack;
    let defence;
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

  countChars(player) {
    let number = 0;
    for (let i = 0; i < this.gameState.chars.length; i += 1) {
      const item = this.gameState.chars[i];
      if (item.character.team === player && item.character.health > 0) {
        number += 1;
      }
    }
    return number;
  }

  getZone(index, cellsQuantity) {
    const zone = [];
    for (let i = 1; i <= cellsQuantity; i += 1) {
      zone.push(index + this.gamePlay.boardSize * i);
      zone.push(index - this.gamePlay.boardSize * i);

      let check = true;
      for (let j = 1; j <= i; j += 1) {
        if ((index + j) % this.gamePlay.boardSize === 0) {
          check = false;
        }
      }
      if (check === true) {
        zone.push(index + i);
        zone.push(index - (this.gamePlay.boardSize - 1) * i);
        zone.push(index + (this.gamePlay.boardSize + 1) * i);
      }

      check = true;
      for (let j = 0; j < i; j += 1) {
        if ((index - 1 * j) % this.gamePlay.boardSize === 0) {
          check = false;
        }
      }
      if (check === true) {
        zone.push(index - i);
        zone.push(index - (this.gamePlay.boardSize + 1) * i);
        zone.push(index + (this.gamePlay.boardSize - 1) * i);
      }
    }
    return zone;
  }
}
