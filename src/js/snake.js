/**
 * @date March 14, 2022
 * @author Daniele Di Cesare
 * @author Austin Bennett
 * @author Rasik Pokharel
 */

class Snake {
  /**
   * @class
   * @classdesc Class for creating a snake object for use on the Game board.
   * @param {string} inType Specifies whether the snake is created using a lis
   * or a list of foods.
   * @param {int/array} lst Specifies the number of hidden layers for the model
   * or a list of food locations.
   */
  constructor (inType, lst) {
    /** Keeps track of the amount of food eaten
     * @type {int}
     */
    this.score = 1
    /** Number of movements left until the snake dies.
     * @type {int}
     */
    this.lifeLeft = 200
    /**
     * Time the snake has been alive, in terms of number of moves.
     * @type {int}
     */
    this.lifetime = 0
    /**
     * Direction/velocity in the X direction.
     * @type {int}
     */
    this.xVel = 0
    /**
     * Direction/velocity in the Y direction.
     * @type {int}
     */
    this.yVel = 0
    /**
     * Current food index in the food array.
     * @type {int}
     */
    this.foodItterate = 0
    /**
     * Calculated fitness of the model.
     * @type {int}
     */
    this.fitness = 0
    /**
     * Death state of the snake.
     * @type {boolean}
     */
    this.dead = false
    /**
     * If the current snake is being displayed on the canvas.
     * @type {boolean}
     */
    this.replay = false

    /**
     * Vision input to the neural network.
     * @type {array}
     */
    this.vision = []
    /**
     * Decision output of the neural network.
     * @type {array}
     */
    this.decision = []
    /**
     * List of food locations provided/eaten.
     * @type {array}
     */
    this.foodList = []
    /**
     * Coordinates of the snake's body.
     * @type {array}
     */
    this.body = []
    /**
     * Vector coordinates of the snake head.
     * @type {p5.Vector}
     */
    this.head = null

    if (inType === "layers") { // nn layer list
      this.head = new createVector(800, height / 2)
      this.food = new Food()
      if (!humanPlaying) {
        this.vision = Array.apply(null, Array(24)).map(Number.prototype.valueOf,0)
        this.decision = Array.apply(null, Array(4)).map(Number.prototype.valueOf,0)
        this.foodList.push(this.food.clone())
        this.brain = new NeuralNet(24, hiddenNodes, 4, lst)
        this.body.push(new createVector(800, (height / 2) + SIZE))
        this.body.push(new createVector(800, (height / 2) + (2 * SIZE)))
        this.score += this.body.length
      }
    } else if (inType === "foods") { // Food list
      this.replay = true
      this.vision = Array.apply(null, Array(24)).map(Number.prototype.valueOf,0)
      this.decision = Array.apply(null, Array(4)).map(Number.prototype.valueOf,0)
      for (let i = 0; i < lst.length; i++) {
        this.foodList.push(lst[i].clone())
      }
      this.food = this.foodList[this.foodItterate]
      this.foodItterate++
      this.head = new createVector(800, height/2)
      this.body.push(new createVector(800, (height/2)+SIZE))
      this.body.push(new createVector(800, (height/2)+(2*SIZE)))
      this.score += 2
    } else {
      this.head = new createVector(800, height / 2)
      this.food = new Food()
      if (!humanPlaying) {
        this.vision = Array.apply(null, Array(24)).map(Number.prototype.valueOf,0)
        this.decision = Array.apply(null, Array(4)).map(Number.prototype.valueOf,0)
        this.foodList.push(this.food.clone())
        this.brain = new NeuralNet(24, hiddenNodes, 4, hiddenLayers)
        this.body.push(new createVector(800, (height / 2) + SIZE))
        this.body.push(new createVector(800, (height / 2) + (2 * SIZE)))
        this.score += this.body.length
      }
    }

  }

  /**
   * Checks if a position collides with any part of the snake object.
   * @param {int} x X-Coordinate on the game board to check.
   * @param {int} y Y-Coordinate on the game board to check.
   * @returns {boolean} true if the positions collide, false otherwise.
   */
  bodyCollide (x, y) {
    for (let i = 0; i < this.body.length; i++) {
      if (x === this.body[i].x && y === this.body[i].y) {
        return true
      }
    }
    return false
  }

  /**
   * Checks if a position collides with the existing food block.
   * @param {int} x X-Coordinate on the game board to check.
   * @param {int} y Y-Coordinate on the game board to check.
   * @returns {boolean} true if the positions collide, false otherwise.
   */
  foodCollide (x, y) {
    if (x === this.food.pos.x && y === this.food.pos.y) {
      return true
    }
    return false
  }

  /**
   * Checks if a position collides with the boarders of the game.
   * @param {int} x X-Coordinate on the game board to check.
   * @param {int} y Y-Coordinate on the game board to check.
   * @returns {boolean} true if the positions collide, false otherwise.
   */
  wallCollide (x, y) {
    if (x >= width-(SIZE) || x < 400 + SIZE || y >= height-(SIZE) || y < SIZE) {
      return true
    }
    return false
  }

  /**
   * Draws the snake on the canvas.
   * @implements p5.js
   */
  show () {
    if (!replayBest && this.dead) {
      return
    }
    this.food.show()
    fill('#98c379')
    stroke('#282c34')
    const RAD = 5;
    for (let i = 0; i < this.body.length; i++) {
      rect(this.body[i].x, this.body[i].y,SIZE,SIZE,RAD)
    }

    //head colors
    if (this.dead) {
      fill('#e06c75')
    } else {
      fill('#76a655')
    }
    rect(this.head.x,this.head.y,SIZE,SIZE,RAD)
  }

  /**
   * Updates the snake state after a move is made.
   * Handles updating death state of the snake,
   * as well as its lifetime.
   */
  move () {
    if(!this.dead) {
      if (!humanPlaying && !modelLoaded) {
        this.lifetime++;
        this.lifeLeft--;
      }
      if(this.foodCollide(this.head.x, this.head.y)) {
        this.eat()
      }
      this.shiftBody()
      if (this.wallCollide(this.head.x, this.head.y)) {
        this.dead = true
      } else if (this.bodyCollide(this.head.x, this.head.y)) {
        this.dead = true
      } else if (this.lifeLeft <= 0 && !humanPlaying) {
        this.dead = true
      }
    }
  }

  /**
   * Updates the snake's state after colliding with a food object.
   * Extends the lifetime of the snake and increases the body length.
   */
  eat () {
    let len = this.body.length - 1
    this.score++
    if (!humanPlaying && !modelLoaded) {
      if (this.lifeLeft < 500) {
        if (this.lifeLeft > 400) {
          this.lifeLeft = 500
        } else {
          this.lifeLeft += 100
        }
      }
    }
    if (len >= 0) {
      this.body.push(new createVector(this.body[len].x, this.body[len].y))
    } else {
      this.body.push(new createVector(this.head.x, this.head.y))
    }
    if (!this.replay) {
      this.food = new Food()
      while(this.bodyCollide(this.food.pos.x, this.food.pos.y)) {
        this.food = new Food()
      }
      if (!humanPlaying) {
        this.foodList.push(this.food)
      }
    } else {
      this.food = this.foodList[this.foodItterate]
      this.foodItterate++
    }
  }

  /**
   * Shifts the body in the direction of it's head velocity.
   */
  shiftBody () {
    let tempx = this.head.x
    let tempy = this.head.y
    this.head.x += this.xVel
    this.head.y += this.yVel
    let temp2x
    let temp2y
    for (let i = 0; i < this.body.length; i++) {
      temp2x = this.body[i].x
      temp2y = this.body[i].y
      this.body[i].x = tempx
      this.body[i].y = tempy
      tempx = temp2x
      tempy = temp2y
    }
  }

  /**
   * Duplicates the snake's neural network and passes the
   * eaten food coordinates to be displayed in a replay.
   * @returns {Snake} clone of the current snake.
   */
  cloneForReplay() {
    let clone = new Snake("foods", this.foodList)
    clone.brain = this.brain.clone()
    return clone
  }

  /**
   * Duplicates the snake's neural network and creates a
   * new snake with a new state.
   * @returns {Snake} clone of the current snake.
   */
  clone () {
    let clone = new Snake("layers", hiddenLayers)
    clone.brain = this.brain.clone()
    return clone
  }

  /**
   * Crosses the neural networks of the current snake and
   * a provided snake. Crossing allows for new behaviours
   * to emerge.
   * @param parent
   * @returns {Snake} A snake with a mixed neural network.
   */
  crossover(parent) {
    let child = new Snake("layers", hiddenLayers)
    child.brain = this.brain.crossover(parent.brain)
    return child
  }

  /**
   * Wrapper for the snake's neural network mutation method.
   */
  mutate () {
    this.brain.mutate(mutationRate)
  }

  /**
   * Calculates the fitness of the snake. A higher fitness correlates with
   * a better performing model. Factors in the lifetime and score of the
   * snake.
   */
  calculateFitness () {
    if (this.score < 6) {
      this.fitness = floor(this.lifetime) * pow(2, this.score)
    }
    else if (this.score < 10) {
      this.fitness = floor(pow(this.lifetime, 1.5)) * pow(2, this.score)
    } else {
      this.fitness = floor(this.lifetime * this.lifetime)
      this.fitness *= pow(2, 10)
      this.fitness *= (this.score - 9)
    }
  }

  /**
   * Updates the vision array for the 8 directions from the snake head.
   * Vision is judged based on the presence of food, snake body, or wall.
   */
  look () { // 8 directions, food, body, wall
    this.vision = Array(24);
    let temp = this.lookInDirection(new createVector(-SIZE,0))
    this.vision[0] = temp[0]
    this.vision[1] = temp[1]
    this.vision[2] = temp[2]
    temp = this.lookInDirection(new createVector(-SIZE,-SIZE))
    this.vision[3] = temp[0]
    this.vision[4] = temp[1]
    this.vision[5] = temp[2]
    temp = this.lookInDirection(new createVector(0,-SIZE))
    this.vision[6] = temp[0]
    this.vision[7] = temp[1]
    this.vision[8] = temp[2]
    temp = this.lookInDirection(new createVector(SIZE,-SIZE))
    this.vision[9] = temp[0]
    this.vision[10] = temp[1]
    this.vision[11] = temp[2]
    temp = this.lookInDirection(new createVector(SIZE,0))
    this.vision[12] = temp[0]
    this.vision[13] = temp[1]
    this.vision[14] = temp[2]
    temp = this.lookInDirection(new createVector(SIZE,SIZE))
    this.vision[15] = temp[0]
    this.vision[16] = temp[1]
    this.vision[17] = temp[2]
    temp = this.lookInDirection(new createVector(0,SIZE))
    this.vision[18] = temp[0]
    this.vision[19] = temp[1]
    this.vision[20] = temp[2]
    temp = this.lookInDirection(new createVector(-SIZE,SIZE))
    this.vision[21] = temp[0]
    this.vision[22] = temp[1]
    this.vision[23] = temp[2]
  }

  /**
   * Draws a vector in the given direction to look for food, snake body,
   * or wall. Draws the vision vectors if the snake is being played
   * in a replay.
   * @implements p5.js
   * @param {p5.Vector} direction Direction vector representing which way to look for objects.
   * @returns {array} Array representing the presence of food, snake body, and walls.
   */
  lookInDirection (direction) {
    let look = Array.apply(null, Array(3)).map(Number.prototype.valueOf,0)
    let pos = new createVector(this.head.x, this.head.y)

    // If you are looking opposite to the current velocity, return 0s
    // if (direction.x + this.xVel === 0 && direction.y + this.yVel === 0) {
    //   look = [0, 0, 0]
    //   return look
    // }

    let distance = 0
    let foodFound = false
    let bodyFound = false
    pos.add(direction)
    distance += 1
    while (!this.wallCollide(pos.x, pos.y)) {
      if (!foodFound && this.foodCollide(pos.x, pos.y)) {
        foodFound = true
        look[0] = 1
      }
      if (!bodyFound && this.bodyCollide(pos.x, pos.y)) {
        bodyFound = true
        look[1] = 1
      }
      if (this.replay && seeVision) {
        stroke(0, 255, 0)
        point(pos.x, pos.y)
        if (foodFound) {
          noStroke()
          fill(255,255,51)
          ellipseMode(CENTER)
          ellipse(pos.x, pos.y, 5, 5)
        }
        if (bodyFound) {
          noStroke()
          fill(102,0,102)
          ellipseMode(CENTER)
          ellipse(pos.x, pos.y, 5, 5)
        }
      }
      pos.add(direction)
      distance += 1
    }
    if (this.replay && seeVision) {
      noStroke()
      fill(0,255,0)
      ellipseMode(CENTER)
      ellipse(pos.x, pos.y, 5, 5)
    }
    look[2] = 1/distance
    return look
  }

  /**
   * Passes the vision to the neural network to make a movement decision.
   * Based, on the direction, calls for the snake to move.
   */
  think () {
    this.decision = this.brain.output(this.vision)
    let maxIndex = 0
    let max = 0
    for (let i = 0; i < this.decision.length; i++) {
      if (this.decision[i] > max) {
        max = this.decision[i]
        maxIndex = i
      }
    }
    switch (maxIndex) {
      case 0:
        this.moveUp()
        break
      case 1:
        this.moveDown()
        break
      case 2:
        this.moveLeft()
        break
      case 3:
        this.moveRight()
        break
    }
  }

  /**
   * Initializes the head's movement vectors to the upward direction.
   * for the next move.
   */
  moveUp () {
    if (this.yVel !== SIZE) {
      this.xVel = 0
      this.yVel = -SIZE
    }
  }

  /**
   * Initializes the head's movement vectors to the downward direction.
   * for the next move.
   */
  moveDown () {
    if (this.yVel !== -SIZE) {
      this.xVel = 0
      this.yVel = SIZE
    }
  }

  /**
   * Initializes the head's movement vectors to the left direction.
   * for the next move.
   */
  moveLeft () {
    if (this.xVel !== SIZE) {
      this.xVel = -SIZE
      this.yVel = 0
    }
  }

  /**
   * Initializes the head's movement vectors to the right direction.
   * for the next move.
   */
  moveRight () {
    if (this.xVel !== -SIZE) {
      this.xVel = SIZE
      this.yVel = 0
    }
  }
}

global.Snake = Snake