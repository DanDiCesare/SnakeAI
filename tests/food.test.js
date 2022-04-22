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

testGroup('Food testing', () => {
  test('Constructor, x param range', () => {
    let f = new Food()

    expect(f.pos.x).toBeGreaterThanOrEqual(400 + SIZE)
    expect(f.pos.x).toBeLessThanOrEqual(width - SIZE)
  })

  test('Constructor, y param range', () => {
    let f = new Food()

    expect(f.pos.y).toBeGreaterThanOrEqual(SIZE)
    expect(f.pos.y).toBeLessThanOrEqual(height - SIZE)
  })

  test('show, functionality', () => {
    let f = new Food()
    try {
      f.show()
      expect(true)
    } catch {
      expect(false).toBe(true)
    }
  })

  test('clone', () => {
    let f = new Food()
    let c = f.clone()

    expect(f.pos.x).toEqual(c.pos.x)
    expect(f.pos.y).toEqual(c.pos.y)
  })
})