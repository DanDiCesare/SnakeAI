// Imports
require('../js/snake')
require('../js/food')
require('../js/NeuralNet')
require('../js/Matrix')
require('../js/EvolutionGraph')
require('../js/Population')
new p5()
global.width = 1200 // these don't carry over for some reason
global.height = 800

// describe is overwritten in p5, rename to testGroup
const testGroup = require('@jest/globals').describe

function setup() {
  createCanvas(width, height);
}

testGroup('Snake testing', () => {
  test('Constructor with no params', () => {
    let s = new Snake()

    expect(s.head).toEqual(new createVector(800, height/2))
    expect(s.brain.hLayers).toEqual(hiddenLayers)
    expect(s).toBeInstanceOf(Snake)
  })

  test('Constructor with Food List', () => {
    let foods = [new Food(), new Food(), new Food()]
    let s = new Snake('foods', foods)

    let outs = foods.slice() // copy

    expect(s.head).toEqual(new createVector(800, height/2))
    expect(s.foodList).toEqual(outs)
    expect(s.foodItterate).toEqual(1)
    expect(s).toBeInstanceOf(Snake)
  })

  test('Constructor with Custom Layers', () => {
    let s = new Snake('layers', 5)

    expect(s.head).toEqual(new createVector(800, height/2))
    expect(s.brain.hLayers).toEqual(5)
    expect(s).toBeInstanceOf(Snake)
  })

  test('bodyCollide: true', () => {
    let s = new Snake() // body at 800, (height / 2) + SIZE

    expect(s.bodyCollide(800, (height/2)+SIZE)).toBe(true)
  })

  test('bodyCollide: false', () => {
    let s = new Snake() // body at 800, (height / 2) + SIZE

    expect(s.bodyCollide(800, (height/2)-SIZE)).toBe(false)
  })

  test('foodCollide: true', () => {
    let s = new Snake()
    let coordsX = s.food.pos.x
    let coordsY = s.food.pos.y

    expect(s.foodCollide(coordsX, coordsY)).toBe(true)
  })

  test('foodCollide: false', () => {
    let s = new Snake()
    let coordsX = s.food.pos.x - SIZE
    let coordsY = s.food.pos.y

    expect(s.foodCollide(coordsX, coordsY)).toBe(false)
  })

  test('wallCollide: true, all sides', () => {
    let s = new Snake()
    expect(s.wallCollide(width, 400)).toBe(true)
    expect(s.wallCollide(400, height)).toBe(true)
    expect(s.wallCollide(0, height)).toBe(true)
    expect(s.wallCollide(width, 0)).toBe(true)
  })

  test('wallCollide: false', () => {
    let s = new Snake()
    expect(s.wallCollide(width-SIZE-SIZE, 400)).toBe(false)
  })

  test('move, snake dead', () => {
    let s = new Snake()
    s.dead = true
    let preMove = [s.lifetime, s.lifeLeft]
    let preBody = Array(s.body.length)
    for (let i=0; i < s.body.length; i++) {
      preBody[i] = new createVector(s.body[i].x, s.body[i].y)
    }
    s.move()
    expect(s.body).toEqual(preBody)
    expect([s.lifetime, s.lifeLeft]).toEqual(preMove)
  })

  test('move, snake alive', () => {
    let s = new Snake()
    s.dead = false
    let preMove = [s.lifetime, s.lifeLeft]
    let preBody = Array(s.body.length)
    for (let i=0; i < s.body.length; i++) {
      preBody[i] = new createVector(s.body[i].x, s.body[i].y)
    }

    s.move()

    expect(s.body).not.toEqual(preBody)
    expect([s.lifetime - 1, s.lifeLeft + 1]).toEqual(preMove)
  })

  test('eat, not a replay', () => {
    let s = new Snake()
    s.replay = false
    let preScore = s.score
    let preLife = s.lifeLeft
    let preLen = s.body.length
    let preFoodIt = s.foodItterate
    let preFoodList = s.foodList.length

    s.eat()

    expect(s.score).toEqual(preScore + 1)
    expect(s.lifeLeft).toEqual(preLife + 100)
    expect(s.body.length).toEqual(preLen + 1)
    expect(s.foodItterate).toEqual(preFoodIt)
    expect(s.foodList.length).toEqual(preFoodList+1)
  })

  test('eat, not a replay v2', () => {
    let s = new Snake()
    s.replay = false
    s.lifeLeft = 450
    let preScore = s.score
    let preLen = s.body.length
    let preFoodIt = s.foodItterate
    let preFoodList = s.foodList.length

    s.eat()

    expect(s.score).toEqual(preScore + 1)
    expect(s.lifeLeft).toEqual(500)
    expect(s.body.length).toEqual(preLen + 1)
    expect(s.foodItterate).toEqual(preFoodIt)
    expect(s.foodList.length).toEqual(preFoodList+1)
  })

  test('eat, replay', () => {
    let s = new Snake()
    s.replay = true
    let preFoodList = s.foodList.length
    let preFoodIt = s.foodItterate
    s.eat()

    expect(s.foodItterate).toEqual(preFoodIt + 1)
    expect(s.foodList.length).toEqual(preFoodList)
  })

  test('shiftBody', () => {
    let s = new Snake()
    s.xVel = SIZE
    let preHeadX = int(s.head.x)
    let preHeadY = int(s.head.y)

    let preBodyX = Array(s.body.length)
    let preBodyY = Array(s.body.length)
    for (let i = 0; i < s.body.length; i++) {
      preBodyX[i] = s.body[i].x
      preBodyY[i] = s.body[i].y
    }
    s.shiftBody()

    // check if body shifted
    for (let i = 0; i < s.body.length - 1; i++) {
      expect(preBodyX[i]).toEqual(s.body[i+1].x)
      expect(preBodyY[i]).toEqual(s.body[i+1].y)
    }
    expect(s.head.x).toEqual(preHeadX + SIZE)
    expect(s.head.y).toEqual(preHeadY)
  })

  test('cloneForReplay', () => {
    let s = new Snake()
    s.replay = false
    let clonedS = s.cloneForReplay()

    expect(s.brain).toEqual(clonedS.brain)
    expect(clonedS.replay).toBe(true)
  })

  test('clone', () => {
    let s = new Snake()
    s.replay = false
    let clonedS = s.clone()

    expect(s.brain).toEqual(clonedS.brain)
    expect(clonedS.replay).toBe(false)
  })

  test('crossover', () => {
    let s1 = new Snake()
    let s2 = new Snake()

    let child = s1.crossover(s2)
    expect(child.brain).not.toEqual(s1.brain)
    expect(child.brain).not.toEqual(s2.brain)
  })

  test('mutate', () => {
    let s = new Snake()
    let s2 = s.clone()

    s.mutate()
    expect(s2.brain).not.toEqual(s.brain)
  })

  test('fitness, score < 6', () => {
    let s = new Snake()
    s.score = 5
    s.lifetime = 100
    let output = floor(s.lifetime) * pow(2, s.score)
    s.calculateFitness()

    expect(s.fitness).toEqual(output)
  })

  test('fitness, score < 10', () => {
    let s = new Snake()
    s.score = 7
    s.lifetime = 100
    let output = floor(pow(s.lifetime, 1.5)) * pow(2, s.score)
    s.calculateFitness()

    expect(s.fitness).toEqual(output)
  })

  test('fitness, score >= 10', () => {
    let s = new Snake()
    s.score = 11
    s.lifetime = 100
    let output = floor(100 * 100) * pow(2, 10) * (11 - 9)

    s.calculateFitness()

    expect(s.fitness).toEqual(output)
  })

  test('vision, provides valid output', () => {
    let s = new Snake()
    s.look()

    for (let i = 0; i < s.vision.length; i++) {
      expect(s.vision[i]).toBeLessThanOrEqual(1)
      expect(s.vision[i]).toBeGreaterThanOrEqual(0)
    }
  })

  test('lookInDirection, food found', () => {
    let s = new Snake()
    s.replay = true
    global.seeVision = true
    s.food.pos.x = int(s.head.x + SIZE)
    s.food.pos.y = int(s.head.y) // finish

    let output = s.lookInDirection(new createVector(SIZE, 0)) // right
    global.seeVision = false
    expect(output[0]).toEqual(1)

  })

  test('lookInDirection, body found', () => {
    let s = new Snake()
    s.replay = true
    global.seeVision = true
    s.body.push(new createVector(s.head.x + SIZE, s.head.y))

    let output = s.lookInDirection(new createVector(SIZE, 0)) // right
    global.seeVision = false
    expect(output[1]).toEqual(1)
  })

  test('think, functionality', () => {
    let s = new Snake()
  })

  test('think, move up', () => {
    let s = new Snake()
    // overwrite the brain
    s.brain.output = (x => [1, 0, 0, 0])
    s.think([1,2,3])
    expect(s.xVel).toEqual(0)
    expect(s.yVel).toEqual(-SIZE)
  })

  test('think, move down', () => {
    let s = new Snake()
    // overwrite the brain
    s.brain.output = (x => [0, 1, 0, 0])
    s.think([1,2,3])
    expect(s.xVel).toEqual(0)
    expect(s.yVel).toEqual(SIZE)
  })

  test('think, move left', () => {
    let s = new Snake()
    // overwrite the brain
    s.brain.output = (x => [0, 0, 1, 0])
    s.think([1,2,3])
    expect(s.xVel).toEqual(-SIZE)
    expect(s.yVel).toEqual(0)
  })

  test('think, move right', () => {
    let s = new Snake()
    // overwrite the brain
    s.brain.output = (x => [0, 0, 0, 1])
    s.think([1,2,3])
    expect(s.xVel).toEqual(SIZE)
    expect(s.yVel).toEqual(0)
  })

  test("show, functioning", async() => {
    let s = new Snake()
    try {
      s.dead = false
      s.show()
      expect(true)
    } catch (error) {
      expect(false)
    }
    try {
      s.dead = true
      s.show()
      expect(true)
    } catch (error) {
      expect(false)
    }
  })
})

