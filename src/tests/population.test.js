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

testGroup('Population testing', () => {
  test('Constructor, range', () => {
    let p = new Population(10)

    expect(p.bestSnake).toBeInstanceOf(Snake)
  })

  test('Constructor, error checking', () => {
    try {
      new Population(-1)
    } catch (e) {
      expect(e.message).toBe('Invalid Population Size')
    }
  })

  test('done, population is still alive', () => {
    let p = new Population(10)
    expect(p.done()).toEqual(false)
  })

  test('done, population is dead except best', () => {
    let p = new Population(10)
    for (let i=0;i<p.snakes.length;i++) {
      p.snakes[i].dead = true
    }
    p.bestSnake.dead = false
    expect(p.done()).toEqual(false)
  })

  test('done, population is dead', () => {
    let p = new Population(10)
    for (let i=0;i<p.snakes.length;i++) {
      p.snakes[i].dead = true
    }
    p.bestSnake.dead = true
    expect(p.done()).toEqual(true)
  })

  test('alive, proper count', () => {
    let p = new Population(10)
    p.snakes[1].dead = true
    p.snakes[5].dead = true

    expect(p.alive()).toEqual(8)
  })

  test('update, running wrapper', () => {
    let p = new Population(10)

    try {
      p.update()
      expect(true)
    } catch {
      expect(false)
    }
  })

  test('show, replay on', () => {
    let p = new Population(10)

    try {
      p.update()
      expect(true)
    } catch {
      expect(false)
    }
  })

  test('setBestSnake, updated fitness', () => {
    let p = new Population(10)
    p.snakes[0].fitness = 999

    p.setBestSnake()
    expect(p.bestFitness).toEqual(999)
  })

  test('naturalSelection, generation and evolution update', () => {
    let p = new Population(10)
    let gen = int(p.gen)

    global.evolution = []
    p.naturalSelection()

    expect(p.gen).toEqual(gen+1)
    expect(evolution.length).toEqual(1)
  })

  test('mutate, wrapper', () => {
    let p = new Population(10)

    try {
      p.mutate()
      expect(true)
    } catch {
      expect(false)
    }
  })

  test('calculateFitness, wrapper', () => {
    let p = new Population(10)

    try {
      p.calculateFitness()
      expect(true)
    } catch {
      expect(false)
    }
  })

  test('calculateFitnessSum, valid result', () => {
    let p = new Population(10)
    for (let i=0;i<p.snakes.length;i++) {
      p.snakes[i].fitness = i
    }

    p.calculateFitnessSum()

    expect(p.fitnessSum).toEqual(45)
  })



})