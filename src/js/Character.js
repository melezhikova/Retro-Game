export default class Character {
  constructor(level) {
    this.level = level;
    //this.attack = 0;
    //this.defence = 0;
    this.health = 50;
    //this.type = type;
    // TODO: throw error if user use "new Character()"
    if (new.target.name === 'Character') {
      throw new Error ('Создание объектов класса Character запрещено');
    }
  }
}
