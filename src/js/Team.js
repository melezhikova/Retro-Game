import Bowman from './bowman';
import Daemon from './daemon';
import Magician from './magician';
import Swordsman from './swordsman';
import Undead from './undead';
import Vampire from './vampire';

export default class Team {

    gamer = {
        types: [Bowman, Swordsman, Daemon, Magician, Undead, Vampire],
        player: 'gamer'
    }
    gamerBeginer = {
        types: [Bowman, Swordsman],
        player: 'gamer'
    }
    pc = {
        types: [Bowman, Swordsman, Daemon, Magician, Undead, Vampire],
        player: 'pc'
    }
}
