/**
  * @date March 17, 2022
  * @author Austin Bennett
  * @author Daniele Di Cesare
  * @author Rasik Pokharel
 */
class Population {
  /**
   * @class
   * @classdesc
   * @throws Error if size is less than 1
   * @param {int} size - The size of the snake population.
   */
  constructor (size) {
    /**
     * @type {int} Stores the score of the best snake.
     */
    this.bestSnakeScore = 0
    /**
     * @type {int} Keeps track of the generation number.
     */
    this.gen = 0

    /**
     * @type {int} 
     */
    this.samebest = 0
    /**
     * @type {int} Keeps track of the best fitness.
     */
    this.bestFitness = 0

    /**
     * @type {int} Stores the sum of fitnesses.
     */
    this.fitnessSum = 0

    /**
     * @type {Array} Stores all the snakes in the population.
     */

    if (size < 1) {
      throw Error('Invalid Population Size')
    }

    this.snakes = Array(size)
    for(let i = 0; i < this.snakes.length; i++) {
      this.snakes[i] = new Snake()
    }
    /**
     * @type {snake} Keeps track of the best snake
     */
    this.bestSnake = new Snake()
    this.bestSnake = this.snakes[0].clone()
    this.bestSnake.replay = true
  }

  /**
   * Checks if the generation is finished.
   * @returns {boolean} True if the generation has finished and the best snake has died.
   */
  done () {
    for (let i = 0; i < this.snakes.length; i++) {
      if (!this.snakes[i].dead) {
        return false
      }
    }
    if (!this.bestSnake.dead) {
      return false;
    }
    return true;
  }

  /**
   * Checks how many snakes are currently alive.
   * @returns {int} Current number of snakes alive.
   */
  alive () {
    let alive = 0
    for (let i = 0; i < this.snakes.length; i++) {
      if (!this.snakes[i].dead) {
        alive++
      }
    }
    return alive
  }

  /**
   * Controls each snake in the population
   */
  update () {
    if (!this.bestSnake.dead) {
      this.bestSnake.look()
      this.bestSnake.think()
      this.bestSnake.move()
    }
    for (let i = 0; i < this.snakes.length; i++) {
      if(!this.snakes[i].dead) {
        this.snakes[i].look()
        this.snakes[i].think()
        this.snakes[i].move()
      }
    }
  }

  /**
   * Draws the best snake of this generation to the canvas.
   */
  show () {
    if(replayBest) {
      this.bestSnake.show()
      this.bestSnake.brain.show(0,0,360,790,this.bestSnake.vision, this.bestSnake.decision)
    } else {
      for(let i = 0; i < this.snakes.length; i++) {
        this.snakes[i].show()
      }
    }
  }

  /**
   * Sets the best snake of this generation.
   */
  setBestSnake () {
    let max = 0
    let maxIndex = 0
    for (let i = 0; i < this.snakes.length; i++) {
      if(this.snakes[i].fitness > max) {
        max = this.snakes[i].fitness

        maxIndex = i
      }
    }
    if (max > this.bestFitness) {
      this.bestFitness = max
      this.bestSnakeScore = this.snakes[maxIndex].score
      this.bestSnake = this.snakes[maxIndex].cloneForReplay()
    } else {
      this.bestSnake = this.bestSnake.cloneForReplay()
    }
  }

  /**
   * Selects parents used for the next generation of snakes.
   * @returns {snake} Returns the a selected snake to be parent.
   */
  selectParent() {
    let rand = random(this.fitnessSum)
    let summation = 0
    for (let i = 0; i < this.snakes.length; i++) {
      summation += this.snakes[i].fitness
      if (summation > rand) {
        return this.snakes[i]
      }
    }
    return this.snakes[0]
  }

  /**
   * Creates a set of new snakes from prior generations.
   */
  naturalSelection () {
    let newSnakes = Array(this.snakes.length)

    this.setBestSnake()
    this.calculateFitnessSum()

    newSnakes[0] = this.bestSnake.clone() // add the best snake of prior generation
    for (let i = 1; i < this.snakes.length; i++) {
      let child = this.selectParent().crossover(this.selectParent())
      child.mutate()
      newSnakes[i] = child
    }

    for (let i = 0; i < this.snakes.length; i++) {
      this.snakes[i] = newSnakes[i].clone()
    }
    evolution.push(this.bestSnakeScore)
    this.gen += 1
  }

  /**
   * Mutates all the snakes of this generation.
   */
  mutate () {
    for (let i = 1; i < this.snakes.length; i++) {
      this.snakes[i].mutate()
    }
  }

  /**
   * Calculates the fitness of each snake.
   */
  calculateFitness () {
    for (let i = 0; i < this.snakes.length; i++) {
      this.snakes[i].calculateFitness()
    }
  }

  /**
   * Sum of the fitnesses.
   */
  calculateFitnessSum () {
    this.fitnessSum = 0
    for (let i = 0; i < this.snakes.length; i++) {
      this.fitnessSum += this.snakes[i].fitness
    }
  }
}

global.Population = Population