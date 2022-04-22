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

testGroup('EvolutionGraph testing', () => {
  test('setup', () => {
    try {
      evoSetup()
      expect(true)
    } catch {
      expect(false).toBe(true)
    }
  })

  test('draw', () => {
    evolution = [0, 1, 2]
    try {
      evoDraw()
      expect(true)
    } catch {
      expect(false).toBe(true)
    }
  })
})