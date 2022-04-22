
class Food {
/**
 * @class
 * @classdesc Represents food.
 * @date March 14, 2022
 * @author Austin Bennett
 * @author Daniele Di Cesare
 * @author Rasik Pokharel
*/
  constructor () {
    let x = 400 + SIZE + Math.floor(random(0, 38)) * SIZE
    let y = SIZE + Math.floor(random(0, 38)) * SIZE
    /**
     * Keeps track of the position of the food using a vector
     * @type {createVector}
     */
    this.pos = new createVector(x, y)
  }

  /**
   * Draws on food on canvas.
   * @implements p5.js
   */
  show () {
    const RAD = 5;
    fill('#e06c75')
    stroke('#282c34')
    rect(this.pos.x, this.pos.y, SIZE, SIZE, RAD)
  }

  /**
   * Clones food object.
   * @returns {Food} Food object
   */
  clone () {
    let clone = new Food()
    clone.pos.x = this.pos.x
    clone.pos.y = this.pos.y
    return clone
  }
}

global.Food = Food