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


testGroup('NeuralNet testing', () => {
  test('Constructor weights init', () => {
    let n = new NeuralNet(24, global.hiddenNodes, 4, global.hiddenLayers)

    for (let i=0; i<n.weights.length; i++) {
      for (let j=0; j<n.weights[i].mat.length; j++) {
        for (let k=0; k<n.weights[i].mat[j].length; k++) {
          expect(n.weights[i].mat[j][k]).toBeGreaterThanOrEqual(-1)
          expect(n.weights[i].mat[j][k]).toBeLessThanOrEqual(1)
        }
      }
    }
  })

  test('Constructor invalid param 1', () => {
    try {
      let n = new NeuralNet(1, 1, 1, 'p')
    } catch (error) {
      expect(error).toBeInstanceOf(TypeError)
    }
  })

  test('Constructor invalid param 2', () => {
    try {
      let n = new NeuralNet(1, 1, 'p', 1)
    } catch (error) {
      expect(error).toBeInstanceOf(TypeError)
    }
  })

  test('Constructor invalid param 3', () => {
    try {
      let n = new NeuralNet(1, 'p', 1, 1)
    } catch (error) {
      expect(error).toBeInstanceOf(TypeError)
    }
  })

  test('Constructor invalid param 4', () => {
    try {
      let n = new NeuralNet('p', 1, 1, 1)
    } catch (error) {
      expect(error).toBeInstanceOf(TypeError)
    }
  })

  test('Mutate, wrapper function', () => {
    let n = new NeuralNet(24, global.hiddenNodes, 4, global.hiddenLayers)

    n.mutate(0.1)

    for (let i=0; i<n.weights.length; i++) {
      for (let j=0; j<n.weights[i].mat.length; j++) {
        for (let k=0; k<n.weights[i].mat[j].length; k++) {
          expect(n.weights[i].mat[j][k]).toBeGreaterThanOrEqual(-1)
          expect(n.weights[i].mat[j][k]).toBeLessThanOrEqual(1)
        }
      }
    }
  })

  test('output, passing in dummy inputs', () => {
    let n = new NeuralNet(24, global.hiddenNodes, 4, global.hiddenLayers)

    let inputs = [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]
    let outs = n.output(inputs)
    let count = 0
    print(outs)
    for (let i=0; i<outs.length;i++) {
      expect(outs[i]).toBeGreaterThanOrEqual(0)
    }
  })

  test('crossover, wrapper', () => {
    let n1 = new NeuralNet(24, global.hiddenNodes, 4, global.hiddenLayers)
    let n2 = new NeuralNet(24, global.hiddenNodes, 4, global.hiddenLayers)

    let n = n1.crossover(n2)

    for (let i=0; i<n.weights.length; i++) {
      for (let j=0; j<n.weights[i].mat.length; j++) {
        for (let k=0; k<n.weights[i].mat[j].length; k++) {
          expect(n.weights[i].mat[j][k]).toBeGreaterThanOrEqual(-1)
          expect(n.weights[i].mat[j][k]).toBeLessThanOrEqual(1)
        }
      }
    }
  })

  test('clone, wrapper', () => {
    let n = new NeuralNet(24, global.hiddenNodes, 4, global.hiddenLayers)

    let clone = n.clone()

    for (let i=0; i<n.weights.length; i++) {
      for (let j=0; j<n.weights[i].mat.length; j++) {
        for (let k=0; k<n.weights[i].mat[j].length; k++) {
          expect(n.weights[i].mat[j][k]).toEqual(clone.weights[i].mat[j][k])
        }
      }
    }
  })

  test('load, random weights', () => {
    let n = new NeuralNet(24, global.hiddenNodes, 4, global.hiddenLayers)

    let weights = Array.apply(null, Array(3)).map(Number.prototype.valueOf, 0)
    weights[0] = new Matrix(n.hNodes, n.iNodes + 1)
    for (let i = 1; i < n.hLayers; i++) {
      weights[i] = new Matrix(n.hNodes, n.hNodes + 1)
    }

    weights[weights.length - 1] = new Matrix(n.oNodes, n.hNodes + 1)

    for (let i = 0; i < weights.length; i++) {
      weights[i].randomize()
    }

    n.load(weights)

    for (let i = 0; i < n.weights.length; i++) {
      expect(n.weights[i]).toEqual(weights[i])
    }
  })

  test('pull, valid weights', () => {
    let n = new NeuralNet(24, global.hiddenNodes, 4, global.hiddenLayers)

    let outs = n.pull()


  for (let i=0; i<outs.length; i++) {
    for (let j=0; j<outs[i].length; j++) {
      for (let k=0; k<outs[i][j].length; k++) {
        expect(outs[i][j][k]).toBeGreaterThanOrEqual(-1)
        expect(outs[i][j][k]).toBeLessThanOrEqual(1)
      }
    }
  }
  })

  test('show, visible', () => {

    let model = new Snake()
    model.look()
    model.think()
    model.move()
    model.show()
    model.brain.show(0, 0, 360, 790, model.vision, model.decision)
    expect(true)
  })
})
