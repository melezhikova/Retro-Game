import Bowman from './bowman';
import Daemon from './daemon';
import Magician from './magician';
import Swordsman from './swordsman';
import Undead from './undead';
import Vampire from './vampire';

export default class Team {
  constructor() {
    this.gamer = {
      types: [Bowman, Swordsman, Magician],
      player: 'gamer',
    };
    this.gamerBeginer = {
      types: [Bowman, Swordsman],
      player: 'gamer',
    };
    this.pc = {
      types: [Daemon, Undead, Vampire],
      player: 'npc',
    };
  }
}
